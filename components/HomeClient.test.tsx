import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeClient } from "@/components/HomeClient";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock("@/components/JobCard", () => ({
  JobCard: ({ job }: { job: { title: string } }) => <div>{job.title}</div>,
}));
vi.mock("@/components/EmployerCTA", () => ({ EmployerCTA: () => null }));
vi.mock("@/components/FilterSidebar", () => ({ FilterSidebar: () => null }));
vi.mock("@/components/MobileFilters", () => ({ MobileFilters: () => null }));
vi.mock("@/components/EmailSubscribe", () => ({ EmailSubscribe: () => null }));

const filters = {
  search: "",
  categories: [],
  jobTypes: [],
  farmTypes: [],
  benefits: [],
  sortBy: "latest",
};

function makeJob(id: number) {
  return {
    id: String(id),
    slug: `job-${id}`,
    title: `Job ${id}`,
    company: "Test Farm",
    location: "Test, ON",
    categories: ["farm-hand"],
    jobType: ["full-time"],
    featured: false,
    salaryMin: null,
    salaryMax: null,
    salaryType: null,
    createdAt: "2026-08-01T12:00:00.000Z",
  };
}

describe("HomeClient job pagination", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("appends the next batch and reports the full active total", async () => {
    const initialJobs = Array.from({ length: 50 }, (_, index) => makeJob(index + 1));
    const remainingJobs = Array.from({ length: 7 }, (_, index) => makeJob(index + 51));
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ jobs: remainingJobs, total: 57, hasMore: false }))
    );

    render(
      <HomeClient
        initialJobs={initialJobs}
        initialTotal={57}
        initialFilters={{ ...filters, search: "farmer" }}
        initialPage={1}
        initialOffset={0}
      />
    );

    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 50 of 57 active jobs");
    fireEvent.click(screen.getByRole("button", { name: "Load more jobs" }));

    await waitFor(() => {
      expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 57 of 57 active jobs");
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/jobs?search=farmer&sortBy=latest&offset=50", {
      signal: undefined,
    });
    expect(screen.getByText("Job 57")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Load more jobs" })).not.toBeInTheDocument();
  });

  it("renders crawlable previous and next links for unfiltered result pages", () => {
    const initialJobs = Array.from({ length: 50 }, (_, index) => makeJob(index + 51));

    render(
      <HomeClient
        initialJobs={initialJobs}
        initialTotal={130}
        initialFilters={filters}
        initialPage={2}
        initialOffset={50}
      />
    );

    expect(screen.getByRole("link", { name: "Previous jobs" })).toHaveAttribute("href", "/#jobs");
    expect(screen.getByRole("link", { name: "Next jobs" })).toHaveAttribute("href", "/jobs/page/3#jobs");
    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 51–100 of 130 active jobs");
  });
});
