import "server-only";
import type { Prisma } from "@prisma/client";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getUrl } from "@/lib/metadata";
import { WORKSHOP_FEE_CENTS } from "@/lib/workshop-types";
import { workshopSchema, type WorkshopInput } from "@/lib/workshop-validation";
import { slugify } from "@/lib/utils";

export function workshopData(input: WorkshopInput) {
  return {
    ...input,
    startAt: input.startAt ? new Date(input.startAt) : null,
    endAt: input.endAt ? new Date(input.endAt) : null,
    registrationClosesAt: input.registrationClosesAt
      ? new Date(input.registrationClosesAt)
      : null,
  };
}
export function workshopMessage(title: string, message: string, token: string) {
  return {
    subject: title,
    heading: title,
    message,
    actionLabel: "Manage your workshop",
    actionUrl: getUrl(`/manage/workshops/${token}`),
  };
}
export async function createWorkshopCheckout(
  input: WorkshopInput,
  requestId: string,
  accessToken: string,
) {
  // One immutable submission and one Checkout Session per browser-generated request.
  // Concurrent requests reuse Stripe's idempotency key rather than charging twice.
  let workshop = await db.workshop.findUnique({
    where: { id: requestId },
    include: { order: true },
  });
  if (!workshop) {
    try {
      workshop = await db.workshop.create({
        data: {
          id: requestId,
          slug: slugify(
            `${input.title}-${input.organization}-${requestId.slice(0, 8)}`,
          ),
          ...workshopData(input),
          editToken: accessToken,
          status: "DRAFT",
          origin: "PAID",
          order: {
            create: {
              amount: WORKSHOP_FEE_CENTS,
              snapshot: input as unknown as Prisma.InputJsonValue,
            },
          },
        },
        include: { order: true },
      });
    } catch (error) {
      workshop = await db.workshop.findUnique({
        where: { id: requestId },
        include: { order: true },
      });
      if (!workshop) throw error;
    }
  }
  if (workshop.editToken !== accessToken || !workshop.order)
    throw new Error("This draft is not accessible.");
  const order = workshop.order;
  if (order.status !== "PENDING")
    return {
      restart: true,
      error:
        order.status === "PAID"
          ? "This workshop has already been paid for. Use your emailed management link."
          : "This checkout has ended. Start a new submission to continue.",
    };
  if (order.stripeCheckoutSessionId) {
    const existing = await stripe.checkout.sessions.retrieve(
      order.stripeCheckoutSessionId,
    );
    if (existing.status === "open" && existing.url)
      return { url: existing.url };
    if (existing.status === "complete")
      return { error: "Payment is being confirmed. Check your email shortly." };
    return {
      restart: true,
      error: "This checkout expired. Start a new submission to continue.",
    };
  }
  const snapshot = workshopSchema.parse(order.snapshot);
  const metadata = {
    product: "workshop",
    workshopOrderId: order.id,
    workshopId: workshop.id,
  };
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      client_reference_id: order.id,
      customer_email: snapshot.managementEmail,
      metadata,
      payment_intent_data: { metadata },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: WORKSHOP_FEE_CENTS,
            product_data: {
              name: "PlayInDirtJobs workshop listing",
              description: `${snapshot.title} · up to 60 days · reviewed before publication`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: getUrl("/success/workshop?session_id={CHECKOUT_SESSION_ID}"),
      cancel_url: getUrl(`/post-workshop?canceled=1`),
    },
    { idempotencyKey: `workshop:${order.id}` },
  );
  const linked = await db.workshopOrder.updateMany({
    where: { id: order.id, status: "PENDING" },
    data: { stripeCheckoutSessionId: session.id },
  });
  if (!linked.count) {
    if (session.status === "open")
      await stripe.checkout.sessions.expire(session.id);
    return {
      restart: true,
      error: "This checkout has closed. Start a new submission to continue.",
    };
  }
  return { url: session.url };
}

export function validateWorkshopPayment(
  session: Stripe.Checkout.Session,
  order: {
    id: string;
    workshopId: string;
    stripeCheckoutSessionId: string | null;
  },
) {
  if (
    session.mode !== "payment" ||
    session.status !== "complete" ||
    session.payment_status !== "paid" ||
    session.currency !== "usd" ||
    session.amount_total !== WORKSHOP_FEE_CENTS ||
    session.amount_subtotal !== WORKSHOP_FEE_CENTS ||
    session.client_reference_id !== order.id ||
    session.metadata?.product !== "workshop" ||
    session.metadata?.workshopOrderId !== order.id ||
    session.metadata?.workshopId !== order.workshopId ||
    (order.stripeCheckoutSessionId &&
      session.id !== order.stripeCheckoutSessionId)
  )
    throw new Error("Workshop payment does not match the purchased listing.");
}

export async function processWorkshopStripeEvent(event: Stripe.Event) {
  const object = event.data.object as unknown as {
    metadata?: Record<string, string>;
  };
  if (object.metadata?.product !== "workshop") return false;
  const orderId = object.metadata.workshopOrderId;
  if (!orderId) throw new Error("Workshop payment is missing its order.");
  const order = await db.workshopOrder.findUnique({
    where: { id: orderId },
    include: { workshop: true },
  });
  if (!order) throw new Error("Workshop order not found.");
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      validateWorkshopPayment(session, order);
      const snapshot = workshopSchema.parse(order.snapshot);
      await db.$transaction(async (tx) => {
        const changed = await tx.workshopOrder.updateMany({
          where: {
            id: order.id,
            status: { in: ["PENDING", "CANCELED", "FAILED"] },
          },
          data: {
            status: "PAID",
            paidAt: new Date(),
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id,
          },
        });
        if (!changed.count) return; // Duplicate and refund-before-completion events cannot republish.
        await tx.workshop.update({
          where: { id: order.workshopId },
          data: { ...workshopData(snapshot), status: "PENDING_REVIEW" },
        });
        await tx.emailOutbox.upsert({
          where: { deduplicationKey: `${order.id}:workshop-receipt` },
          update: {},
          create: {
            recipient: snapshot.managementEmail,
            template: "WORKSHOP_MESSAGE",
            deduplicationKey: `${order.id}:workshop-receipt`,
            payload: workshopMessage(
              "Your workshop listing payment is confirmed",
              `We received your $15.00 USD one-time listing payment for “${snapshot.title}”. Your listing is awaiting review, normally within one business day. Your promotion starts when it is approved and runs for up to 60 days or until registration closes. There is no automatic renewal. Receipt reference: ${session.payment_intent || session.id}.`,
              order.workshop.editToken,
            ),
          },
        });
      });
    }
  } else if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    if (charge.refunded || charge.amount_refunded >= charge.amount)
      await db.$transaction([
        db.workshopOrder.update({
          where: { id: order.id },
          data: { status: "REFUNDED" },
        }),
        db.workshop.update({
          where: { id: order.workshopId },
          data: { status: "REJECTED" },
        }),
      ]);
  } else if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    await db.workshopOrder.updateMany({
      where: {
        id: order.id,
        status: "PENDING",
        stripeCheckoutSessionId: session.id,
      },
      data: { status: event.type.endsWith("expired") ? "CANCELED" : "FAILED" },
    });
  }
  await db.stripeEvent.update({
    where: { id: event.id },
    data: { processedAt: new Date(), lastError: null },
  });
  return true;
}
