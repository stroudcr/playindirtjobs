import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const funnelEvent = vi.hoisted(() => ({
  findFirst: vi.fn(),
  create: vi.fn(),
}));

vi.mock("@/lib/db", () => ({ db: { funnelEvent } }));

import { POST } from "@/app/api/funnel-events/public/route";

function employerClickRequest(source: string, placement: string) {
  return new NextRequest("https://playindirtjobs.com/api/funnel-events/public", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: "pidj_anon_id=11111111-1111-4111-8111-111111111111",
      "user-agent": "Mozilla/5.0 Chrome/140",
    },
    body: JSON.stringify({
      eventName: "employer_cta_click",
      path: "/almanac/why-your-farm-job-posting-isnt-getting-applicants",
      properties: { source, placement, plan: "basic" },
    }),
  });
}

describe("public employer event deduplication", () => {
  beforeEach(() => {
    funnelEvent.findFirst.mockReset().mockResolvedValue(null);
    funnelEvent.create.mockReset().mockResolvedValue({ id: "event-id" });
  });

  it("scopes duplicate lookup to the CTA source and placement", async () => {
    await POST(
      employerClickRequest(
        "almanac_no_applicants_inline",
        "article_inline"
      )
    );

    expect(funnelEvent.findFirst).toHaveBeenCalledWith({
      where: expect.objectContaining({
        eventName: "employer_cta_click",
        source: "almanac_no_applicants_inline",
        properties: {
          path: ["placement"],
          equals: "article_inline",
        },
      }),
      select: { id: true },
    });
  });
});
