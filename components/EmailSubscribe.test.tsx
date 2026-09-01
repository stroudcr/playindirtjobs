import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EmailSubscribe } from "@/components/EmailSubscribe";

vi.mock("@/lib/analytics", () => ({
  trackAnalyticsEvent: vi.fn(),
}));

describe("EmailSubscribe employer referral", () => {
  it("uses an internal source without creating a false UTM campaign", () => {
    render(<EmailSubscribe />);

    const link = screen.getByRole("link", {
      name: "Share our employer posting guide →",
    });
    expect(link).toHaveAttribute(
      "href",
      "/employers?source=job_alert_sidebar"
    );
    expect(link.getAttribute("href")).not.toContain("utm_");
  });
});
