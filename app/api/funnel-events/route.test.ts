import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAccessibleDraft: vi.fn(),
  findFirst: vi.fn(),
  createMany: vi.fn(),
  create: vi.fn(),
  findPurchase: vi.fn(),
}));

vi.mock("@/lib/draft-access", () => ({
  getAccessibleDraft: mocks.getAccessibleDraft,
}));

vi.mock("@/lib/db", () => ({
  db: {
    funnelEvent: {
      findFirst: mocks.findFirst,
      createMany: mocks.createMany,
      create: mocks.create,
    },
    purchase: { findUnique: mocks.findPurchase },
  },
}));

import { POST } from "@/app/api/funnel-events/route";

const draftId = "cm1234567890draft";

function postingStartedRequest() {
  return new NextRequest("https://playindirtjobs.com/api/funnel-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      draftId,
      eventName: "posting_started",
      properties: { interaction: "form_input", stage: "role_basics" },
    }),
  });
}

function checkoutCancelledRequest() {
  return new NextRequest("https://playindirtjobs.com/api/funnel-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      draftId,
      eventName: "checkout_cancelled",
      properties: { stage: "preview" },
    }),
  });
}

describe("posting funnel event endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAccessibleDraft.mockResolvedValue({
      id: draftId,
      employerId: null,
      attribution: {
        utm_source: "newsletter",
        source: "pricing_basic",
        landingPath: "/post-job?utm_source=newsletter&source=pricing_basic&email=private%40example.com",
      },
    });
    mocks.findFirst.mockResolvedValue(null);
    mocks.createMany.mockResolvedValue({ count: 1 });
  });

  it("uses one deterministic id under concurrent starts and sanitizes attribution", async () => {
    const responses = await Promise.all([
      POST(postingStartedRequest()),
      POST(postingStartedRequest()),
    ]);

    expect(responses.map((response) => response.status)).toEqual([204, 204]);
    expect(mocks.createMany).toHaveBeenCalledTimes(2);
    const first = mocks.createMany.mock.calls[0]?.[0];
    const second = mocks.createMany.mock.calls[1]?.[0];
    expect(first).toMatchObject({
      skipDuplicates: true,
      data: [{
        id: `posting-funnel:${draftId}:posting_started`,
        source: "newsletter",
        landingPath: "/post-job?utm_source=newsletter&source=pricing_basic",
        properties: expect.objectContaining({
          acquisitionSource: "newsletter",
          internalCtaSource: "pricing_basic",
        }),
      }],
    });
    expect(second?.data?.[0]?.id).toBe(first?.data?.[0]?.id);
    expect(JSON.stringify(first)).not.toContain("private@example.com");
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("records cancellation only when the draft has a real Stripe checkout", async () => {
    mocks.findPurchase.mockResolvedValueOnce(null);
    expect((await POST(checkoutCancelledRequest())).status).toBe(204);
    expect(mocks.createMany).not.toHaveBeenCalled();

    mocks.findPurchase.mockResolvedValueOnce({
      id: "purchase_test_123",
      stripeCheckoutSessionId: "cs_test_123",
    });
    expect((await POST(checkoutCancelledRequest())).status).toBe(204);
    expect(mocks.createMany).toHaveBeenCalledWith(expect.objectContaining({
      skipDuplicates: true,
      data: [expect.objectContaining({
        purchaseId: "purchase_test_123",
        eventName: "checkout_cancelled",
      })],
    }));
  });
});
