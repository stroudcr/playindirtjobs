import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { getAccessibleDraft } from "@/lib/draft-access";
import {
  DEDUPED_POSTING_FUNNEL_EVENTS,
  dedupedPostingFunnelEventId,
  postingAttributionDimensions,
  postingFunnelEventSchema,
  sanitizePostingLandingPath,
} from "@/lib/posting-funnel-events";

const ANONYMOUS_ID_COOKIE = "pidj_anon_id";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function stringProperty(value: unknown) {
  return typeof value === "string" && value ? value : undefined;
}

export async function POST(request: NextRequest) {
  const parsed = postingFunnelEventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid funnel event." }, { status: 400 });
  const draft = await getAccessibleDraft(request, parsed.data.draftId);
  if (!draft) return NextResponse.json({ error: "Draft access required." }, { status: 401 });

  const shouldDedupe = DEDUPED_POSTING_FUNNEL_EVENTS.has(parsed.data.eventName);
  if (shouldDedupe) {
    const existing = await db.funnelEvent.findFirst({
      where: { draftId: draft.id, eventName: parsed.data.eventName },
      select: { id: true },
    });
    if (existing) return new NextResponse(null, { status: 204 });
  }

  const isPostingStart = parsed.data.eventName === "posting_started";
  const attribution = draft.attribution && typeof draft.attribution === "object" && !Array.isArray(draft.attribution)
    ? draft.attribution as Record<string, unknown>
    : {};
  const { acquisitionSource, internalCtaSource } = postingAttributionDimensions(attribution);
  const cookieAnonymousId = request.cookies.get(ANONYMOUS_ID_COOKIE)?.value;
  const anonymousId = isPostingStart && cookieAnonymousId && UUID.test(cookieAnonymousId)
    ? cookieAnonymousId
    : undefined;
  const properties = isPostingStart
    ? {
        ...parsed.data.properties,
        ...(acquisitionSource ? { acquisitionSource } : {}),
        ...(internalCtaSource ? { internalCtaSource } : {}),
        medium: stringProperty(attribution.utm_medium),
        campaign: stringProperty(attribution.utm_campaign),
        content: stringProperty(attribution.utm_content),
        term: stringProperty(attribution.utm_term),
      }
    : parsed.data.properties ?? {};

  const cancellationPurchase = parsed.data.eventName === "checkout_cancelled"
    ? await db.purchase.findUnique({
        where: { draftId: draft.id },
        select: { id: true, stripeCheckoutSessionId: true },
      })
    : null;
  if (
    parsed.data.eventName === "checkout_cancelled" &&
    !cancellationPurchase?.stripeCheckoutSessionId
  ) {
    return new NextResponse(null, { status: 204 });
  }
  const eventData: Prisma.FunnelEventUncheckedCreateInput = {
    eventName: parsed.data.eventName,
    draftId: draft.id,
    employerId: draft.employerId,
    purchaseId: cancellationPurchase?.id,
    anonymousId,
    source: isPostingStart
      ? acquisitionSource ?? internalCtaSource
      : "posting_wizard",
    landingPath: isPostingStart
      ? sanitizePostingLandingPath(attribution.landingPath)
      : undefined,
    referrerHost: isPostingStart ? stringProperty(attribution.referrerHost) : undefined,
    properties: properties as Prisma.InputJsonValue,
  };

  if (shouldDedupe) {
    const id = dedupedPostingFunnelEventId(draft.id, parsed.data.eventName);
    await db.funnelEvent.createMany({
      data: [{ id, ...eventData }],
      skipDuplicates: true,
    });
  } else {
    await db.funnelEvent.create({ data: eventData });
  }
  return new NextResponse(null, { status: 204 });
}
