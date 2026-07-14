import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import { getAccessibleDraft } from "@/lib/draft-access";

const eventSchema = z.object({
  draftId: z.string().cuid(),
  eventName: z.enum(["job_import_succeeded", "job_import_failed", "preview_viewed", "plan_selected"]),
  properties: z.record(z.union([z.string().max(1_000), z.number(), z.boolean(), z.null()])).optional(),
});

export async function POST(request: NextRequest) {
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid funnel event." }, { status: 400 });
  const draft = await getAccessibleDraft(request, parsed.data.draftId);
  if (!draft) return NextResponse.json({ error: "Draft access required." }, { status: 401 });
  await db.funnelEvent.create({
    data: {
      eventName: parsed.data.eventName,
      draftId: draft.id,
      employerId: draft.employerId,
      source: "posting_wizard",
      properties: (parsed.data.properties ?? {}) as Prisma.InputJsonValue,
    },
  });
  return new NextResponse(null, { status: 204 });
}
