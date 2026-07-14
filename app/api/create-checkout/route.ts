import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { PRICING } from "@/lib/constants";
import { db } from "@/lib/db";
import { getAccessibleDraft } from "@/lib/draft-access";
import { stripe } from "@/lib/stripe";
import { checkoutSessionMatchesIntent } from "@/lib/stripe-checkout";
import { postingSchema } from "@/lib/validations";

export const runtime = "nodejs";

const checkoutSchema = z.object({
  draftId: z.string().cuid(),
});

function jsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function POST(request: NextRequest) {
  const parsedRequest = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsedRequest.success) {
    return NextResponse.json({ error: "Invalid posting draft." }, { status: 400 });
  }

  const draft = await getAccessibleDraft(request, parsedRequest.data.draftId);
  if (!draft) {
    return NextResponse.json({ error: "This posting draft is unavailable or has expired." }, { status: 404 });
  }

  const raw = draft.data && typeof draft.data === "object" && !Array.isArray(draft.data)
    ? (draft.data as Record<string, unknown>)
    : {};
  const posting = postingSchema.safeParse({
    ...raw,
    salaryMin: raw.salaryMin === "" || raw.salaryMin == null ? undefined : Number(raw.salaryMin),
    salaryMax: raw.salaryMax === "" || raw.salaryMax == null ? undefined : Number(raw.salaryMax),
  });
  if (!posting.success) {
    return NextResponse.json(
      { error: "Review the highlighted posting details before payment.", details: posting.error.flatten() },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return NextResponse.json({ error: "Checkout is not configured." }, { status: 503 });
  }

  const plan = draft.plan === "featured" ? "featured" : "basic";
  const amount = plan === "featured" ? PRICING.FEATURED : PRICING.BASIC;
  const managementEmail = posting.data.managementEmail.toLowerCase();
  const kind = draft.sourceJobId ? "RENEWAL" : "POSTING";

  const existingPurchase = await db.purchase.findUnique({
    where: { draftId: draft.id },
    select: { id: true, status: true, jobId: true, stripeCheckoutSessionId: true },
  });
  if (existingPurchase && ["PAID", "PROCESSING", "REFUNDED"].includes(existingPurchase.status)) {
    if (existingPurchase.stripeCheckoutSessionId) {
      return NextResponse.json({
        url: `${appUrl}/success?session_id=${encodeURIComponent(existingPurchase.stripeCheckoutSessionId)}`,
        sessionId: existingPurchase.stripeCheckoutSessionId,
      });
    }
    return NextResponse.json(
      { error: "This purchase is already being finalized. Check your employer workspace before paying again." },
      { status: 409 }
    );
  }

  // Renewals remain bound to the verified owner. New postings may be safely
  // reassociated while unpaid so an anonymous author can correct an email typo.
  const employer = draft.sourceJobId
    ? draft.employerId
      ? await db.employer.findUnique({ where: { id: draft.employerId } })
      : null
    : await db.employer.upsert({
        where: { email: managementEmail },
        // Knowing an existing account's email must not let an anonymous draft
        // overwrite that employer's workspace profile.
        update: {},
        create: { email: managementEmail, company: posting.data.company },
      });
  if (!employer) {
    return NextResponse.json({ error: "The employer account for this draft no longer exists." }, { status: 409 });
  }
  if (draft.sourceJobId) {
    if (employer.email.trim().toLowerCase() !== managementEmail) {
      return NextResponse.json(
        { error: "Renewals must use the management email for the account that owns this listing." },
        { status: 403 }
      );
    }
    const renewalJob = await db.job.findFirst({
      where: { id: draft.sourceJobId, employerId: employer.id },
      select: { id: true },
    });
    if (!renewalJob) {
      return NextResponse.json({ error: "This listing is not eligible for renewal from the current account." }, { status: 403 });
    }
  }

  let purchase = await db.purchase.upsert({
    where: { draftId: draft.id },
    // Preserve the identity attached to an existing attempt until Stripe has
    // confirmed that attempt is closed. This avoids racing a payment in another tab.
    update: {},
    create: {
      draftId: draft.id,
      employerId: employer.id,
      plan,
      amount,
      kind,
    },
  });

  const checkoutIntent = {
    purchaseId: purchase.id,
    draftId: draft.id,
    employerId: employer.id,
    plan,
    kind,
    amount,
  } as const;
  const previousSessionId = purchase.stripeCheckoutSessionId;

  if (purchase.stripeCheckoutSessionId) {
    try {
      const currentSession = await stripe.checkout.sessions.retrieve(purchase.stripeCheckoutSessionId);
      const matchesCurrentSelection = checkoutSessionMatchesIntent(currentSession, checkoutIntent);
      if (currentSession.status === "open" && matchesCurrentSelection && currentSession.url) {
        return NextResponse.json({ url: currentSession.url, sessionId: currentSession.id });
      }
      // A submitted Checkout Session may still be waiting on an asynchronous
      // payment method. Never open another payable session while that is pending.
      if (
        currentSession.status === "complete" &&
        (purchase.status === "PENDING" || currentSession.payment_status !== "unpaid")
      ) {
        return NextResponse.json({
          url: `${appUrl}/success?session_id=${encodeURIComponent(currentSession.id)}`,
          sessionId: currentSession.id,
        });
      }
      if (currentSession.status === "open") {
        // For example, a Basic session must be expired before opening a new
        // Featured session. Otherwise $15 could grant the $25 entitlement.
        await stripe.checkout.sessions.expire(currentSession.id);
      }
    } catch (error) {
      console.error("Unable to verify an earlier Checkout Session.", error);
      return NextResponse.json(
        { error: "Unable to verify the earlier checkout attempt. Please try again before paying." },
        { status: 502 }
      );
    }
  }

  let createdSession: Awaited<ReturnType<typeof stripe.checkout.sessions.create>> | null = null;
  try {
    // Clear the link to any closed attempt before creating the next one so a
    // delayed expiration/failure webhook cannot cancel the new attempt.
    const prepared = await db.purchase.updateMany({
      where: {
        id: purchase.id,
        updatedAt: purchase.updatedAt,
        status: { in: ["PENDING", "FAILED", "CANCELED"] },
        stripeCheckoutSessionId: previousSessionId,
      },
      data: {
        employerId: employer.id,
        plan,
        amount,
        kind,
        status: "PENDING",
        stripeCheckoutSessionId: null,
        stripePaymentIntentId: null,
      },
    });
    if (prepared.count === 0) {
      return NextResponse.json(
        { error: "Another checkout attempt changed this draft. Please try again before paying." },
        { status: 409 }
      );
    }
    const preparedPurchase = await db.purchase.findUnique({ where: { id: purchase.id } });
    if (!preparedPurchase) {
      return NextResponse.json({ error: "This purchase is no longer available." }, { status: 409 });
    }
    purchase = preparedPurchase;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        customer_email: managementEmail,
        client_reference_id: purchase.id,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${plan === "featured" ? "Featured" : "Basic"} 60-day job posting`,
                description: `${posting.data.title} at ${posting.data.company}`.slice(0, 500),
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/post-job?draft=${encodeURIComponent(draft.id)}&checkout=cancelled`,
        allow_promotion_codes: true,
        payment_intent_data: {
          metadata: {
            purchaseId: purchase.id,
            draftId: draft.id,
            employerId: employer.id,
          },
        },
        metadata: {
          purchaseId: purchase.id,
          draftId: draft.id,
          employerId: employer.id,
          plan,
          kind,
        },
      },
      {
        idempotencyKey: `posting-checkout:${purchase.id}:${previousSessionId || "initial"}:${draft.updatedAt.getTime()}`,
      }
    );
    createdSession = session;

    if (!session.url) throw new Error("Stripe did not return a Checkout URL.");

    const linked = await db.$transaction(async (tx) => {
      const claimed = await tx.purchase.updateMany({
        where: {
          id: purchase.id,
          status: "PENDING",
          employerId: employer.id,
          stripeCheckoutSessionId: null,
        },
        data: { stripeCheckoutSessionId: session.id },
      });
      if (claimed.count === 0) return false;

      await tx.jobDraft.updateMany({
        where: { id: draft.id, status: { in: ["DRAFT", "CHECKOUT"] } },
        data: {
          status: "CHECKOUT",
          employerId: employer.id,
          email: managementEmail,
        },
      });
      await tx.funnelEvent.create({
        data: {
          eventName: "checkout_started",
          draftId: draft.id,
          employerId: employer.id,
          purchaseId: purchase.id,
          source: "posting_wizard",
          properties: jsonValue({ plan, amount, kind }),
        },
      });
      return true;
    });

    if (!linked) {
      const current = await db.purchase.findUnique({
        where: { id: purchase.id },
        select: { status: true, stripeCheckoutSessionId: true },
      });
      if (current?.stripeCheckoutSessionId === session.id) {
        return NextResponse.json({ url: session.url, sessionId: session.id });
      }
      if (session.status === "open") {
        await stripe.checkout.sessions.expire(session.id).catch(() => undefined);
      }
      if (current?.stripeCheckoutSessionId && ["PAID", "PROCESSING"].includes(current.status)) {
        return NextResponse.json({
          url: `${appUrl}/success?session_id=${encodeURIComponent(current.stripeCheckoutSessionId)}`,
          sessionId: current.stripeCheckoutSessionId,
        });
      }
      throw new Error("A different checkout attempt became active. Please try again.");
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Checkout creation failed:", error);
    if (createdSession?.status === "open") {
      await stripe.checkout.sessions.expire(createdSession.id).catch(() => undefined);
    }
    await db.purchase.updateMany({
      where: { id: purchase.id, status: "PENDING", updatedAt: purchase.updatedAt },
      data: { status: "FAILED" },
    }).catch(() => undefined);
    return NextResponse.json({ error: "Unable to open secure checkout. Please try again." }, { status: 502 });
  }
}
