import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { isSameOrigin, managedWorkshop } from "@/lib/workshop-security";
import {
  workshopSchema,
  validateUpcomingWorkshop,
} from "@/lib/workshop-validation";
import { workshopData } from "@/lib/workshop-payments";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: NextRequest, { params }: Context) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  const workshop = await managedWorkshop(request, (await params).id);
  if (!workshop)
    return NextResponse.json(
      { error: "This management link is unavailable." },
      { status: 404 },
    );
  if (
    !["PUBLISHED", "PENDING_REVIEW", "SOLD_OUT", "CANCELED"].includes(
      workshop.status,
    ) ||
    (workshop.expiresAt && workshop.expiresAt <= new Date())
  )
    return NextResponse.json(
      {
        error:
          "This listing cannot be edited. List a new session to promote it again.",
      },
      { status: 409 },
    );
  const body = await request.json().catch(() => null);
  const parsed = workshopSchema.safeParse(body?.workshop);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  // Management-link access cannot silently transfer ownership to another mailbox.
  if (parsed.data.managementEmail !== workshop.managementEmail)
    return NextResponse.json(
      { error: "Contact us to change your management email." },
      { status: 400 },
    );
  try {
    validateUpcomingWorkshop(parsed.data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
  const changed = await db.workshop.updateMany({
    where: {
      id: workshop.id,
      updatedAt: workshop.updatedAt,
      status: workshop.status,
    },
    data: {
      ...workshopData(parsed.data),
      status: "PENDING_REVIEW",
      reviewNote: null,
    },
  });
  if (!changed.count)
    return NextResponse.json(
      { error: "The listing changed. Refresh before saving again." },
      { status: 409 },
    );
  revalidateTag("public-workshops");
  return NextResponse.json(
    { saved: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: NextRequest, { params }: Context) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  const workshop = await managedWorkshop(request, (await params).id);
  if (!workshop)
    return NextResponse.json(
      { error: "This management link is unavailable." },
      { status: 404 },
    );
  const body = await request.json().catch(() => null);
  if (body?.action === "cancel_checkout") {
    const order = await db.workshopOrder.findUnique({
      where: { workshopId: workshop.id },
    });
    if (!order || !["PENDING", "CANCELED", "FAILED"].includes(order.status))
      return NextResponse.json(
        {
          error:
            "This payment is already processing or completed. Check your email for the management link.",
        },
        { status: 409 },
      );
    if (order.stripeCheckoutSessionId) {
      const session = await stripe.checkout.sessions.retrieve(
        order.stripeCheckoutSessionId,
      );
      if (session.status === "complete")
        return NextResponse.json(
          {
            error:
              "Payment has completed. Your confirmation email will arrive shortly.",
          },
          { status: 409 },
        );
      if (session.status === "open")
        await stripe.checkout.sessions.expire(session.id);
    }
    const changed = await db.workshopOrder.updateMany({
      where: {
        id: order.id,
        status: { in: ["PENDING", "CANCELED", "FAILED"] },
      },
      data: { status: "CANCELED" },
    });
    // A Checkout creation that was in flight must not leave a payable orphan.
    const latest = await db.workshopOrder.findUnique({
      where: { id: order.id },
    });
    if (
      changed.count &&
      latest?.stripeCheckoutSessionId &&
      latest.stripeCheckoutSessionId !== order.stripeCheckoutSessionId
    ) {
      const session = await stripe.checkout.sessions.retrieve(
        latest.stripeCheckoutSessionId,
      );
      if (session.status === "open")
        await stripe.checkout.sessions.expire(session.id);
      if (session.status === "complete")
        return NextResponse.json(
          { error: "Payment completed. Check your confirmation email." },
          { status: 409 },
        );
    }
    return NextResponse.json({ canceled: changed.count > 0 });
  }
  const status =
    body?.action === "sold_out"
      ? "SOLD_OUT"
      : body?.action === "cancel"
        ? "CANCELED"
        : body?.action === "reopen"
          ? "PENDING_REVIEW"
          : null;
  if (
    !status ||
    !workshop.publishedAt ||
    ["REJECTED", "REJECTING"].includes(workshop.status) ||
    !workshop.expiresAt ||
    workshop.expiresAt <= new Date()
  )
    return NextResponse.json(
      { error: "This action is unavailable for the listing." },
      { status: 409 },
    );
  const changed = await db.workshop.updateMany({
    where: {
      id: workshop.id,
      updatedAt: workshop.updatedAt,
      status: workshop.status,
    },
    data: { status },
  });
  if (!changed.count)
    return NextResponse.json(
      { error: "The listing changed. Refresh and try again." },
      { status: 409 },
    );
  revalidateTag("public-workshops");
  return NextResponse.json({ status });
}
