import { after, NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { AuthenticationError, requireAdminMutation } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { isSameOrigin } from "@/lib/workshop-security";
import { workshopExpiration } from "@/lib/workshop-types";
import { workshopMessage } from "@/lib/workshop-payments";
import { processEmailOutboxItem } from "@/lib/email-outbox";
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve") }),
  z.object({
    action: z.literal("reject"),
    note: z.string().trim().min(5).max(1000),
  }),
  z.object({
    action: z.literal("assign_owner"),
    email: z.string().email().max(254),
  }),
]);
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  try {
    await requireAdminMutation();
  } catch (error) {
    if (error instanceof AuthenticationError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    throw error;
  }
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success)
    return NextResponse.json(
      { error: input.error.issues[0].message },
      { status: 400 },
    );
  const workshop = await db.workshop.findUnique({
    where: { id: (await params).id },
    include: { order: true },
  });
  if (!workshop)
    return NextResponse.json({ error: "Workshop not found." }, { status: 404 });
  const now = new Date();
  let message = "",
    title = "",
    recipient = workshop.managementEmail;
  if (input.data.action === "assign_owner") {
    if (workshop.origin !== "GIFTED" || workshop.managementEmail)
      return NextResponse.json(
        { error: "Owner already assigned or this is a paid listing." },
        { status: 409 },
      );
    recipient = input.data.email.trim().toLowerCase();
    const assigned = await db.workshop.updateMany({
      where: {
        id: workshop.id,
        managementEmail: null,
        updatedAt: workshop.updatedAt,
      },
      data: { managementEmail: recipient },
    });
    if (!assigned.count)
      return NextResponse.json(
        { error: "This listing changed. Refresh before assigning ownership." },
        { status: 409 },
      );
    title = "Your complimentary workshop listing";
    message = `PlayInDirtJobs has gifted the first promotional listing for “${workshop.title}”. There is no charge and no automatic renewal. You can edit the details, mark it full, or remove it with your private management link.`;
  } else {
    if (
      workshop.status !== "PENDING_REVIEW" &&
      !(input.data.action === "reject" && workshop.status === "REJECTING")
    )
      return NextResponse.json(
        { error: "This listing is no longer awaiting review." },
        { status: 409 },
      );
    if (input.data.action === "approve") {
      if (workshop.origin !== "GIFTED" && workshop.order?.status !== "PAID")
        return NextResponse.json(
          { error: "A settled listing payment is required." },
          { status: 409 },
        );
      const publishedAt = workshop.publishedAt ?? now;
      const promotionEndsAt =
        workshop.promotionEndsAt ??
        new Date(publishedAt.getTime() + 60 * 86400000);
      const expiresAt = new Date(
        Math.min(
          promotionEndsAt.getTime(),
          workshopExpiration(
            publishedAt,
            workshop.startAt,
            workshop.registrationClosesAt,
          ).getTime(),
        ),
      );
      if (expiresAt <= now)
        return NextResponse.json(
          {
            error:
              "The workshop or promotion has ended. Request a correction or reject and refund.",
          },
          { status: 409 },
        );
      const approved = await db.workshop.updateMany({
        where: {
          id: workshop.id,
          status: "PENDING_REVIEW",
          updatedAt: workshop.updatedAt,
          ...(workshop.origin === "GIFTED"
            ? {}
            : { order: { is: { status: "PAID" } } }),
        },
        data: {
          status: "PUBLISHED",
          publishedAt,
          promotionEndsAt,
          expiresAt,
          verifiedAt: now,
          reviewNote: null,
        },
      });
      if (!approved.count)
        return NextResponse.json(
          {
            error:
              "The submission or its payment changed. Refresh and review it again.",
          },
          { status: 409 },
        );
      title = "Your workshop listing is live";
      message = `“${workshop.title}” is now published and eligible for relevant placements across PlayInDirtJobs. Promotion ends ${expiresAt.toLocaleDateString("en-US", { timeZone: workshop.timeZone })}. Use your private link to update details or view referral activity.`;
    } else {
      // Claim this version before contacting Stripe. Approval and organizer edits
      // cannot race the refund. A failed/interrupted refund remains retryable.
      const claimed = await db.workshop.updateMany({
        where: {
          id: workshop.id,
          status: { in: ["PENDING_REVIEW", "REJECTING"] },
          updatedAt: workshop.updatedAt,
        },
        data: { status: "REJECTING", reviewNote: input.data.note },
      });
      if (!claimed.count)
        return NextResponse.json(
          { error: "The submission changed. Refresh before rejecting it." },
          { status: 409 },
        );
      const order = await db.workshopOrder.findUnique({
        where: { workshopId: workshop.id },
      });
      if (order?.status === "PAID") {
        if (!order.stripePaymentIntentId)
          return NextResponse.json(
            {
              error:
                "Payment reference unavailable; retry after payment confirmation.",
            },
            { status: 409 },
          );
        try {
          await stripe.refunds.create(
            { payment_intent: order.stripePaymentIntentId },
            { idempotencyKey: `workshop-rejection:${order.id}` },
          );
        } catch {
          return NextResponse.json(
            {
              error:
                "Stripe could not confirm the refund. The listing is held; retry rejection to safely resume the same refund.",
            },
            { status: 502 },
          );
        }
        await db.workshopOrder.updateMany({
          where: { id: order.id, status: "PAID" },
          data: { status: "REFUNDING" },
        });
      }
      await db.workshop.updateMany({
        where: { id: workshop.id, status: "REJECTING" },
        data: { status: "REJECTED", reviewNote: input.data.note },
      });
      title = "An update on your workshop submission";
      message = `We couldn’t publish “${workshop.title}”. ${input.data.note}${order ? " Your listing-fee refund has been requested. Your payment provider determines when it appears on your statement." : " No listing fee was charged."}`;
    }
  }
  if (recipient) {
    const outbox = await db.emailOutbox.create({
      data: {
        template: "WORKSHOP_MESSAGE",
        recipient,
        payload: workshopMessage(title, message, workshop.editToken),
      },
    });
    after(() =>
      processEmailOutboxItem(outbox.id).catch((error) => {
        console.error(
          "Workshop notification queued for retry",
          error instanceof Error ? error.message : "Delivery failed",
        );
      }),
    );
  }
  revalidateTag("public-workshops");
  return NextResponse.json({ updated: true });
}
