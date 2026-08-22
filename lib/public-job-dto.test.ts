import { describe, expect, it } from "vitest";
import {
  isISODateString,
  isPublicJobCardDto,
  toPublicJobDto,
} from "@/lib/public-job-dto";

describe("public job DTOs", () => {
  it("converts every nested Date to a stable ISO string", () => {
    const job = {
      id: "job-1",
      createdAt: new Date("2026-08-20T12:00:00.000Z"),
      expiresAt: new Date("2026-10-19T12:00:00.000Z"),
      audit: {
        publishedAt: new Date("2026-08-21T12:00:00.000Z"),
        closedAt: null,
      },
    };

    const dto = toPublicJobDto(job);
    const cached = JSON.parse(JSON.stringify(dto));

    expect(dto.createdAt).toBe("2026-08-20T12:00:00.000Z");
    expect(dto.expiresAt).toBe("2026-10-19T12:00:00.000Z");
    expect(dto.audit.publishedAt).toBe("2026-08-21T12:00:00.000Z");
    expect(cached).toEqual(dto);
  });

  it("rejects invalid dates at the database boundary", () => {
    expect(() => toPublicJobDto({ createdAt: new Date("invalid") })).toThrow(
      "Public job data contains an invalid date"
    );
  });

  it("validates the public job card contract", () => {
    const job = {
      id: "job-1",
      slug: "farm-hand-test-farm",
      title: "Farm Hand",
      company: "Test Farm",
      location: "Guelph, ON",
      salaryMin: null,
      salaryMax: 25,
      salaryType: "hourly",
      categories: ["farm-hand"],
      jobType: ["full-time"],
      featured: false,
      createdAt: "2026-08-20T12:00:00.000Z",
    };

    expect(isISODateString(job.createdAt)).toBe(true);
    expect(isPublicJobCardDto(job)).toBe(true);
    expect(isPublicJobCardDto({ ...job, createdAt: "not-a-date" })).toBe(false);
  });
});
