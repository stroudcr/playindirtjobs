import { describe, expect, it } from "vitest";
import type Stripe from "stripe";

import {
  checkoutSessionMatchesIntent,
  isCheckoutSessionSettled,
  settledCheckoutFacts,
} from "@/lib/stripe-checkout";

function session(overrides: Partial<Stripe.Checkout.Session> = {}) {
  return {
    id: "cs_test_example",
    object: "checkout.session",
    mode: "payment",
    status: "complete",
    payment_status: "paid",
    currency: "usd",
    amount_subtotal: 1_500,
    client_reference_id: "purchase_1",
    metadata: {
      purchaseId: "purchase_1",
      draftId: "draft_1",
      employerId: "employer_1",
      plan: "basic",
      kind: "POSTING",
    },
    ...overrides,
  } as Stripe.Checkout.Session;
}

const intent = {
  purchaseId: "purchase_1",
  draftId: "draft_1",
  employerId: "employer_1",
  plan: "basic" as const,
  kind: "POSTING" as const,
  amount: 1_500,
};

const purchase = {
  id: "purchase_1",
  draftId: "draft_1",
  employerId: "employer_1",
  sourceJobId: null,
};

describe("Stripe Checkout integrity", () => {
  it("recognizes paid and fully discounted sessions as settled", () => {
    expect(isCheckoutSessionSettled(session())).toBe(true);
    expect(isCheckoutSessionSettled(session({ payment_status: "no_payment_required" }))).toBe(true);
    expect(isCheckoutSessionSettled(session({ payment_status: "unpaid" }))).toBe(false);
  });

  it("only reuses a session for the exact server-priced intent", () => {
    expect(checkoutSessionMatchesIntent(session(), intent)).toBe(true);
    expect(checkoutSessionMatchesIntent(session(), { ...intent, plan: "featured", amount: 2_500 })).toBe(false);
    expect(checkoutSessionMatchesIntent(session({ amount_subtotal: 2_500 }), intent)).toBe(false);
    expect(checkoutSessionMatchesIntent(session({ metadata: { ...session().metadata, employerId: "other" } }), intent)).toBe(false);
  });

  it("derives the purchased entitlement from validated Stripe metadata", () => {
    expect(settledCheckoutFacts(session(), purchase)).toEqual({
      plan: "basic",
      kind: "POSTING",
      amount: 1_500,
    });
  });

  it("rejects plan underpayment and cross-purchase metadata", () => {
    expect(() =>
      settledCheckoutFacts(
        session({ metadata: { ...session().metadata, plan: "featured" } }),
        purchase
      )
    ).toThrow("subtotal");
    expect(() =>
      settledCheckoutFacts(session({ client_reference_id: "purchase_2" }), purchase)
    ).toThrow("identifiers");
  });

  it("requires renewal metadata only for a renewal source draft", () => {
    const renewalSession = session({
      metadata: { ...session().metadata, kind: "RENEWAL" },
    });
    expect(settledCheckoutFacts(renewalSession, { ...purchase, sourceJobId: "job_1" }).kind).toBe("RENEWAL");
    expect(() => settledCheckoutFacts(renewalSession, purchase)).toThrow("purchase type");
  });
});
