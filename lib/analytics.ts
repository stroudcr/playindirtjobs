"use client";

export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "event" | "config" | "js",
      target: string | Date,
      params?: AnalyticsEventParams
    ) => void;
  }
}

export function trackAnalyticsEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", eventName, params);

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
      properties: params,
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
}
