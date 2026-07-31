import { describe, expect, it } from "vitest";
import {
  MAX_SEARCH_QUERY_LENGTH,
  buildPublicJobWhere,
  normalizeSearchQuery,
  parseJobSearch,
} from "@/lib/job-search";

const emptyFilters = {
  search: "",
  categories: [],
  jobTypes: [],
  farmTypes: [],
  benefits: [],
  sortBy: "latest",
};

describe("parseJobSearch", () => {
  it("recognizes a full state name as a structured location", () => {
    expect(parseJobSearch("florida")).toEqual({
      query: "florida",
      keywords: "",
      stateCode: "FL",
      stateName: "Florida",
    });
  });

  it("recognizes a state code entered on its own", () => {
    expect(parseJobSearch("fl")).toMatchObject({
      keywords: "",
      stateCode: "FL",
      stateName: "Florida",
    });
  });

  it("separates a state name from mixed keyword searches", () => {
    expect(parseJobSearch("farm hand in Florida")).toEqual({
      query: "farm hand in Florida",
      keywords: "farm hand",
      stateCode: "FL",
      stateName: "Florida",
    });
  });

  it("recognizes uppercase state codes in mixed searches", () => {
    expect(parseJobSearch("nursery worker FL")).toMatchObject({
      keywords: "nursery worker",
      stateCode: "FL",
    });
  });

  it("recognizes comma-delimited lowercase state codes", () => {
    expect(parseJobSearch("nursery worker, fl")).toMatchObject({
      keywords: "nursery worker",
      stateCode: "FL",
    });
  });

  it("does not interpret ordinary words as state codes", () => {
    expect(parseJobSearch("work in organic farming")).toEqual({
      query: "work in organic farming",
      keywords: "work in organic farming",
    });
  });
});

describe("normalizeSearchQuery", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeSearchQuery("  farm   hand \n Florida  ")).toBe("farm hand Florida");
  });

  it("caps unusually long search input", () => {
    expect(normalizeSearchQuery("x".repeat(200))).toHaveLength(MAX_SEARCH_QUERY_LENGTH);
  });
});

describe("buildPublicJobWhere", () => {
  it("uses structured state equality for Florida rather than substring search", () => {
    const where = buildPublicJobWhere({ ...emptyFilters, search: "Florida" }, new Date("2026-07-31"));

    expect(where.AND).toEqual([
      {
        OR: [
          { state: "FL" },
          { state: "Florida" },
        ],
      },
    ]);
  });

  it("combines structured location and keyword conditions", () => {
    const where = buildPublicJobWhere(
      { ...emptyFilters, search: "farm hand in Florida" },
      new Date("2026-07-31")
    );

    expect(where.AND).toHaveLength(2);
    expect(where.AND).toEqual(expect.arrayContaining([
      {
        OR: [
          { state: "FL" },
          { state: "Florida" },
        ],
      },
    ]));
  });

  it("keeps unknown explicit state filters fail-closed", () => {
    const where = buildPublicJobWhere(
      { ...emptyFilters, state: "not-a-state" },
      new Date("2026-07-31")
    );

    expect(where.AND).toEqual([{ state: "not-a-state" }]);
  });
});
