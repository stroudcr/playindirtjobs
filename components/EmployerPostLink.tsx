"use client";

import React, {
  type AnchorHTMLAttributes,
  type MouseEvent,
  useEffect,
} from "react";

import { TrackedLink } from "@/components/TrackedLink";
import type { AnalyticsEventParams } from "@/lib/analytics";
import {
  employerAttributionFromSearch,
  EMPLOYER_ATTRIBUTION_KEYS,
  type EmployerAttribution,
  resolveSessionEmployerAttribution,
} from "@/lib/employer-attribution";

type EmployerPostLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  source: string;
  plan?: "basic" | "featured";
  eventParams?: AnalyticsEventParams;
};

export function buildEmployerPostHref({
  source,
  plan = "basic",
  currentSearch = "",
  upstreamAttribution,
}: {
  source: string;
  plan?: "basic" | "featured";
  currentSearch?: string;
  upstreamAttribution?: EmployerAttribution;
}) {
  const currentAttribution = employerAttributionFromSearch(currentSearch);
  const hasCurrentAttribution = EMPLOYER_ATTRIBUTION_KEYS.some((key) =>
    Boolean(currentAttribution[key])
  );
  const upstream = hasCurrentAttribution
    ? currentAttribution
    : upstreamAttribution ?? {};
  const destination = new URLSearchParams({ plan, source });

  for (const key of EMPLOYER_ATTRIBUTION_KEYS) {
    const value = upstream[key];
    if (value) destination.set(key, value.slice(0, 300));
  }

  return `/post-job?${destination.toString()}`;
}

export function EmployerPostLink({
  source,
  plan = "basic",
  eventParams,
  onClick,
  onMouseDown,
  ...props
}: EmployerPostLinkProps) {
  const href = buildEmployerPostHref({ source, plan });

  useEffect(() => {
    resolveSessionEmployerAttribution(window.location.search);
  }, []);

  const buildCurrentHref = () => {
    const currentSearch = window.location.search;
    const upstreamAttribution =
      resolveSessionEmployerAttribution(currentSearch);

    return buildEmployerPostHref({
      source,
      plan,
      currentSearch,
      upstreamAttribution,
    });
  };

  const handleMouseDown = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.setAttribute("href", buildCurrentHref());
    onMouseDown?.(event);
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const attributedHref = buildCurrentHref();
    event.currentTarget.setAttribute("href", attributedHref);
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank" ||
      props.download
    ) {
      return;
    }

    if (attributedHref !== href) {
      event.preventDefault();
      window.location.assign(attributedHref);
    }
  };

  return (
    <TrackedLink
      {...props}
      href={href}
      eventName="employer_cta_click"
      eventParams={{ ...eventParams, source, plan }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    />
  );
}
