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
});

describe.each([
  {
    format: "page metadata",
    html: '<meta property="og:title" content="Farm equipment operator"><meta property="og:description" content="Maintain farm equipment and property.">',
  },
  {
    format: "structured JobPosting data",
    html: `<script type="application/ld+json">${JSON.stringify({
      "@type": "JobPosting",
      title: "Farm equipment operator",
      description: "Maintain farm equipment and property.",
      hiringOrganization: { name: "Example Farm" },
    })}</script>`,
  },
])("application destinations after importing $format", ({ html }) => {
  const sourceUrl = "https://jobboard.example/jobs/farm-equipment-operator";

  beforeEach(() => {
    vi.resetAllMocks();
    lookup.mockResolvedValue([{ address: "8.8.8.8", family: 4 }]);
    serveJobPage(html);
  });

  it("keeps the source as provenance without making it an application destination", async () => {
    const imported = await importJobFromUrl(sourceUrl);

    expect(imported.sourceUrl).toBe(sourceUrl);
    expect(imported.fields).toMatchObject({
      title: "Farm equipment operator",
      description: "Maintain farm equipment and property.",
    });
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
