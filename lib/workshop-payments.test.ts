import { beforeEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import { workshopSeeds } from "@/prisma/workshop-seed-data";
const mocks = vi.hoisted(() => ({
  find: vi.fn(),
  updateMany: vi.fn(),
  update: vi.fn(),
  workshopUpdate: vi.fn(),
  outbox: vi.fn(),
  event: vi.fn(),
}));
vi.mock("@/lib/db", () => {
  const tx = {
    workshopOrder: {
      findUnique: mocks.find,
      updateMany: mocks.updateMany,
      update: mocks.update,
    },
    workshop: { update: mocks.workshopUpdate },
    emailOutbox: { upsert: mocks.outbox },
    stripeEvent: { update: mocks.event },
  };
  return {
    db: {
      ...tx,
      $transaction: (input: ((tx: unknown) => unknown) | Promise<unknown>[]) =>
        typeof input === "function" ? input(tx) : Promise.all(input),
    },
  };
});
import {
  processWorkshopStripeEvent,
  validateWorkshopPayment,
} from "@/lib/workshop-payments";
const order = {
  id: "order_1",
  workshopId: "workshop_1",
  stripeCheckoutSessionId: "cs_test_workshop",
  status: "PENDING",
  snapshot: { ...workshopSeeds[0], managementEmail: "owner@example.org" },
  workshop: { editToken: "private" },
};
const metadata = {
  product: "workshop",
  workshopOrderId: order.id,
  workshopId: order.workshopId,
};
function session(overrides = {}) {
  return {
    id: "cs_test_workshop",
    status: "complete",
    mode: "payment",
    payment_status: "paid",
    currency: "usd",
    amount_total: 1500,
    amount_subtotal: 1500,
    client_reference_id: order.id,
    metadata,
    payment_intent: "pi_workshop",
    ...overrides,
  } as unknown as Stripe.Checkout.Session;
}
function event(type: string, object: unknown) {
  return { id: "evt_workshop", type, data: { object } } as Stripe.Event;
}
describe("Workshop payment settlement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.find.mockResolvedValue({ ...order });
    mocks.updateMany.mockResolvedValue({ count: 1 });
    mocks.update.mockResolvedValue({});
    mocks.workshopUpdate.mockResolvedValue({});
    mocks.outbox.mockResolvedValue({ id: "email" });
    mocks.event.mockResolvedValue({});
  });
  it("requires the exact one-time $15 payment and immutable workshop identity", () => {
    expect(() => validateWorkshopPayment(session(), order)).not.toThrow();
    for (const changes of [
      { amount_total: 0 },
      { amount_subtotal: 2500 },
      { currency: "cad" },
      { mode: "subscription" },
      { payment_status: "unpaid" },
      { id: "cs_other" },
      { metadata: { ...metadata, workshopId: "other" } },
    ])
      expect(() => validateWorkshopPayment(session(changes), order)).toThrow();
  });
  it("queues a paid submission for review and creates a receipt without publishing it", async () => {
    expect(
      await processWorkshopStripeEvent(
        event("checkout.session.completed", session()),
      ),
    ).toBe(true);
    expect(mocks.workshopUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "PENDING_REVIEW",
          title: workshopSeeds[0].title,
        }),
      }),
    );
    expect(mocks.outbox).toHaveBeenCalledOnce();
    expect(mocks.event).toHaveBeenCalledOnce();
  });
  it("does not fulfill an unsettled delayed payment", async () => {
    await processWorkshopStripeEvent(
      event(
        "checkout.session.completed",
        session({ payment_status: "unpaid" }),
      ),
    );
    expect(mocks.workshopUpdate).not.toHaveBeenCalled();
    expect(mocks.outbox).not.toHaveBeenCalled();
  });
  it("does not republish or resend receipts for duplicate or previously refunded orders", async () => {
    mocks.updateMany.mockResolvedValue({ count: 0 });
    await processWorkshopStripeEvent(
      event("checkout.session.completed", session()),
    );
    expect(mocks.workshopUpdate).not.toHaveBeenCalled();
    expect(mocks.outbox).not.toHaveBeenCalled();
    expect(mocks.updateMany.mock.calls[0][0].where.status.in).not.toContain(
      "REFUNDED",
    );
    expect(mocks.updateMany.mock.calls[0][0].where.status.in).not.toContain(
      "PAID",
    );
  });
  it("withdraws a fully refunded listing but leaves partial refunds alone", async () => {
    await processWorkshopStripeEvent(
      event("charge.refunded", {
        metadata,
        refunded: false,
        amount: 1500,
        amount_refunded: 500,
      }),
    );
    expect(mocks.workshopUpdate).not.toHaveBeenCalled();
    await processWorkshopStripeEvent(
      event("charge.refunded", {
        metadata,
        refunded: true,
        amount: 1500,
        amount_refunded: 1500,
      }),
    );
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: order.id },
      data: { status: "REFUNDED" },
    });
    expect(mocks.workshopUpdate).toHaveBeenCalledWith({
      where: { id: order.workshopId },
      data: { status: "REJECTED" },
    });
  });
  it("does not handle existing job payments", async () => {
    expect(
      await processWorkshopStripeEvent(
        event(
          "checkout.session.completed",
          session({ metadata: { purchaseId: "job_purchase" } }),
        ),
      ),
    ).toBe(false);
    expect(mocks.find).not.toHaveBeenCalled();
  });
  it("fails the matching pending checkout only, protecting completed payments", async () => {
    await processWorkshopStripeEvent(
      event("checkout.session.expired", session()),
    );
    expect(mocks.updateMany).toHaveBeenCalledWith({
      where: {
        id: order.id,
        status: "PENDING",
        stripeCheckoutSessionId: "cs_test_workshop",
      },
      data: { status: "CANCELED" },
    });
  });
});
