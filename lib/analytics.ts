"use client";

import { track as trackVercelEvent } from "@vercel/analytics";

import { isSensitiveAnalyticsPath } from "@/lib/analytics-paths";
import type { CommerceAnalyticsPayload } from "@/lib/commerce-analytics";

type AnalyticsPrimitive = string | number | boolean | null;
type AnalyticsItem = Record<string, AnalyticsPrimitive | undefined>;

export type AnalyticsEventParams = Record<
  string,
  AnalyticsPrimitive | AnalyticsItem[] | undefined
>;

type TrackAnalyticsOptions = {
  allowSensitivePath?: boolean;
  gaEventCallback?: () => void;
  gaEventTimeoutMs?: number;
  skipGa?: boolean;
  skipVercel?: boolean;
};

type AnalyticsDispatchResult = {
  gaQueued: boolean;
  vercelQueued: boolean;
};

export type PurchaseDeliveryResult = {
  ga: "delivered" | "pending" | "not_configured";
  vercelDelivered: boolean;
};

const PURCHASE_STORAGE_PREFIX = "pidj:analytics:purchase:v2:";
const purchasesDeliveredInMemory = new Set<string>();
const gaPurchasesPending = new Set<string>();
const beginCheckoutSessionsTrackedInMemory = new Set<string>();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "event" | "config" | "js",
      target: string | Date,
      params?: Record<string, unknown>
    ) => void;
  }
}

export function trackAnalyticsEvent(
  eventName: string,
  params: AnalyticsEventParams = {},
  options: TrackAnalyticsOptions = {}
) {
  const result: AnalyticsDispatchResult = {
    gaQueued: false,
    vercelQueued: false,
  };
  if (typeof window === "undefined") return result;
  if (
    !options.allowSensitivePath &&
    isSensitiveAnalyticsPath(window.location.pathname)
  ) {
    return result;
  }

  if (!options.skipGa && typeof window.gtag === "function") {
    try {
      window.gtag(
        "event",
        eventName,
        options.gaEventCallback
          ? {
              ...params,
              event_callback: options.gaEventCallback,
              event_timeout: options.gaEventTimeoutMs ?? 2_500,
            }
          : params
      );
      result.gaQueued = true;
    } catch {
      // Analytics must never interrupt the user journey.
    }
  }

  const primitiveParams = Object.fromEntries(
    Object.entries(params).filter(
      (entry): entry is [string, AnalyticsPrimitive] =>
        entry[1] === null ||
        typeof entry[1] === "string" ||
        typeof entry[1] === "number" ||
        typeof entry[1] === "boolean"
    )
  );
  if (!options.skipVercel) {
    try {
      trackVercelEvent(eventName, primitiveParams);
      result.vercelQueued = true;
    } catch {
      // Vercel Analytics may be unavailable in local or blocked browsers.
    }
  }

  if (["employer_landing_view", "employer_cta_click"].includes(eventName)) {
    const url = new URL(window.location.href);
    const safeQuery = new URLSearchParams();
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "msclkid", "source"]) {
      const value = url.searchParams.get(key);
      if (value) safeQuery.set(key, value.slice(0, 300));
    }
    let referrerHost: string | undefined;
    try {
      referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : undefined;
    } catch {
      referrerHost = undefined;
    }
    const query = safeQuery.toString();
    const payload = JSON.stringify({
      eventName,
      path: `${window.location.pathname}${query ? `?${query}` : ""}`.slice(0, 1_000),
      referrerHost,
      properties: primitiveParams,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/funnel-events/public", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/funnel-events/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  }

  return result;
}

function commerceEventParams(payload: CommerceAnalyticsPayload): AnalyticsEventParams {
  return {
    transaction_id: payload.transactionId,
    value: payload.value,
    currency: payload.currency,
    plan: payload.plan,
    purchase_kind: payload.kind.toLowerCase(),
    items: [
      {
        item_id: `job_posting_${payload.plan}`,
        item_name: `${payload.plan} job posting`,
        item_category: "job_posting",
        price: payload.value,
        quantity: 1,
      },
    ],
  };
}

export function trackBeginCheckout(
  payload: CommerceAnalyticsPayload,
  onComplete?: () => void,
  timeoutMs = 500
) {
  return trackAnalyticsEvent(
    "begin_checkout",
    commerceEventParams(payload),
    {
      gaEventCallback: onComplete,
      gaEventTimeoutMs: timeoutMs,
    }
  );
}

export async function trackBeginCheckoutOnceAndWait(
  payload: CommerceAnalyticsPayload,
  checkoutSessionId: string,
  waitMs = 500
) {
  if (typeof window === "undefined") return false;
  const sessionKey = `${payload.transactionId}:${checkoutSessionId}`;
  if (beginCheckoutSessionsTrackedInMemory.has(sessionKey)) return false;
  beginCheckoutSessionsTrackedInMemory.add(sessionKey);

  await new Promise<void>((resolve) => {
    let finished = false;
    let timer: number | undefined;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (timer) window.clearTimeout(timer);
      resolve();
    };
    const boundedWait = Math.max(0, Math.min(waitMs, 1_000));
    timer = window.setTimeout(finish, boundedWait);
    trackBeginCheckout(payload, finish, boundedWait);
  });
  return true;
}

