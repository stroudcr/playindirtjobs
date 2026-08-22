import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDate } from "@/lib/utils";

describe("formatDate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("falls back safely and reports malformed date data", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(formatDate("not-a-date")).toBe("Recently");
    expect(error).toHaveBeenCalledWith("[format-date] Invalid ISO date", {
      date: "not-a-date",
    });
  });
});
