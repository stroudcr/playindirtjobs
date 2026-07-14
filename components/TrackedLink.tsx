"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import {
  trackAnalyticsEvent,
  type AnalyticsEventParams,
} from "@/lib/analytics";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName: string;
  eventParams?: AnalyticsEventParams;
}
export function TrackedLink({
  eventName,
  eventParams,
  onClick,
  ...props
}: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackAnalyticsEvent(eventName, eventParams);
    onClick?.(event);
  };

  return <a {...props} onClick={handleClick} />;
}
