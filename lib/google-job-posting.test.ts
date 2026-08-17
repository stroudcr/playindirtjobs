import { describe, expect, it } from "vitest";
import { isGoogleJobPostingEligible } from "@/lib/google-job-posting";

describe("Google job posting eligibility", () => {
  it("includes jobs published directly by employers", () => {
    expect(isGoogleJobPostingEligible({ origin: "EMPLOYER", employerId: null })).toBe(true);
  });

  it("includes imported listings after an employer claims them", () => {
    expect(isGoogleJobPostingEligible({ origin: "IMPORTED", employerId: "employer-1" })).toBe(true);
  });

  it("excludes unclaimed imported listings from Google job enhancements", () => {
    expect(isGoogleJobPostingEligible({ origin: "IMPORTED", employerId: null })).toBe(false);
  });
});
