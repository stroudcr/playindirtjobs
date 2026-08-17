import { describe, expect, it } from "vitest";
import {
  restoreJobDatesFromCache,
  serializeJobDatesForCache,
} from "./job-cache";

describe("job cache date serialization", () => {
  it("restores Date instances after a JSON cache round trip", () => {
    const createdAt = new Date("2026-07-30T18:18:27.195Z");
    const expiresAt = new Date("2026-09-28T18:18:27.132Z");
    const serialized = serializeJobDatesForCache({
      id: "job-1",
      createdAt,
      expiresAt,
    });

    const cached = JSON.parse(JSON.stringify(serialized)) as typeof serialized;
    const restored = restoreJobDatesFromCache(cached);

    expect(serialized.createdAt).toBe(createdAt.toISOString());
    expect(serialized.expiresAt).toBe(expiresAt.toISOString());
    expect(restored.id).toBe("job-1");
    expect(restored.createdAt).toBeInstanceOf(Date);
    expect(restored.expiresAt).toBeInstanceOf(Date);
    expect(restored.createdAt.toISOString()).toBe(createdAt.toISOString());
    expect(restored.expiresAt.toISOString()).toBe(expiresAt.toISOString());
  });
});
