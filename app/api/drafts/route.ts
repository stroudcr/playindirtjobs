import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import {
  createDraftAccess,
  getAccessibleDraft,
  setDraftAccessCookie,
} from "@/lib/draft-access";

const ANONYMOUS_ID_COOKIE = "pidj_anon_id";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const attributionSchema = z
  .object({
    utm_source: z.string().max(300).optional(),
    utm_medium: z.string().max(300).optional(),
    utm_campaign: z.string().max(300).optional(),
    utm_content: z.string().max(300).optional(),
    utm_term: z.string().max(300).optional(),
    gclid: z.string().max(300).optional(),
    msclkid: z.string().max(300).optional(),
    source: z.string().max(300).optional(),
    landingPath: z.string().max(1_000).optional(),
    referrerHost: z.string().max(300).optional(),
  })
  .strict();

const createDraftSchema = z.object({
  plan: z.enum(["basic", "featured"]).default("basic"),
  attribution: attributionSchema.optional(),
});

function serializeDraft(draft: {
  id: string;
  data: unknown;
  plan: string;
  currentStep: number;
  recoveryOptIn: boolean;
}) {
  return {
    id: draft.id,
    data: draft.data,
    plan: draft.plan === "featured" ? "featured" : "basic",
    currentStep: draft.currentStep,
    recoveryOptIn: draft.recoveryOptIn,
  };
}

function jsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function POST(request: NextRequest) {
  const parsed = createDraftSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid posting source." }, { status: 400 });
  }

  const existing = await getAccessibleDraft(request);
  if (existing) {
    const updated =
      existing.plan === parsed.data.plan
        ? existing
        : await db.jobDraft.update({
            where: { id: existing.id },
            data: { plan: parsed.data.plan },
          });
    return NextResponse.json({ draft: serializeDraft(updated) });
  }

  const { token, tokenHash } = createDraftAccess();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1_000);
  const attribution = parsed.data.attribution ?? {};
  const cookieAnonymousId = request.cookies.get(ANONYMOUS_ID_COOKIE)?.value;
  const anonymousId = cookieAnonymousId && UUID.test(cookieAnonymousId) ? cookieAnonymousId : undefined;
  const draft = await db.jobDraft.create({
    data: {
      accessTokenHash: tokenHash,
      data: {},
      plan: parsed.data.plan,
      attribution: jsonValue(attribution),
      expiresAt,
    },
  });

  await db.funnelEvent.create({
    data: {
      eventName: "posting_started",
      draftId: draft.id,
      anonymousId,
      source: attribution.utm_source ?? attribution.source,
      landingPath: attribution.landingPath,
      referrerHost: attribution.referrerHost,
      properties: jsonValue({
        medium: attribution.utm_medium,
        campaign: attribution.utm_campaign,
        content: attribution.utm_content,
        term: attribution.utm_term,
      }),
    },
  });

  const response = NextResponse.json({ draft: serializeDraft(draft) }, { status: 201 });
  setDraftAccessCookie(response, draft.id, token);
  return response;
}
