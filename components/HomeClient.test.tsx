import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
    createdAt: new Date("2026-08-01T12:00:00Z"),
  };
}

describe("HomeClient job pagination", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("appends the next batch and reports the full active total", async () => {
    const initialJobs = Array.from({ length: 50 }, (_, index) => makeJob(index + 1));
    const remainingJobs = Array.from({ length: 7 }, (_, index) => ({
      ...makeJob(index + 51),
      createdAt: new Date("2026-08-01T12:00:00Z").toISOString(),
    }));
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ jobs: remainingJobs, total: 57, hasMore: false }))
    );

    render(<HomeClient initialJobs={initialJobs} initialTotal={57} initialFilters={filters} />);

    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 50 of 57 active jobs");
    fireEvent.click(screen.getByRole("button", { name: "Load more jobs" }));

    await waitFor(() => {
      expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 57 of 57 active jobs");
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/jobs?sortBy=latest&offset=50", {
      signal: undefined,
    });
    expect(screen.getByText("Job 57")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Load more jobs" })).not.toBeInTheDocument();
  });
});
