import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EmployerCTA } from "@/components/EmployerCTA";

vi.mock("@/lib/analytics", () => ({
  trackAnalyticsEvent: vi.fn(),
}));

describe("EmployerCTA", () => {
  it("supports a level-three heading inside the search empty state", () => {
    render(
      <EmployerCTA
        heading="Hiring for a role not shown here?"
        headingLevel={3}
        compact
      />
    );

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Hiring for a role not shown here?",
      })
    ).toBeInTheDocument();
  });

  it("keeps level two as the default for standalone employer prompts", () => {
    render(<EmployerCTA heading="Hiring now?" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Hiring now?" })
    ).toBeInTheDocument();
  });
});
