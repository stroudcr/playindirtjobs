import { describe, expect, it } from "vitest";

import {
  employerEventDedupeDimensions,
  isLikelyAutomatedEmployerEvent,
  vercelCountryCode,
} from "@/lib/public-event-quality";

describe("public employer event quality", () => {
  it("rejects obvious automation and prefetch requests", () => {
    expect(isLikelyAutomatedEmployerEvent(new Headers())).toBe(true);
    expect(
      isLikelyAutomatedEmployerEvent(new Headers({ "user-agent": "Mozilla/5.0 HeadlessChrome" }))
    ).toBe(true);
    expect(
      isLikelyAutomatedEmployerEvent(
        new Headers({ "user-agent": "Mozilla/5.0", purpose: "prefetch" })
      )
    ).toBe(true);
    expect(
      isLikelyAutomatedEmployerEvent(new Headers({ "user-agent": "Mozilla/5.0 Chrome/140" }))
    ).toBe(false);
  });

  it("normalizes Vercel country codes without trusting malformed values", () => {
    expect(vercelCountryCode(new Headers({ "x-vercel-ip-country": "us" }))).toBe("US");
    expect(vercelCountryCode(new Headers({ "x-vercel-ip-country": "XX" }))).toBe("unknown");
    expect(vercelCountryCode(new Headers({ "x-vercel-ip-country": "USA" }))).toBe("unknown");
    expect(vercelCountryCode(new Headers())).toBe("unknown");
  });

  it("keeps CTA source and placement in the server dedupe identity", () => {
    expect(
      employerEventDedupeDimensions({
        source: "almanac_no_applicants_inline",
        placement: "article_inline",
        plan: "basic",
      })
    ).toEqual({
      source: "almanac_no_applicants_inline",
      placement: "article_inline",
    });
    expect(
      employerEventDedupeDimensions({
        source: "almanac_no_applicants_final",
        placement: "article_final",
      })
    ).not.toEqual({
      source: "almanac_no_applicants_inline",
      placement: "article_inline",
    });
  });
});
