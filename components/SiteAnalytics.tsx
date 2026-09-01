"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import {
  excludeSensitiveAnalyticsEvent,
  isSensitiveAnalyticsPath,
} from "@/lib/analytics-paths";

export function SiteAnalytics() {
  const pathname = usePathname();
  const sensitive = isSensitiveAnalyticsPath(pathname);

  useEffect(() => {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return;
    (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = sensitive;
  }, [sensitive]);

  if (sensitive) return null;

  return (
    <>
      <GoogleAnalytics />
      <Analytics beforeSend={excludeSensitiveAnalyticsEvent} />
      <SpeedInsights beforeSend={excludeSensitiveAnalyticsEvent} />
    </>
  );
}
