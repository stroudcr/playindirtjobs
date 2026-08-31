import { EventEmitter } from "node:events";
import { Readable } from "node:stream";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { importJobFromUrl, isPublicNetworkAddress } from "@/lib/job-import";
import { getPublicApplicationDestination } from "@/lib/public-application";

const { lookup, httpsRequest } = vi.hoisted(() => ({
  lookup: vi.fn(),
  httpsRequest: vi.fn(),
}));

vi.mock("node:dns/promises", () => ({ lookup, default: { lookup } }));
vi.mock("node:https", () => ({ request: httpsRequest, default: { request: httpsRequest } }));

function serveJobPage(html: string) {
  const response = Object.assign(Readable.from([Buffer.from(html)]), {
    statusCode: 200,
    headers: { "content-type": "text/html" },
  });
  httpsRequest.mockImplementation((_options: unknown, onResponse: (value: typeof response) => void) => {
    const request = Object.assign(new EventEmitter(), {
      setTimeout: vi.fn(),
      destroy: vi.fn(),
      end: () => onResponse(response),
    });
    return request;
  });
}

describe("job URL network protections", () => {
  it.each([
    "127.0.0.1",
    "10.1.2.3",
    "172.16.0.1",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "::1",
    "fc00::1",
    "fe80::1",
    "2001:db8::1",
  ])("rejects private or reserved address %s", (address) => {
    expect(isPublicNetworkAddress(address)).toBe(false);
  });

  it.each(["1.1.1.1", "8.8.8.8", "2606:4700:4700::1111"])(
    "allows public address %s",
    (address) => {
      expect(isPublicNetworkAddress(address)).toBe(true);
    }
  );

  it.each([
    "::ffff:7f00:1",
    "::ffff:a9fe:a9fe",
    "[::ffff:7f00:1]",
    "::7f00:1",
  ])("rejects hexadecimal IPv4-mapped private address %s", (address) => {
    expect(isPublicNetworkAddress(address)).toBe(false);
  });
});

describe("job import data integrity", () => {
  const sourceUrl = "https://jobboard.example/jobs/farm-manager";

  beforeEach(() => {
    vi.resetAllMocks();
    lookup.mockResolvedValue([{ address: "8.8.8.8", family: 4 }]);
  });

  it("normalizes full state names and omits unsupported defaults", async () => {
    serveJobPage(`<script type="application/ld+json">${JSON.stringify({
      "@type": "JobPosting",
      title: "Farm manager",
      description: "Lead crop planning, field work, and a small production team throughout the growing season.",
      hiringOrganization: { name: "Example Farm" },
      jobLocation: { address: { addressLocality: "Athens", addressRegion: "Georgia" } },
    })}</script>`);

    const imported = await importJobFromUrl(sourceUrl);

    expect(imported.fields).toMatchObject({ state: "GA", city: "Athens" });
    expect(imported.fields).not.toHaveProperty("remote");
    expect(imported.fields).not.toHaveProperty("salaryType");
    expect(imported.fields).not.toHaveProperty("jobType");
  });

  it("strips matching site branding and refuses a visibly truncated metadata description", async () => {
    serveJobPage(`
      <meta property="og:site_name" content="RanchWork.com">
      <meta property="og:title" content="Farm manager | RanchWork.com">
      <meta property="og:description" content="Lead daily farm operations [&hellip;]">
    `);

    const imported = await importJobFromUrl(sourceUrl);

    expect(imported.fields.title).toBe("Farm manager");
    expect(imported.fields).not.toHaveProperty("description");
    expect(imported.extraction).toBe("metadata");
    expect(imported.warnings.join(" ")).toMatch(/truncated summary/i);
  });

  it("caps metadata titles at the posting schema limit", async () => {
    serveJobPage(`<meta property="og:title" content="${"A".repeat(140)}"><meta property="og:description" content="Complete job details for the role.">`);

    const imported = await importJobFromUrl(sourceUrl);

    expect(imported.fields.title).toHaveLength(100);
  });

  it("keeps apostrophes inside quoted metadata attributes", async () => {
    serveJobPage(`<meta property="og:title" content="Farmer's Market Manager"><meta property="og:description" content="We're hiring a manager.">`);

    const imported = await importJobFromUrl(sourceUrl);

    expect(imported.fields.title).toBe("Farmer's Market Manager");
    expect(imported.fields).not.toHaveProperty("description");
  });

  it("never replaces a full description with page-summary metadata", async () => {
    serveJobPage(`<meta property="og:title" content="Farm manager"><meta property="og:description" content="Manage daily growing operations, coordinate the crew, and oversee equipment maintenance throughout the season.">`);

    const imported = await importJobFromUrl(sourceUrl);

    expect(imported.fields).toEqual({ title: "Farm manager" });
    expect(imported.warnings.join(" ")).toMatch(/description was left unchanged/i);
  });

  it("uses the structured job whose canonical URL matches the imported page", async () => {
    serveJobPage(`<script type="application/ld+json">${JSON.stringify({
      "@graph": [
        {
          "@type": "JobPosting",
          url: "https://jobboard.example/jobs/other-role",
          title: "Unrelated richer role",
          description: "This is a richer sidebar job that must not win selection just because it has more populated fields.",
          hiringOrganization: { name: "Other Farm" },
          jobLocation: { address: { addressLocality: "Rome", addressRegion: "GA" } },
        },
        {
          "@type": "JobPosting",
          url: sourceUrl,
          title: "Farm manager",
          description: "Manage the farm team and seasonal production plan.",
        },
      ],
    })}</script>`);

    const imported = await importJobFromUrl(sourceUrl);

    expect(imported.fields.title).toBe("Farm manager");
  });

  it("declines ambiguous structured listings instead of guessing the wrong job", async () => {
    serveJobPage(`
      <meta property="og:title" content="Current job page">
      <script type="application/ld+json">${JSON.stringify({
        "@graph": [
          { "@type": "JobPosting", title: "First role", description: "First role description." },
          { "@type": "JobPosting", title: "Second richer role", description: "Second role description with more details.", hiringOrganization: { name: "Farm" } },
        ],
      })}</script>
    `);

    const imported = await importJobFromUrl(sourceUrl);

    expect(imported.extraction).toBe("metadata");
    expect(imported.fields.title).toBe("Current job page");
    expect(imported.warnings.join(" ")).toMatch(/multiple jobs/i);
  });

  it("imports explicit structured values without inventing missing defaults", async () => {
    serveJobPage(`<script type="application/ld+json">${JSON.stringify({
      "@type": "JobPosting",
      title: "Remote farm coordinator",
      description: "Coordinate field schedules, suppliers, and the seasonal farm team from a remote operations office.",
      employmentType: ["FULL_TIME", "CONTRACTOR"],
      jobLocationType: "TELECOMMUTE",
      hiringOrganization: { name: "Example Farm", sameAs: ["https://example.com"] },
      jobLocation: [{ address: { addressLocality: "Athens", addressRegion: "US-GA" } }],
      baseSalary: { unitText: "HOUR", value: { minValue: 24, maxValue: 30 } },
    })}</script>`);

    const imported = await importJobFromUrl(sourceUrl);

    expect(imported.fields).toMatchObject({
      remote: true,
      salaryMin: 24,
      salaryMax: 30,
      salaryType: "hourly",
      jobType: ["full-time", "contract"],
      companyWebsite: "https://example.com/",
      state: "GA",
    });
  });

  it("omits over-limit structured descriptions instead of silently cutting them", async () => {
    serveJobPage(`<script type="application/ld+json">${JSON.stringify({
      "@type": "JobPosting",
      title: "Farm manager",
      description: "A".repeat(5_001),
    })}</script>`);

    const imported = await importJobFromUrl(sourceUrl);

    expect(imported.fields).not.toHaveProperty("description");
    expect(imported.warnings.join(" ")).toMatch(/5,000-character/i);
  });

  it("redacts secret query parameters and fragments from stored provenance", async () => {
    serveJobPage(`<meta property="og:title" content="Farm manager">`);

    const imported = await importJobFromUrl(`${sourceUrl}?job=42&access_token=secret#private`);

    expect(imported.sourceUrl).toBe(`${sourceUrl}?job=42`);
  });
});

