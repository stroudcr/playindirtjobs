"use client";

import { useEffect, useRef } from "react";
import {
  trackAnalyticsEvent,
  type AnalyticsEventParams,
} from "@/lib/analytics";

export function TrackPageView({
  eventName,
  eventParams,
}: {
  eventName: string;
  eventParams?: AnalyticsEventParams;
}) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;

    let attempts = 0;
    let timeoutId: number | undefined;

    const sendWhenReady = () => {
      if (hasTracked.current) return;

      if (window.gtag || attempts >= 19) {
        hasTracked.current = true;
        trackAnalyticsEvent(eventName, eventParams);
        return;
      }

      attempts += 1;
      if (attempts < 20) {
        timeoutId = window.setTimeout(sendWhenReady, 100);
      }
    };

    sendWhenReady();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [eventName, eventParams]);

  return null;
}
