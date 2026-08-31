import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

import { normalizeDraftData } from "@/lib/job-draft-data";

describe("normalizeDraftData", () => {
  it("preserves existing pay when a sparse import omits salary fields", () => {
    const imported = normalizeDraftData({ title: "Imported title" });

    expect(imported).toEqual({ title: "Imported title" });
    expect(imported).not.toHaveProperty("salaryMin");
    expect(imported).not.toHaveProperty("salaryMax");
  });

  it("stringifies salary values that are actually present", () => {
    expect(normalizeDraftData({ salaryMin: 24, salaryMax: 30 })).toMatchObject({
      salaryMin: "24",
      salaryMax: "30",
    });
  });
});