describe.each([
  {
    format: "page metadata",
    html: '<meta property="og:title" content="Farm equipment operator"><meta property="og:description" content="Maintain farm equipment and property.">',
    expectsDescription: false,
  },
  {
    format: "structured JobPosting data",
    html: `<script type="application/ld+json">${JSON.stringify({
      "@type": "JobPosting",
      title: "Farm equipment operator",
      description: "Maintain farm equipment and property.",
      hiringOrganization: { name: "Example Farm" },
    })}</script>`,
    expectsDescription: true,
  },
])("application destinations after importing $format", ({ html, expectsDescription }) => {
  const sourceUrl = "https://jobboard.example/jobs/farm-equipment-operator";

  beforeEach(() => {
    vi.resetAllMocks();
    lookup.mockResolvedValue([{ address: "8.8.8.8", family: 4 }]);
    serveJobPage(html);
  });

  it("keeps the source as provenance without making it an application destination", async () => {
    const imported = await importJobFromUrl(sourceUrl);

    expect(imported.sourceUrl).toBe(sourceUrl);
    expect(imported.fields.title).toBe("Farm equipment operator");
    if (expectsDescription) {
      expect(imported.fields.description).toBe("Maintain farm equipment and property.");
    } else {
      expect(imported.fields).not.toHaveProperty("description");
      expect(imported.warnings.join(" ")).toMatch(/description was left unchanged/i);
    }
    expect(imported.fields).not.toHaveProperty("applyUrl");
    expect(getPublicApplicationDestination({
      applyUrl: "",
      applyEmail: "",
      ...imported.fields,
    })).toBeNull();
  });

  it("preserves a direct application email when imported details are merged into a draft", async () => {
    const imported = await importJobFromUrl(sourceUrl);
    const destination = getPublicApplicationDestination({
      applyUrl: "",
      applyEmail: "jobs@employer.example",
      ...imported.fields,
    });

    expect(destination?.type).toBe("email");
    expect(destination?.url.href).toBe("mailto:jobs@employer.example");
  });

  it("preserves an explicitly chosen application URL and its priority over email on reimport", async () => {
    const imported = await importJobFromUrl(sourceUrl);
    const destination = getPublicApplicationDestination({
      applyUrl: "https://employer.example/apply",
      applyEmail: "jobs@employer.example",
      ...imported.fields,
    });

    expect(destination?.type).toBe("url");
    expect(destination?.url.href).toBe("https://employer.example/apply");
  });
});
