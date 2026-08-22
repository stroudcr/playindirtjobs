import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JobCard } from "@/components/JobCard";
import { toPublicJobDto } from "@/lib/public-job-dto";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("JobCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-22T12:00:00.000Z"));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders a public job after a cache serialization round trip", () => {
    const databaseJob = {
      id: "job-1",
      slug: "farm-hand-test-farm",
      title: "Farm Hand",
      company: "Test Farm",
      location: "Guelph, ON",
      salaryMin: 20,
      salaryMax: 25,
      salaryType: "hourly",
      categories: ["farm-hand"],
      jobType: ["full-time"],
      featured: false,
      createdAt: new Date("2026-08-20T12:00:00.000Z"),
    };
    const cachedJob = JSON.parse(
      JSON.stringify(toPublicJobDto(databaseJob))
    );

    render(<JobCard job={cachedJob} />);

    expect(screen.getByRole("heading", { name: "Farm Hand" })).toBeInTheDocument();
    expect(screen.getByText("2 days ago")).toBeInTheDocument();
    expect(screen.getByText("$20/hr - $25/hr")).toBeInTheDocument();
  });
});
