export type CommerceAnalyticsPayload = {
  transactionId: string;
  value: number;
  currency: string;
  plan: string;
  kind: "POSTING" | "RENEWAL";
};

export function createCommerceAnalyticsPayload(input: {
  transactionId: string;
  amountInCents: number;
  currency: string;
  plan: string;
  kind: "POSTING" | "RENEWAL";
}): CommerceAnalyticsPayload {
  return {
    transactionId: input.transactionId,
    value: input.amountInCents / 100,
    currency: input.currency.trim().toUpperCase(),
    plan: input.plan.trim().toLowerCase(),
    kind: input.kind,
  };
}

export function isCommerceAnalyticsPayload(
  value: unknown
): value is CommerceAnalyticsPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const payload = value as Record<string, unknown>;

  return (
    typeof payload.transactionId === "string" &&
    /^[A-Za-z0-9_-]{8,100}$/.test(payload.transactionId) &&
    typeof payload.value === "number" &&
    Number.isFinite(payload.value) &&
    payload.value >= 0 &&
    typeof payload.currency === "string" &&
    /^[A-Z]{3}$/.test(payload.currency) &&
    typeof payload.plan === "string" &&
    /^[a-z0-9_-]{1,50}$/.test(payload.plan) &&
    (payload.kind === "POSTING" || payload.kind === "RENEWAL")
  );
}
