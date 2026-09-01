import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import {
  createDraftAccess,
  getAccessibleDraft,
  setDraftAccessCookie,
} from "@/lib/draft-access";
import { sanitizePostingLandingPath } from "@/lib/posting-funnel-events";

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
  explicitPlan: z.boolean().default(false),
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
    // Plain /post-job visits resume the current choice. A pricing/CTA link with
    // an explicit plan is itself a plan-selection action and should win.
    const resumed = parsed.data.explicitPlan && existing.plan !== parsed.data.plan
      ? await db.jobDraft.update({
          where: { id: existing.id },
          data: { plan: parsed.data.plan },
        })
      : existing;
    return NextResponse.json({ draft: serializeDraft(resumed) });
  }

  const { token, tokenHash } = createDraftAccess();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1_000);
  const submittedAttribution = parsed.data.attribution ?? {};
  const { landingPath: submittedLandingPath, ...attributionWithoutLandingPath } = submittedAttribution;
  const sanitizedLandingPath = sanitizePostingLandingPath(submittedLandingPath);
  const attribution = {
    ...attributionWithoutLandingPath,
    ...(sanitizedLandingPath ? { landingPath: sanitizedLandingPath } : {}),
  };
  const draft = await db.jobDraft.create({
    data: {
      accessTokenHash: tokenHash,
      data: {},
      plan: parsed.data.plan,
      attribution: jsonValue(attribution),
      expiresAt,
    },
  });

  const response = NextResponse.json({ draft: serializeDraft(draft) }, { status: 201 });
  setDraftAccessCookie(response, draft.id, token);
  return response;
}
