import { after, NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import type { Prisma } from "@prisma/client";
import type Stripe from "stripe";

import { db } from "@/lib/db";
import { processEmailOutboxItem } from "@/lib/email-outbox";
import { notifyGoogleAboutJob } from "@/lib/google-indexing";
import { stripe } from "@/lib/stripe";
import {
  isCheckoutSessionSettled,
  settledCheckoutFacts,
} from "@/lib/stripe-checkout";
import { slugify } from "@/lib/utils";
import { postingSchema } from "@/lib/validations";

export const runtime = "nodejs";

function jsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function paymentIntentId(session: Stripe.Checkout.Session) {
  if (typeof session.payment_intent === "string") return session.payment_intent;
  return session.payment_intent?.id ?? null;
}

async function markEventProcessed(eventId: string) {
  await db.stripeEvent.update({
    where: { id: eventId },
    data: { processedAt: new Date(), lastError: null },
  });
}

async function publishPaidCheckout(eventId: string, session: Stripe.Checkout.Session) {
  if (!isCheckoutSessionSettled(session)) {
    await markEventProcessed(eventId);
    return null;
  }

  const purchaseId = session.metadata?.purchaseId;
  if (!purchaseId) throw new Error("Paid Checkout Session is missing purchase metadata.");

  const purchase = await db.purchase.findUnique({
    where: { id: purchaseId },
    include: { draft: true, employer: { select: { email: true } } },
  });
  if (!purchase?.draft) throw new Error(`Purchase ${purchaseId} has no recoverable draft.`);

  const checkout = settledCheckoutFacts(session, {
    id: purchase.id,
    draftId: purchase.draftId,
    employerId: purchase.employerId,
    sourceJobId: purchase.draft.sourceJobId,
  });

  if (purchase.status === "PAID" && purchase.jobId) {
    await markEventProcessed(eventId);
    return db.job.findUnique({ where: { id: purchase.jobId } });
  }
  // A full refund can arrive before the Checkout event because Stripe does not
  // guarantee webhook ordering. Never publish a purchase already known refunded.
  if (purchase.status === "REFUNDED") {
    await markEventProcessed(eventId);
    return null;
  }

  const staleProcessingBefore = new Date(Date.now() - 5 * 60 * 1_000);
  const claimed = await db.purchase.updateMany({
    where: {
      id: purchase.id,
      OR: [
        { status: { in: ["PENDING", "FAILED"] } },
        { status: "PROCESSING", updatedAt: { lt: staleProcessingBefore } },
      ],
    },
    data: {
      status: "PROCESSING",
      plan: checkout.plan,
      kind: checkout.kind,
      amount: session.amount_total ?? checkout.amount,
    },
  });
  if (claimed.count === 0) {
    throw new Error(`Purchase ${purchase.id} is already being processed; retrying safely.`);
  }

  const raw = purchase.draft.data && typeof purchase.draft.data === "object" && !Array.isArray(purchase.draft.data)
    ? (purchase.draft.data as Record<string, unknown>)
    : {};
  const posting = postingSchema.safeParse({
    ...raw,
    salaryMin: raw.salaryMin === "" || raw.salaryMin == null ? undefined : Number(raw.salaryMin),
    salaryMax: raw.salaryMax === "" || raw.salaryMax == null ? undefined : Number(raw.salaryMax),
  });
  if (!posting.success) {
    await db.purchase.updateMany({
      where: { id: purchase.id, status: "PROCESSING" },
      data: { status: "FAILED" },
    });
    throw new Error(`Paid posting draft failed validation: ${posting.error.message}`);
  }

  const data = posting.data;
  const managementEmail = data.managementEmail.toLowerCase();
  if (!purchase.employer || purchase.employer.email.trim().toLowerCase() !== managementEmail) {
    await db.purchase.updateMany({
      where: { id: purchase.id, status: "PROCESSING" },
      data: { status: "FAILED" },
    });
    throw new Error("Paid posting management email no longer matches its employer owner.");
  }
  const now = new Date();
  const stripePaymentIntentId = paymentIntentId(session);
  const formattedLocation = data.remote ? `${data.city}, ${data.state} (Remote)` : `${data.city}, ${data.state}`;
  const plan = checkout.plan;
  const outboxIds: string[] = [];

  try {
    const job = await db.$transaction(async (tx) => {
      let publishedJob;

      if (checkout.kind === "RENEWAL") {
        if (!purchase.draft?.sourceJobId || !purchase.employerId) {
          throw new Error("Renewal purchase is missing its source job or employer.");
        }
        const sourceJob = await tx.job.findFirst({
          where: { id: purchase.draft.sourceJobId, employerId: purchase.employerId },
        });
        if (!sourceJob) throw new Error("The renewal source job is not owned by this employer.");

        const expirationBase = sourceJob.expiresAt > now ? sourceJob.expiresAt : now;
        const expiresAt = new Date(expirationBase);
        expiresAt.setDate(expiresAt.getDate() + 60);
        publishedJob = await tx.job.update({
          where: { id: sourceJob.id },
          data: {
            title: data.title,
            company: data.company,
            description: data.description,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode || null,
            remote: data.remote,
            location: formattedLocation,
            salaryMin: data.salaryMin ?? null,
            salaryMax: data.salaryMax ?? null,
            salaryType: data.salaryType,
            jobType: data.jobType,
            farmType: data.farmType,
            categories: data.categories,
            tags: data.tags,
            benefits: data.benefits,
            companyEmail: managementEmail,
            managementEmail,
            companyWebsite: data.companyWebsite || null,
            companyLogo: data.companyLogo || null,
            applyUrl: data.applyUrl || null,
            applyEmail: data.applyEmail || null,
            featured: plan === "featured",
            active: true,
            publishedAt: now,
            closedAt: null,
            closeReason: null,
            hireSource: null,
            stripePaymentId: stripePaymentIntentId,
            expiresAt,
          },
        });
      } else {
        const expiresAt = new Date(now);
        expiresAt.setDate(expiresAt.getDate() + 60);
        publishedJob = await tx.job.create({
          data: {
            slug: slugify(`${data.title}-${data.company}-${Date.now()}-${purchase.id.slice(-6)}`),
            title: data.title,
            company: data.company,
            description: data.description,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode || null,
            remote: data.remote,
            location: formattedLocation,
            salaryMin: data.salaryMin ?? null,
            salaryMax: data.salaryMax ?? null,
            salaryType: data.salaryType,
            jobType: data.jobType,
            farmType: data.farmType,
            categories: data.categories,
            tags: data.tags,
            benefits: data.benefits,
            companyEmail: managementEmail,
            managementEmail,
            companyWebsite: data.companyWebsite || null,
            companyLogo: data.companyLogo || null,
            applyUrl: data.applyUrl || null,
            applyEmail: data.applyEmail || null,
            featured: plan === "featured",
            active: true,
            origin: "EMPLOYER",
            publishedAt: now,
            stripePaymentId: stripePaymentIntentId,
            employerId: purchase.employerId,
            expiresAt,
          },
        });
      }

      const receipt = await tx.emailOutbox.create({
        data: {
          template: "PAYMENT_RECEIPT",
          recipient: managementEmail,
          deduplicationKey: `${purchase.id}:receipt`,
          payload: jsonValue({
            jobTitle: publishedJob.title,
            company: publishedJob.company,
            plan,
            amount: session.amount_total ?? purchase.amount,
            transactionId: stripePaymentIntentId || session.id,
            date: now.toISOString(),
          }),
        },
      });
      const confirmation = await tx.emailOutbox.create({
        data: {
          template: "JOB_CONFIRMATION",
          recipient: managementEmail,
          deduplicationKey: `${purchase.id}:confirmation`,
          payload: jsonValue({
            id: publishedJob.id,
            title: publishedJob.title,
            company: publishedJob.company,
            slug: publishedJob.slug,
            editToken: publishedJob.editToken,
          }),
        },
      });
      outboxIds.push(receipt.id, confirmation.id);

      await tx.purchase.update({
        where: { id: purchase.id },
        data: {
          status: "PAID",
          jobId: publishedJob.id,
          plan,
          kind: checkout.kind,
          amount: session.amount_total ?? checkout.amount,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId,
          paidAt: now,
        },
      });
      await tx.jobDraft.update({
        where: { id: purchase.draft!.id },
        data: { status: "CONVERTED", employerId: purchase.employerId },
      });
      await tx.funnelEvent.createMany({
        data: [
          {
            eventName: "checkout_completed",
            jobId: publishedJob.id,
            employerId: purchase.employerId,
            draftId: purchase.draft!.id,
            purchaseId: purchase.id,
            source: "stripe_webhook",
            properties: jsonValue({ plan, amount: session.amount_total ?? checkout.amount, kind: checkout.kind }),
          },
          {
            eventName: checkout.kind === "RENEWAL" ? "renewal_completed" : "job_published",
            jobId: publishedJob.id,
            employerId: purchase.employerId,
            draftId: purchase.draft!.id,
            purchaseId: purchase.id,
            source: "stripe_webhook",
          },
        ],
      });
      await tx.stripeEvent.update({
        where: { id: eventId },
        data: { processedAt: now, lastError: null },
      });

      return publishedJob;
    });

    try {
      revalidateTag("public-jobs");
    } catch (error) {
      console.error("Published job cache revalidation failed:", error);
    }
    after(async () => {
      await Promise.allSettled([
        notifyGoogleAboutJob(job.slug, "URL_UPDATED"),
        ...outboxIds.map((id) => processEmailOutboxItem(id)),
      ]);
    });
    return job;
  } catch (error) {
    await db.purchase.updateMany({
      where: { id: purchase.id, status: "PROCESSING" },
      data: { status: "FAILED" },
    }).catch(() => undefined);
    throw error;
  }
}

async function handleCheckoutFailure(eventId: string, session: Stripe.Checkout.Session, canceled: boolean) {
  const purchaseId = session.metadata?.purchaseId || session.client_reference_id;
  if (purchaseId) {
    const purchase = await db.purchase.findUnique({ where: { id: purchaseId }, select: { id: true, draftId: true, status: true } });
    if (purchase) {
      await db.$transaction(async (tx) => {
        // Only the currently linked, still-pending attempt may fail the purchase.
        // An old expired Session must not overwrite a newer PROCESSING/PAID one.
        const changed = await tx.purchase.updateMany({
          where: {
            id: purchase.id,
            status: "PENDING",
            stripeCheckoutSessionId: session.id,
          },
          data: { status: canceled ? "CANCELED" : "FAILED" },
        });
        if (changed.count > 0 && purchase.draftId) {
          await tx.jobDraft.updateMany({
            where: { id: purchase.draftId, status: "CHECKOUT" },
            data: { status: "DRAFT" },
          });
        }
        await tx.stripeEvent.update({
          where: { id: eventId },
          data: { processedAt: new Date(), lastError: null },
        });
      });
      return;
    }
  }
  await markEventProcessed(eventId);
}

async function handleRefund(eventId: string, charge: Stripe.Charge) {
  const fullyRefunded = charge.refunded || charge.amount_refunded >= charge.amount;
  if (!fullyRefunded) {
    await markEventProcessed(eventId);
    return;
  }
  const intentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  const metadataPurchaseId = charge.metadata?.purchaseId;
  const metadataDraftId = charge.metadata?.draftId;
  const metadataEmployerId = charge.metadata?.employerId;
  const hasCompleteMetadata = Boolean(metadataPurchaseId && metadataDraftId && metadataEmployerId);
  if (intentId || hasCompleteMetadata) {
    await db.purchase.updateMany({
      where: {
        OR: [
          ...(intentId ? [{ stripePaymentIntentId: intentId }] : []),
          ...(hasCompleteMetadata
            ? [{ id: metadataPurchaseId!, draftId: metadataDraftId!, employerId: metadataEmployerId! }]
            : []),
        ],
      },
      data: { status: "REFUNDED" },
    });
  }
  await markEventProcessed(eventId);
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  const eventRecord = await db.stripeEvent.upsert({
    where: { id: event.id },
    create: {
      id: event.id,
      type: event.type,
      attempts: 1,
      payload: jsonValue({ livemode: event.livemode, created: event.created, objectId: (event.data.object as { id?: string }).id }),
    },
    update: {
      attempts: { increment: 1 },
    },
  });
  if (eventRecord.processedAt) return NextResponse.json({ received: true, duplicate: true });

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await publishPaidCheckout(event.id, event.data.object as Stripe.Checkout.Session);
        break;
      case "checkout.session.async_payment_failed":
        await handleCheckoutFailure(event.id, event.data.object as Stripe.Checkout.Session, false);
        break;
      case "checkout.session.expired":
        await handleCheckoutFailure(event.id, event.data.object as Stripe.Checkout.Session, true);
        break;
      case "charge.refunded":
        await handleRefund(event.id, event.data.object as Stripe.Charge);
        break;
      default:
        await markEventProcessed(event.id);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook processing error";
    console.error(`Stripe event ${event.id} failed:`, error);
    await db.stripeEvent.updateMany({
      where: { id: event.id, processedAt: null },
      data: { lastError: message.slice(0, 4_000) },
    }).catch(() => undefined);
    return NextResponse.json({ error: "Webhook processing failed; retry is required." }, { status: 500 });
  }
}
