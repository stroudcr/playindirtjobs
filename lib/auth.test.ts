import { afterEach, describe, expect, it, vi } from "vitest";
import {
  generateOpaqueToken,
  hashOpaqueToken,
  isAdminEmail,
  normalizeEmail,
  safeReturnTo,
} from "@/lib/auth";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("employer authentication primitives", () => {
  it("normalizes email addresses before lookup", () => {
    expect(normalizeEmail("  ＯＷＮＥＲ@ＥＸＡＭＰＬＥ.COM  ")).toBe(
      "owner@example.com"
    );
  });

  it("generates distinct opaque tokens and stores deterministic hashes", () => {
    const first = generateOpaqueToken();
    const second = generateOpaqueToken();

    expect(first).not.toBe(second);
    expect(first).toMatch(/^[A-Za-z0-9_-]{40,}$/);
    expect(hashOpaqueToken(first)).toMatch(/^[a-f0-9]{64}$/);
    expect(hashOpaqueToken(first)).toBe(hashOpaqueToken(first));
    expect(hashOpaqueToken(first)).not.toContain(first);
  });

  it("parses the administrator allowlist using normalized emails", () => {
    vi.stubEnv(
      "ADMIN_EMAILS",
      "Owner@Example.com; operations@example.com admin@example.com"
    );

    expect(isAdminEmail("owner@example.com")).toBe(true);
    expect(isAdminEmail(" OPERATIONS@EXAMPLE.COM ")).toBe(true);
    expect(isAdminEmail("employer@example.com")).toBe(false);
  });

  it("accepts only same-site relative return paths", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://www.playindirtjobs.com");

    expect(safeReturnTo("/jobs/farm-hand/claim?source=email#form")).toBe(
      "/jobs/farm-hand/claim?source=email#form"
    );
    expect(safeReturnTo("https://attacker.example/steal")).toBe("/employer");
    expect(safeReturnTo("//attacker.example/steal")).toBe("/employer");
    expect(safeReturnTo("/\\attacker.example/steal")).toBe("/employer");
  });
});
