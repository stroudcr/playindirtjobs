import { describe, expect, it } from "vitest";

import { postingSchema } from "@/lib/validations";

const validPosting = {
  title: "Seasonal greenhouse grower",
  company: "Green Valley Nursery",
  city: "Portland",
  state: "OR",
  postalCode: "97201",
  remote: false,
  description: "A".repeat(120),
  salaryMin: 18,
  salaryMax: 22,
  salaryType: "hourly" as const,
  jobType: ["seasonal"],
  farmType: ["organic"],
  categories: ["nursery-worker"],
  tags: [],
  benefits: [],
  managementEmail: "owner@example.com",
  companyWebsite: "https://example.com",
  companyLogo: "",
  applyUrl: "https://example.com/apply",
  applyEmail: "",
};

describe("postingSchema", () => {
  it("accepts a complete posting while keeping management and application contacts separate", () => {
    expect(postingSchema.safeParse(validPosting).success).toBe(true);
  });

  it("requires a public application method", () => {
    const parsed = postingSchema.safeParse({ ...validPosting, applyUrl: "", applyEmail: "" });
    expect(parsed.success).toBe(false);
  });

  it("rejects unsupported categories and inverted compensation", () => {
    const parsed = postingSchema.safeParse({
      ...validPosting,
      categories: ["office-job"],
      salaryMin: 30,
      salaryMax: 20,
    });
    expect(parsed.success).toBe(false);
  });
});
