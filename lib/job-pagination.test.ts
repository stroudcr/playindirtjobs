import { describe, expect, it } from "vitest";
import {
  getPublicJobsPageOffset,
  normalizePublicJobOffset,
  normalizePublicJobsPage,
  PUBLIC_JOBS_PAGE_SIZE,
} from "@/lib/job-pagination";

describe("public job pagination", () => {
  it("uses batches of 50 jobs", () => {
    expect(PUBLIC_JOBS_PAGE_SIZE).toBe(50);
  });

  it.each([null, "", "-1", "1.5", "not-a-number"])(
    "normalizes an invalid offset of %s to zero",
    (value) => {
      expect(normalizePublicJobOffset(value)).toBe(0);
    }
  );

  it("accepts a valid offset", () => {
    expect(normalizePublicJobOffset("50")).toBe(50);
  });

  it("caps unusually large offsets", () => {
    expect(normalizePublicJobOffset("50000")).toBe(10_000);
  });

  it.each([undefined, "", "0", "-1", "1.5", "not-a-number"])(
    "normalizes an invalid page of %s to page one",
    (value) => {
      expect(normalizePublicJobsPage(value)).toBe(1);
    }
  );

  it("converts a result page to a database offset", () => {
    expect(normalizePublicJobsPage("3")).toBe(3);
    expect(getPublicJobsPageOffset(3)).toBe(100);
  });
});
