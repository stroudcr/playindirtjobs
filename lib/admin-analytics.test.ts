import { describe, expect, it } from "vitest";

import { summarizeEmployerActivity } from "@/lib/admin-analytics";

describe("summarizeEmployerActivity", () => {
  it("counts distinct anonymous visitors by event and country bucket", () => {
    const summary = summarizeEmployerActivity([
      { eventName: "employer_landing_view", anonymousId: "visitor-1", properties: { country: "US" } },
      { eventName: "employer_landing_view", anonymousId: "visitor-1", properties: { country: "US" } },
      { eventName: "employer_landing_view", anonymousId: "visitor-2", properties: { country: "CA" } },
      { eventName: "employer_landing_view", anonymousId: "visitor-3", properties: {} },
      { eventName: "employer_cta_click", anonymousId: "visitor-1", properties: { country: "US" } },
      { eventName: "employer_cta_click", anonymousId: null, properties: { country: "US" } },
    ]);

    expect(summary).toEqual([
      { eventName: "employer_landing_view", us: 1, nonUs: 1, unknown: 1, total: 3 },
      { eventName: "employer_cta_click", us: 1, nonUs: 0, unknown: 0, total: 1 },
    ]);
  });

  it("uses the strongest known bucket once when a visitor has mixed records", () => {
    const summary = summarizeEmployerActivity([
      { eventName: "employer_cta_click", anonymousId: "visitor-1", properties: null },
      { eventName: "employer_cta_click", anonymousId: "visitor-1", properties: { country: "CA" } },
      { eventName: "employer_cta_click", anonymousId: "visitor-1", properties: { country: "us" } },
    ]);

    expect(summary[1]).toEqual({
      eventName: "employer_cta_click",
      us: 1,
      nonUs: 0,
      unknown: 0,
      total: 1,
    });
  });
});
