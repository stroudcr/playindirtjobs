import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PostJobWizard } from "@/components/PostJobWizard";
import { FARM_TYPES, JOB_CATEGORIES, JOB_TYPES, US_STATES } from "@/lib/constants";

const navigationState = vi.hoisted(() => ({ search: "" }));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(navigationState.search),
}));

vi.mock("@/components/PlanSelector", () => ({
  PlanSelector: () => React.createElement("div", { "data-testid": "plan-selector" }),
}));

const draft = {
  id: "cm1234567890draft",
  data: {},
  plan: "basic" as const,
  currentStep: 1,
  recoveryOptIn: false,
};

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function requestUrl(input: RequestInfo | URL) {
  return typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
}

function requestBody(init?: RequestInit) {
  return typeof init?.body === "string" ? JSON.parse(init.body) as Record<string, unknown> : {};
}

function funnelEvents(fetchMock: ReturnType<typeof vi.fn>) {
  return fetchMock.mock.calls
    .filter(([input]) => requestUrl(input as RequestInfo | URL) === "/api/funnel-events")
    .map(([, init]) => requestBody(init as RequestInit));
}

function installFetch(
  importResponse?: Response,
  options: {
    draft?: typeof draft;
    patchResponse?: () => Response | undefined;
  } = {}
) {
  const responseDraft = options.draft ?? draft;
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = requestUrl(input);
    if (url === "/api/drafts") return jsonResponse({ draft: responseDraft }, 201);
    if (url.startsWith("/api/drafts/") && init?.method === "PATCH") {
      return options.patchResponse?.() ?? jsonResponse({ draft: responseDraft });
    }
    if (url.startsWith("/api/drafts/")) return jsonResponse({ draft: responseDraft });
    if (url === "/api/funnel-events") return new Response(null, { status: 204 });
    if (url === "/api/job-import") {
      return importResponse ?? jsonResponse({ error: "Unable to import that page." }, 422);
    }
    throw new Error(`Unexpected fetch: ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("PostJobWizard progressive role step", () => {
  beforeEach(() => {
    navigationState.search = "";
    window.history.replaceState({}, "", "/post-job");
    Object.defineProperty(window, "scrollTo", { value: vi.fn(), configurable: true });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("starts with essentials, records one meaningful start, and preserves navigation through classification", async () => {
    const fetchMock = installFetch();
    render(<PostJobWizard />);

    await screen.findByRole("heading", { name: "Start with the essentials" });
    expect(screen.getByText("Fastest option")).toBeVisible();
    expect(screen.queryByText("Job categories")).not.toBeInTheDocument();
    expect(funnelEvents(fetchMock)).toHaveLength(0);

    fireEvent.change(screen.getByLabelText(/Job title/), { target: { value: "Seasonal greenhouse grower" } });
    fireEvent.change(screen.getByLabelText(/Farm or company name/), { target: { value: "Green Valley Nursery" } });
    fireEvent.change(screen.getByLabelText(/City/), { target: { value: "Athens" } });
    fireEvent.change(screen.getByLabelText(/State/), { target: { value: US_STATES[0].code } });

    await waitFor(() => {
      expect(funnelEvents(fetchMock).filter((event) => event.eventName === "posting_started")).toHaveLength(1);
    });
    const startEvent = funnelEvents(fetchMock).find((event) => event.eventName === "posting_started");
    expect(startEvent).toMatchObject({
      properties: { interaction: "form_input", stage: "role_basics" },
    });
    expect(JSON.stringify(startEvent)).not.toContain("Seasonal greenhouse grower");

    fireEvent.click(screen.getByRole("button", { name: /Continue to role details/ }));
    await screen.findByRole("heading", { name: "Help candidates find this role" });
    expect(screen.getByText("Job categories")).toBeVisible();
    expect(screen.getByText("Job type")).toBeVisible();
    expect(screen.getByText("Operation type")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Back/ }));
    await screen.findByRole("heading", { name: "Start with the essentials" });
    expect(screen.getByLabelText(/Job title/)).toHaveValue("Seasonal greenhouse grower");

    fireEvent.click(screen.getByRole("button", { name: /Continue to role details/ }));
    await screen.findByRole("heading", { name: "Help candidates find this role" });
    fireEvent.click(screen.getByRole("button", { name: /^Continue/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Choose at least one category, job type, and operation type.");

    fireEvent.click(screen.getByLabelText(new RegExp(JOB_CATEGORIES[0].label)));
    fireEvent.click(screen.getByLabelText(new RegExp(JOB_TYPES[0].label)));
    fireEvent.click(screen.getByLabelText(new RegExp(FARM_TYPES[0].label)));
    fireEvent.click(screen.getByRole("button", { name: /^Continue/ }));

    await screen.findByRole("heading", { name: "Description, pay and benefits" });
    await waitFor(() => {
      expect(funnelEvents(fetchMock).some((event) => event.eventName === "posting_role_basics_completed")).toBe(true);
      expect(funnelEvents(fetchMock).some((event) => event.eventName === "posting_classification_completed")).toBe(true);
    });
  });

  it("measures import attempt and success without putting the source URL in funnel properties", async () => {
    const sourceUrl = "https://existing.example/jobs/farm-manager?private=do-not-track";
    const fetchMock = installFetch(jsonResponse({
      sourceUrl,
      extraction: "structured",
      warnings: ["Review compensation."],
      fields: {
        title: "Imported Farm Manager",
        company: "Imported Farm",
        city: "Salem",
        state: "OR",
        categories: [JOB_CATEGORIES[0].id],
        jobType: [JOB_TYPES[0].id],
        farmType: [FARM_TYPES[0].id],
      },
    }));
    render(<PostJobWizard />);

    await screen.findByRole("heading", { name: "Start with the essentials" });
    fireEvent.change(screen.getByLabelText("Public job-post URL"), { target: { value: sourceUrl } });
    fireEvent.click(screen.getByRole("button", { name: "Import job details" }));

    await waitFor(() => expect(screen.getByLabelText(/Job title/)).toHaveValue("Imported Farm Manager"));
    await waitFor(() => {
      const names = funnelEvents(fetchMock).map((event) => event.eventName);
      expect(names).toEqual(expect.arrayContaining([
        "posting_started",
        "job_import_attempted",
        "job_import_succeeded",
      ]));
    });
    const measurementPayloads = JSON.stringify(funnelEvents(fetchMock));
    expect(measurementPayloads).not.toContain(sourceUrl);
    expect(measurementPayloads).not.toContain("existing.example");
  });

  it("measures a failed import with only its status code", async () => {
    const fetchMock = installFetch(jsonResponse({ error: "That page could not be imported." }, 422));
    render(<PostJobWizard />);

    await screen.findByRole("heading", { name: "Start with the essentials" });
    fireEvent.change(screen.getByLabelText("Public job-post URL"), { target: { value: "https://example.com/job" } });
    fireEvent.click(screen.getByRole("button", { name: "Import job details" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("That page could not be imported.");
    await waitFor(() => {
      expect(funnelEvents(fetchMock)).toContainEqual(expect.objectContaining({
        eventName: "job_import_failed",
        properties: { statusCode: 422 },
      }));
    });
  });

  it("removes arbitrary query parameters before creating attribution", async () => {
    navigationState.search = "?plan=basic&utm_source=newsletter&utm_campaign=spring&source=pricing_basic&email=private%40example.com&session_id=secret";
    window.history.replaceState({}, "", `/post-job${navigationState.search}`);
    const fetchMock = installFetch();
    render(<PostJobWizard />);

    await screen.findByRole("heading", { name: "Start with the essentials" });
    const createCall = fetchMock.mock.calls.find(
      ([input]) => requestUrl(input as RequestInfo | URL) === "/api/drafts"
    );
    const body = requestBody(createCall?.[1] as RequestInit);
    expect(body.attribution).toMatchObject({
      utm_source: "newsletter",
      utm_campaign: "spring",
      source: "pricing_basic",
      landingPath: "/post-job?utm_source=newsletter&utm_campaign=spring&source=pricing_basic",
    });
    expect(JSON.stringify(body.attribution)).not.toContain("private@example.com");
    expect(JSON.stringify(body.attribution)).not.toContain("session_id=secret");
  });

  it("records checkout cancellation once and shows draft recovery guidance", async () => {
    navigationState.search = `?draft=${draft.id}&checkout=cancelled`;
    window.history.replaceState({}, "", `/post-job${navigationState.search}`);
    const fetchMock = installFetch(undefined, {
      draft: { ...draft, currentStep: 4 },
    });
    render(<PostJobWizard />);

    expect(await screen.findByRole("status")).toHaveTextContent("Your draft is safe");
    await waitFor(() => {
      expect(funnelEvents(fetchMock).filter(
        (event) => event.eventName === "checkout_cancelled"
      )).toHaveLength(1);
    });
    expect(funnelEvents(fetchMock).find(
      (event) => event.eventName === "checkout_cancelled"
    )).toMatchObject({ properties: { stage: "preview" } });
  });

  it("does not mark classification complete when its transition cannot be saved", async () => {
    let failSaves = false;
    const fetchMock = installFetch(undefined, {
      patchResponse: () => failSaves
        ? jsonResponse({ error: "Unable to save classification." }, 503)
        : undefined,
    });
    render(<PostJobWizard />);

    await screen.findByRole("heading", { name: "Start with the essentials" });
    fireEvent.change(screen.getByLabelText(/Job title/), { target: { value: "Seasonal greenhouse grower" } });
    fireEvent.change(screen.getByLabelText(/Farm or company name/), { target: { value: "Green Valley Nursery" } });
    fireEvent.change(screen.getByLabelText(/City/), { target: { value: "Athens" } });
    fireEvent.change(screen.getByLabelText(/State/), { target: { value: US_STATES[0].code } });
    fireEvent.click(screen.getByRole("button", { name: /Continue to role details/ }));
    await screen.findByRole("heading", { name: "Help candidates find this role" });

    fireEvent.click(screen.getByLabelText(new RegExp(JOB_CATEGORIES[0].label)));
    fireEvent.click(screen.getByLabelText(new RegExp(JOB_TYPES[0].label)));
    fireEvent.click(screen.getByLabelText(new RegExp(FARM_TYPES[0].label)));
    failSaves = true;
    fireEvent.click(screen.getByRole("button", { name: /^Continue/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to save classification.");
    expect(funnelEvents(fetchMock).some(
      (event) => event.eventName === "posting_classification_completed"
    )).toBe(false);
  });
});