function purchaseDeliveryKey(
  destination: "ga" | "vercel",
  transactionId: string
) {
  return `${PURCHASE_STORAGE_PREFIX}${destination}:${transactionId}`;
}

function wasPurchaseDelivered(storageKey: string) {
  if (purchasesDeliveredInMemory.has(storageKey)) return true;
  try {
    if (window.localStorage.getItem(storageKey)) {
      purchasesDeliveredInMemory.add(storageKey);
      return true;
    }
  } catch {
    // In-memory deduplication still covers this page when storage is blocked.
  }
  return false;
}

function markPurchaseDelivered(storageKey: string) {
  purchasesDeliveredInMemory.add(storageKey);
  try {
    window.localStorage.setItem(storageKey, "1");
  } catch {
    // Storage can be unavailable in private browsing modes.
  }
}

export function trackPurchaseOnce(
  payload: CommerceAnalyticsPayload
): PurchaseDeliveryResult {
  if (typeof window === "undefined") {
    return { ga: "pending", vercelDelivered: false };
  }

  const eventParams = {
    ...commerceEventParams(payload),
    page_location: `${window.location.origin}/success`,
  };
  const vercelKey = purchaseDeliveryKey("vercel", payload.transactionId);
  if (!wasPurchaseDelivered(vercelKey)) {
    const delivery = trackAnalyticsEvent("purchase", eventParams, {
      allowSensitivePath: true,
      skipGa: true,
    });
    if (delivery.vercelQueued) markPurchaseDelivered(vercelKey);
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) {
    return {
      ga: "not_configured",
      vercelDelivered: wasPurchaseDelivered(vercelKey),
    };
  }

  const gaKey = purchaseDeliveryKey("ga", payload.transactionId);
  if (wasPurchaseDelivered(gaKey)) {
    return {
      ga: "delivered",
      vercelDelivered: wasPurchaseDelivered(vercelKey),
    };
  }
  if (gaPurchasesPending.has(gaKey) || typeof window.gtag !== "function") {
    return {
      ga: "pending",
      vercelDelivered: wasPurchaseDelivered(vercelKey),
    };
  }

  const gaWindow = window as unknown as Record<string, unknown>;
  const disableKey = `ga-disable-${measurementId}`;
  let restored = false;
  const restoreSensitivePathBlock = () => {
    if (restored) return;
    restored = true;
    gaWindow[disableKey] = true;
  };
  const temporarilyEnabled = gaWindow[disableKey] === true;
  if (temporarilyEnabled) gaWindow[disableKey] = false;

  gaPurchasesPending.add(gaKey);
  const delivery = trackAnalyticsEvent("purchase", eventParams, {
    allowSensitivePath: true,
    skipVercel: true,
    gaEventTimeoutMs: 10_000,
    gaEventCallback: () => {
      markPurchaseDelivered(gaKey);
      gaPurchasesPending.delete(gaKey);
      if (temporarilyEnabled) restoreSensitivePathBlock();
    },
  });

  if (!delivery.gaQueued) {
    gaPurchasesPending.delete(gaKey);
    if (temporarilyEnabled) restoreSensitivePathBlock();
  } else {
    window.setTimeout(() => {
      gaPurchasesPending.delete(gaKey);
      if (temporarilyEnabled) restoreSensitivePathBlock();
    }, 10_000);
  }

  return {
    ga: wasPurchaseDelivered(gaKey) ? "delivered" : "pending",
    vercelDelivered: wasPurchaseDelivered(vercelKey),
  };
}
