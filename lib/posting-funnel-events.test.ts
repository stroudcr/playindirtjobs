import { describe, expect, it } from "vitest";

import {
  dedupedPostingFunnelEventId,
  postingAttributionDimensions,
  postingFunnelEventSchema,
  sanitizePostingLandingPath,
} from "@/lib/posting-funnel-events";

const draftId = "cm1234567890draft";

describe("postingFunnelEventSchema", () => {
  it("accepts aggregate import measurement", () => {
    expect(postingFunnelEventSchema.safeParse({
      draftId,
      eventName: "job_import_succeeded",
      properties: {
        extraction: "structured",
        populatedFieldCount: 8,
        warningCount: 1,
      },
    }).success).toBe(true);
  });

  it("rejects imported URLs and arbitrary form values in funnel properties", () => {
    expect(postingFunnelEventSchema.safeParse({
      draftId,
      eventName: "job_import_succeeded",
      properties: {
        extraction: "structured",
        populatedFieldCount: 8,
        warningCount: 1,
        sourceUrl: "https://example.com/private-job-url",
      },
    }).success).toBe(false);

    expect(postingFunnelEventSchema.safeParse({
      draftId,
      eventName: "posting_started",
      properties: {
        interaction: "form_input",
        stage: "role_basics",
        title: "A private draft title",
      },
    }).success).toBe(false);
  });

  it("keeps only explicit attribution parameters in landing paths", () => {
    expect(sanitizePostingLandingPath(
      "/post-job?utm_source=newsletter&source=pricing_basic&utm_campaign=spring&email=private%40example.com&draft=secret"
    )).toBe("/post-job?utm_source=newsletter&utm_campaign=spring&source=pricing_basic");
    expect(sanitizePostingLandingPath("https://example.com/post-job?utm_source=other"))
      .toBeUndefined();
  });

  it("keeps acquisition and internal CTA sources as separate dimensions", () => {
    expect(postingAttributionDimensions({
      utm_source: " newsletter ",
      source: "pricing_featured",
    })).toEqual({
      acquisitionSource: "newsletter",
      internalCtaSource: "pricing_featured",
    });
  });

  it("builds a stable event id for race-safe deduplication", () => {
    const first = dedupedPostingFunnelEventId(draftId, "posting_started");
    expect(first).toBe(dedupedPostingFunnelEventId(draftId, "posting_started"));
    expect(first).not.toBe(dedupedPostingFunnelEventId(draftId, "checkout_cancelled"));
  });

  it("accepts a PII-free checkout cancellation event", () => {
    expect(postingFunnelEventSchema.safeParse({
      draftId,
      eventName: "checkout_cancelled",
      properties: { stage: "preview" },
    }).success).toBe(true);
  });
});
