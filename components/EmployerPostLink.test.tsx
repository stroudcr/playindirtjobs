import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildEmployerPostHref,
  EmployerPostLink,
} from "@/components/EmployerPostLink";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  EMPLOYER_ATTRIBUTION_STORAGE_KEY,
  resetSessionEmployerAttributionCacheForTests,
} from "@/lib/employer-attribution";

vi.mock("@/lib/analytics", () => ({
  trackAnalyticsEvent: vi.fn(),
}));

describe("EmployerPostLink", () => {
  beforeEach(() => {
    vi.mocked(trackAnalyticsEvent).mockReset();
    window.sessionStorage.clear();
    resetSessionEmployerAttributionCacheForTests();
    window.history.replaceState({}, "", "/");
  });

  it("builds a crawlable destination with a stable placement source", () => {
    expect(
      buildEmployerPostHref({ source: "state_jobs_california" })
    ).toBe("/post-job?plan=basic&source=state_jobs_california");
  });

  it("preserves upstream campaign data without keeping an older internal source", () => {
    window.history.replaceState(
      {},
      "",
      "/california-jobs?utm_source=google&utm_campaign=spring_hiring&gclid=click-123&source=header&search=manager"
    );

    render(
      <EmployerPostLink
        source="state_jobs_california"
        eventParams={{ placement: "state_jobs" }}
        onClick={(event) => event.preventDefault()}
      >
        Post a California job
      </EmployerPostLink>
    );

    const link = screen.getByRole("link", { name: "Post a California job" });
    fireEvent.click(link);

    expect(link).toHaveAttribute(
      "href",
      "/post-job?plan=basic&source=state_jobs_california&utm_source=google&utm_campaign=spring_hiring&gclid=click-123"
    );
    expect(link.getAttribute("href")).not.toContain("search=");
    expect(link.getAttribute("href")).not.toContain("source=header");
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("employer_cta_click", {
      placement: "state_jobs",
      source: "state_jobs_california",
      plan: "basic",
    });
  });

  it("keeps allowlisted acquisition data across untagged browse navigation", () => {
    window.history.replaceState(
      {},
      "",
      "/?utm_source=google&utm_campaign=spring_hiring&gclid=click-123&email=person%40example.com&search=manager&source=header"
    );
    const landing = render(
      <EmployerPostLink source="header">Post a job</EmployerPostLink>
    );

    expect(
      JSON.parse(
        window.sessionStorage.getItem(EMPLOYER_ATTRIBUTION_STORAGE_KEY) ??
          "{}"
      )
    ).toEqual({
      utm_source: "google",
      utm_campaign: "spring_hiring",
      gclid: "click-123",
    });

    landing.unmount();
    window.history.replaceState({}, "", "/jobs/farm-manager");
    render(
      <EmployerPostLink
        source="job_detail"
        onClick={(event) => event.preventDefault()}
      >
        Post a similar job
      </EmployerPostLink>
    );

    const link = screen.getByRole("link", { name: "Post a similar job" });
    fireEvent.mouseDown(link);

    expect(link).toHaveAttribute(
      "href",
      "/post-job?plan=basic&source=job_detail&utm_source=google&utm_campaign=spring_hiring&gclid=click-123"
    );
    expect(link.getAttribute("href")).not.toContain("email=");
    expect(link.getAttribute("href")).not.toContain("search=");
  });

  it("replaces an older session campaign with a newly tagged page", () => {
    window.sessionStorage.setItem(
      EMPLOYER_ATTRIBUTION_STORAGE_KEY,
      JSON.stringify({
        utm_source: "newsletter",
        utm_campaign: "old_campaign",
        msclkid: "old-click",
      })
    );
    window.history.replaceState(
      {},
      "",
      "/pricing?utm_source=google&utm_campaign=new_campaign"
    );

    const tagged = render(
      <EmployerPostLink source="pricing_basic">Choose Basic</EmployerPostLink>
    );
    tagged.unmount();
    window.history.replaceState({}, "", "/employers");
    render(
      <EmployerPostLink
        source="employers_hub_final"
        onClick={(event) => event.preventDefault()}
      >
        Start a listing
      </EmployerPostLink>
    );

    const link = screen.getByRole("link", { name: "Start a listing" });
    fireEvent.click(link);

    expect(link).toHaveAttribute(
      "href",
      "/post-job?plan=basic&source=employers_hub_final&utm_source=google&utm_campaign=new_campaign"
    );
    expect(link.getAttribute("href")).not.toContain("old_campaign");
    expect(link.getAttribute("href")).not.toContain("msclkid");
  });
});
