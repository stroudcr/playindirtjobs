import { describe, expect, it } from "vitest";

import {
  excludeSensitiveAnalyticsEvent,
  isSensitiveAnalyticsPath,
  sanitizeSuccessAnalyticsEvent,
} from "@/lib/analytics-paths";

describe("isSensitiveAnalyticsPath", () => {
  it("excludes private routes without excluding public employer marketing pages", () => {
    expect(isSensitiveAnalyticsPath("/employer")).toBe(true);
    expect(isSensitiveAnalyticsPath("/employer/jobs")).toBe(true);
    expect(isSensitiveAnalyticsPath("/admin")).toBe(true);
    expect(isSensitiveAnalyticsPath("/success")).toBe(true);
    expect(isSensitiveAnalyticsPath("/employers")).toBe(false);
    expect(isSensitiveAnalyticsPath("/employers/farms")).toBe(false);
  });

  it("drops persisted Vercel events after a client navigation to a private route", () => {
    const privateEvent = { type: "pageview", url: "https://playindirtjobs.com/employer/jobs" };
    const publicEvent = { type: "pageview", url: "https://playindirtjobs.com/employers/farms" };

    expect(excludeSensitiveAnalyticsEvent(privateEvent)).toBeNull();
    expect(excludeSensitiveAnalyticsEvent(publicEvent)).toBe(publicEvent);
  });

  it("removes checkout tokens from manually sent success events", () => {
    expect(
      sanitizeSuccessAnalyticsEvent({
        type: "event",
        url: "https://playindirtjobs.com/success?session_id=cs_live_secret#receipt",
      })
    ).toEqual({
      type: "event",
      url: "https://playindirtjobs.com/success",
    });
    expect(
      sanitizeSuccessAnalyticsEvent({
        type: "event",
        url: "https://playindirtjobs.com/employers",
      })
    ).toEqual({
      type: "event",
      url: "https://playindirtjobs.com/employers",
    });
    expect(
      sanitizeSuccessAnalyticsEvent({
        type: "event",
        url: "https://playindirtjobs.com/employer?token=secret",
      })
    ).toBeNull();
  });
});
