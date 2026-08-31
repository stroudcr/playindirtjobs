import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LiveJobPreview } from "@/components/LiveJobPreview";

afterEach(cleanup);

describe("LiveJobPreview", () => {
  it("shows the complete public listing and the application behavior before payment", () => {
    render(
      <LiveJobPreview
        featured
        data={{
          title: "Farm Operations Manager",
          company: "Example Farm",
          city: "Athens",
          state: "GA",
          postalCode: "30601",
          remote: false,
          description: "Lead crop planning and equipment maintenance.\n\nCoordinate the harvest team and maintain production records.",
          salaryMin: "24",
          salaryMax: "30",
          salaryType: "hourly",
          jobType: ["full-time"],
          farmType: ["organic"],
          categories: ["farm-manager"],
          tags: ["machinery"],
          benefits: ["housing", "health-insurance"],
          companyWebsite: "https://example.com",
          companyLogo: "https://example.com/logo.png",
          applyUrl: "https://example.com/apply",
          applyEmail: "jobs@example.com",
        }}
      />
    );

    expect(screen.getByRole("heading", { name: "Public listing preview" })).toBeInTheDocument();
    expect(screen.getByText(/Lead crop planning and equipment maintenance/)).toBeInTheDocument();
    expect(screen.getByText("Organic")).toBeInTheDocument();
    expect(screen.getByText("Machinery")).toBeInTheDocument();
    expect(screen.getByText("Housing Included")).toBeInTheDocument();
    expect(screen.getByText("Health Insurance")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/apply")).toBeInTheDocument();
    expect(screen.getByText(/application URL takes priority/i)).toBeInTheDocument();
    expect(screen.getByText("https://example.com/logo.png")).toBeInTheDocument();
  });
});
