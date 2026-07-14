import type Stripe from "stripe";

import { PRICING } from "@/lib/constants";

export type CheckoutPlan = "basic" | "featured";
export type CheckoutKind = "POSTING" | "RENEWAL";

export type CheckoutIntent = {
  purchaseId: string;
  draftId: string;
  employerId: string;
  plan: CheckoutPlan;
  kind: CheckoutKind;
  amount: number;
};

export type CheckoutPurchaseIdentity = {
  id: string;
  draftId: string | null;
  employerId: string | null;
  sourceJobId: string | null;
};

export type SettledCheckoutFacts = {
  plan: CheckoutPlan;
  kind: CheckoutKind;
  amount: number;
};

function amountForPlan(plan: CheckoutPlan) {
  return plan === "featured" ? PRICING.FEATURED : PRICING.BASIC;
}

export function isCheckoutSessionSettled(session: Stripe.Checkout.Session) {
  return session.payment_status === "paid" || session.payment_status === "no_payment_required";
}

/**
 * Checkout metadata and the pre-discount subtotal are a server-created snapshot of
 * what the customer agreed to buy. This prevents a later draft edit from changing
 * the entitlement attached to an already-open Checkout Session.
 */
export function checkoutSessionMatchesIntent(
  session: Stripe.Checkout.Session,
  intent: CheckoutIntent
) {
  return (
    session.mode === "payment" &&
    session.currency?.toLowerCase() === "usd" &&
    session.amount_subtotal === intent.amount &&
    session.client_reference_id === intent.purchaseId &&
    session.metadata?.purchaseId === intent.purchaseId &&
    session.metadata?.draftId === intent.draftId &&
    session.metadata?.employerId === intent.employerId &&
    session.metadata?.plan === intent.plan &&
    session.metadata?.kind === intent.kind
  );
}

/**
 * Treat the signed Stripe session as the source of truth for the purchased plan,
 * while requiring its immutable identifiers to match the local purchase/draft.
 */
export function settledCheckoutFacts(
  session: Stripe.Checkout.Session,
  purchase: CheckoutPurchaseIdentity
): SettledCheckoutFacts {
  if (!isCheckoutSessionSettled(session)) {
    throw new Error("Checkout Session payment is not settled.");
  }
  if (session.status !== "complete" || session.mode !== "payment") {
    throw new Error("Checkout Session is not a completed one-time payment.");
  }
  if (session.currency?.toLowerCase() !== "usd") {
    throw new Error("Checkout Session currency does not match this purchase.");
  }
  if (
    !purchase.draftId ||
    !purchase.employerId ||
    session.client_reference_id !== purchase.id ||
    session.metadata?.purchaseId !== purchase.id ||
    session.metadata?.draftId !== purchase.draftId ||
    session.metadata?.employerId !== purchase.employerId
  ) {
    throw new Error("Checkout Session identifiers do not match this purchase.");
  }

  const plan = session.metadata?.plan;
  if (plan !== "basic" && plan !== "featured") {
    throw new Error("Checkout Session is missing a valid posting plan.");
  }
  const expectedKind: CheckoutKind = purchase.sourceJobId ? "RENEWAL" : "POSTING";
  if (session.metadata?.kind !== expectedKind) {
    throw new Error("Checkout Session purchase type does not match this draft.");
  }

  const amount = amountForPlan(plan);
  if (session.amount_subtotal !== amount) {
    throw new Error("Checkout Session subtotal does not match the selected plan.");
  }

  return { plan, kind: expectedKind, amount };
}
