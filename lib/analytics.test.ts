import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { trackVercelEvent } = vi.hoisted(() => ({
  trackVercelEvent: vi.fn(),
}));

vi.mock("@vercel/analytics", () => ({ track: trackVercelEvent }));

import {
  trackBeginCheckout,
  trackBeginCheckoutOnceAndWait,
  trackPurchaseOnce,
} from "@/lib/analytics";

const payload = {
  transactionId: "purchase_test_123",
  value: 15,
  currency: "USD",
  plan: "basic",
  kind: "POSTING" as const,
};

describe("commerce analytics", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/post-job");
    window.localStorage.clear();
    window.gtag = vi.fn();
    trackVercelEvent.mockClear();
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("sends a standard begin_checkout event to GA4 and Vercel without PII", () => {
    trackBeginCheckout(payload);

    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "begin_checkout",
      expect.objectContaining({
        transaction_id: payload.transactionId,
        value: 15,
        currency: "USD",
        plan: "basic",
      })
    );
    expect(trackVercelEvent).toHaveBeenCalledWith(
      "begin_checkout",
      expect.objectContaining({ transaction_id: payload.transactionId, value: 15 })
    );
    expect(JSON.stringify(trackVercelEvent.mock.calls)).not.toContain("email");
  });

  it("waits for the checkout callback and deduplicates one Stripe session", async () => {
    vi.useFakeTimers();
    const checkoutPayload = { ...payload, transactionId: "purchase_checkout_callback" };
    const first = trackBeginCheckoutOnceAndWait(
      checkoutPayload,
      "cs_test_callback_secret",
      400
    );
    const gaParams = vi.mocked(window.gtag!).mock.calls[0]?.[2] as Record<string, unknown>;
    expect(gaParams.event_timeout).toBe(400);
    expect(typeof gaParams.event_callback).toBe("function");
    (gaParams.event_callback as () => void)();

    await expect(first).resolves.toBe(true);
    await expect(trackBeginCheckoutOnceAndWait(
      checkoutPayload,
      "cs_test_callback_secret",
      400
    )).resolves.toBe(false);
    expect(window.gtag).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(trackVercelEvent.mock.calls)).not.toContain("cs_test_callback_secret");
  });

  it("uses a short fallback when the checkout callback does not arrive", async () => {
    vi.useFakeTimers();
    const pending = trackBeginCheckoutOnceAndWait(
      { ...payload, transactionId: "purchase_checkout_fallback" },
      "cs_test_fallback_secret",
      300
    );

    await vi.advanceTimersByTimeAsync(300);
    await expect(pending).resolves.toBe(true);
  });

  it("deduplicates purchase in browser storage and temporarily permits only the conversion", () => {
    vi.useFakeTimers();
    window.history.replaceState({}, "", "/success?session_id=secret");
    const gaWindow = window as unknown as Record<string, unknown>;
    gaWindow["ga-disable-G-TEST123"] = true;

    expect(
      trackPurchaseOnce({ ...payload, transactionId: "purchase_test_456" })
    ).toEqual({ ga: "pending", vercelDelivered: true });
    expect(
      trackPurchaseOnce({ ...payload, transactionId: "purchase_test_456" })
    ).toEqual({ ga: "pending", vercelDelivered: true });
    expect(trackVercelEvent).toHaveBeenCalledTimes(1);
    expect(trackVercelEvent).toHaveBeenCalledWith(
      "purchase",
      expect.objectContaining({
        transaction_id: "purchase_test_456",
        page_location: `${window.location.origin}/success`,
      })
    );
    expect(JSON.stringify(trackVercelEvent.mock.calls)).not.toContain("session_id");

    expect(window.gtag).toBeDefined();
    const gaParams = vi.mocked(window.gtag!).mock.calls[0]?.[2] as Record<string, unknown>;
    expect(typeof gaParams.event_callback).toBe("function");
    (gaParams.event_callback as () => void)();
    expect(gaWindow["ga-disable-G-TEST123"]).toBe(true);
    expect(
      trackPurchaseOnce({ ...payload, transactionId: "purchase_test_456" })
    ).toEqual({ ga: "delivered", vercelDelivered: true });
    expect(window.gtag).toHaveBeenCalledTimes(1);
  });

  it("does not permanently mark GA delivered while the tag is unavailable", () => {
    vi.useFakeTimers();
    window.gtag = undefined;

    expect(
      trackPurchaseOnce({ ...payload, transactionId: "purchase_slow_ga" })
    ).toEqual({ ga: "pending", vercelDelivered: true });
    expect(trackVercelEvent).toHaveBeenCalledTimes(1);

    window.gtag = vi.fn();
    expect(
      trackPurchaseOnce({ ...payload, transactionId: "purchase_slow_ga" })
    ).toEqual({ ga: "pending", vercelDelivered: true });
    const gaParams = vi.mocked(window.gtag).mock.calls[0]?.[2] as Record<
      string,
      unknown
    >;
    (gaParams.event_callback as () => void)();

    expect(
      trackPurchaseOnce({ ...payload, transactionId: "purchase_slow_ga" })
    ).toEqual({ ga: "delivered", vercelDelivered: true });
    expect(trackVercelEvent).toHaveBeenCalledTimes(1);
  });
});
