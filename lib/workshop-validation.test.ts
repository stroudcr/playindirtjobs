import { describe, expect, it } from "vitest";
import { workshopSeeds } from "@/prisma/workshop-seed-data";
import {
  localWorkshopDate,
  publicWebUrl,
  validateUpcomingWorkshop,
  workshopSchema,
  workshopWallTime,
} from "@/lib/workshop-validation";
import {
  workshopExpiration,
  workshopIsOpen,
  topicsForJob,
} from "@/lib/workshop-types";
import { safeJsonLd, workshopStructuredData } from "@/lib/workshop-seo";
import type { PublicWorkshop } from "@/lib/workshop-types";

describe("Workshop listing integrity", () => {
  it("seeds exactly ten distinct, valid courses with authoritative source URLs", () => {
    expect(workshopSeeds).toHaveLength(10);
    expect(
      new Set(workshopSeeds.map((workshop) => workshop.sourceUrl)).size,
    ).toBe(10);
    expect(
      new Set(workshopSeeds.map((workshop) => workshop.organization)).size,
    ).toBe(5);
    for (const seed of workshopSeeds) {
      expect(
        workshopSchema.safeParse({
          ...seed,
          managementEmail: "owner@example.org",
        }).success,
        seed.slug,
      ).toBe(true);
      expect(() =>
        validateUpcomingWorkshop(
          { ...seed, managementEmail: "owner@example.org" },
          new Date("2026-09-05"),
        ),
      ).not.toThrow();
    }
  });
  it("converts organizer time independently of the visitor time zone", () => {
    expect(localWorkshopDate("2026-10-03T10:00", "America/Los_Angeles")).toBe(
      "2026-10-03T17:00:00.000Z",
    );
    expect(localWorkshopDate("2027-01-13T19:00", "America/New_York")).toBe(
      "2027-01-14T00:00:00.000Z",
    );
    expect(
      workshopWallTime("2026-10-03T17:00:00Z", "America/Los_Angeles"),
    ).toBe("2026-10-03T10:00");
    expect(() =>
      localWorkshopDate("2027-03-14T02:30", "America/New_York"),
    ).toThrow("daylight-saving");
  });
  it("ends promotion at the earliest of 60 days, course start and enrollment closing", () => {
    const publication = new Date("2026-09-05T12:00:00Z");
    expect(workshopExpiration(publication).toISOString()).toBe(
      "2026-11-04T12:00:00.000Z",
    );
    expect(
      workshopExpiration(
        publication,
        new Date("2026-10-03"),
        new Date("2026-09-28"),
      ).toISOString(),
    ).toBe("2026-09-28T00:00:00.000Z");
  });
  it("never advertises sold-out, canceled, unreviewed or expired courses as open", () => {
    const base = {
      status: "PUBLISHED",
      expiresAt: "2026-11-04T12:00:00Z",
      startAt: null,
      registrationClosesAt: null,
    };
    const now = new Date("2026-09-05");
    expect(workshopIsOpen(base, now)).toBe(true);
    for (const status of [
      "SOLD_OUT",
      "CANCELED",
      "PENDING_REVIEW",
      "DRAFT",
      "REJECTED",
    ])
      expect(workshopIsOpen({ ...base, status }, now)).toBe(false);
    expect(workshopIsOpen({ ...base, startAt: "2026-09-04" }, now)).toBe(false);
    expect(
      workshopIsOpen({ ...base, registrationClosesAt: "2026-09-04" }, now),
    ).toBe(false);
    expect(workshopIsOpen(base, new Date("2026-11-05"))).toBe(false);
  });
  it("rejects unsafe registration destinations and impossible schedules", () => {
    for (const url of [
      "javascript:alert(1)",
      "https://user:pass@example.com",
      "http://127.0.0.1/test",
      "http://192.168.1.2",
      "http://example.local",
      "https://example.com:444",
    ])
      expect(publicWebUrl.safeParse(url).success).toBe(false);
    const seed = { ...workshopSeeds[7], managementEmail: "owner@example.org" };
    expect(
      workshopSchema.safeParse({ ...seed, endAt: "2026-10-05T12:00:00Z" })
        .success,
    ).toBe(false);
    expect(
      workshopSchema.safeParse({
        ...seed,
        registrationClosesAt: "2026-10-07T12:00:00Z",
      }).success,
    ).toBe(false);
    expect(workshopSchema.safeParse({ ...seed, address: "" }).success).toBe(
      false,
    );
  });
  it("uses course/event schema and tuition, never a JobPosting or listing fee", () => {
    const publicCourse = {
      ...workshopSeeds[6],
      id: "course",
      status: "PUBLISHED",
      origin: "GIFTED",
      expiresAt: "2099-01-01T00:00:00Z",
      verifiedAt: null,
      updatedAt: "2026-09-05T00:00:00Z",
    } as PublicWorkshop;
    const course = workshopStructuredData(publicCourse);
    expect(course["@type"]).toBe("Course");
    expect(course.offers.price).toBe(149);
    const event = workshopStructuredData({
      ...publicCourse,
      ...workshopSeeds[7],
    } as PublicWorkshop);
    expect(event["@type"]).toBe("EducationEvent");
    expect(event.offers.price).toBe(0);
    expect(JSON.stringify(event)).not.toContain("JobPosting");
    expect(
      safeJsonLd({ name: "</script><script>alert(1)</script>" }),
    ).not.toContain("<");
  });
  it("matches livestock skills to ranch roles", () => {
    expect(topicsForJob(["ranch-hand"])).toContain("livestock");
    expect(topicsForJob(["nursery"])).toContain("greenhouse");
  });
});
