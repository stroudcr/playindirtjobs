import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

const querySchema = z.string().regex(/^cs_(test_|live_)[A-Za-z0-9]+$/).max(255);

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(request.nextUrl.searchParams.get("session_id"));
  if (!parsed.success) {
    return NextResponse.json({ state: "invalid", message: "A valid Checkout Session is required." }, { status: 400 });
  }

  let purchase = await db.purchase.findUnique({
    where: { stripeCheckoutSessionId: parsed.data },
    include: { job: { select: { slug: true, active: true } } },
  });

  let stripePaymentStatus: string | undefined;
  if (!purchase) {
    try {
      const session = await stripe.checkout.sessions.retrieve(parsed.data);
      stripePaymentStatus = session.payment_status;
      const purchaseId = session.metadata?.purchaseId || session.client_reference_id;
      if (purchaseId) {
        purchase = await db.purchase.findUnique({
          where: { id: purchaseId },
          include: { job: { select: { slug: true, active: true } } },
        });
      }
    } catch {
      return NextResponse.json({ state: "invalid", message: "Checkout Session was not found." }, { status: 404 });
    }
  }

  if (!purchase) {
    return NextResponse.json(
      {
        state: stripePaymentStatus === "paid" ? "processing" : "pending",
        message: stripePaymentStatus === "paid" ? "Payment is confirmed and publication is being recovered." : "Payment is not yet confirmed.",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  if (purchase.status === "PAID" && purchase.job?.active) {
    return NextResponse.json(
      { state: "published", job: { slug: purchase.job.slug } },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
  if (purchase.status === "FAILED") {
    return NextResponse.json(
      { state: "recovery", message: "Payment may be complete, but publication needs another attempt. We have kept your draft." },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
  if (purchase.status === "CANCELED") {
    return NextResponse.json(
      { state: "canceled", message: "Checkout expired or was canceled. Your draft is still available." },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
  if (purchase.status === "REFUNDED") {
    return NextResponse.json(
      { state: "refunded", message: "This payment was fully refunded. Contact support if you expected the listing to remain active." },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      state: purchase.status === "PROCESSING" || stripePaymentStatus === "paid" ? "processing" : "pending",
      message: purchase.status === "PROCESSING" ? "Payment is confirmed. Your listing is being published." : "Waiting for payment confirmation.",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
