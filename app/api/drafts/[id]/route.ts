import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import { getAccessibleDraft } from "@/lib/draft-access";
import { draftJobDataSchema } from "@/lib/validations";

const patchSchema = z.object({
  data: draftJobDataSchema.optional(),
  plan: z.enum(["basic", "featured"]).optional(),
  currentStep: z.number().int().min(1).max(4).optional(),
  recoveryOptIn: z.boolean().optional(),
  importUrl: z.string().url().max(2_000).nullable().optional(),
});

function publicDraft(draft: {
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const draft = await getAccessibleDraft(request, id);
  if (!draft) {
    return NextResponse.json({ error: "This draft is unavailable or has expired." }, { status: 404 });
  }
  return NextResponse.json({ draft: publicDraft(draft) }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [draft, parsed] = await Promise.all([
    getAccessibleDraft(request, id),
    request.json().then((body) => patchSchema.safeParse(body)).catch(() => patchSchema.safeParse(null)),
  ]);

  if (!draft) {
    return NextResponse.json({ error: "This draft is unavailable or has expired." }, { status: 404 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Some draft fields could not be saved.", details: parsed.error.flatten() }, { status: 400 });
  }

  const existingData = draft.data && typeof draft.data === "object" && !Array.isArray(draft.data)
    ? (draft.data as Record<string, unknown>)
    : {};
  const mergedData = parsed.data.data ? { ...existingData, ...parsed.data.data } : existingData;
  const managementEmail = typeof mergedData.managementEmail === "string"
    ? mergedData.managementEmail.trim().toLowerCase()
    : undefined;

  const updated = await db.jobDraft.update({
    where: { id: draft.id },
    data: {
      data: mergedData as Prisma.InputJsonValue,
      email: managementEmail || draft.email,
      plan: parsed.data.plan,
      currentStep: parsed.data.currentStep,
      recoveryOptIn: parsed.data.recoveryOptIn,
      importUrl: parsed.data.importUrl,
    },
  });

  if (parsed.data.currentStep && parsed.data.currentStep !== draft.currentStep) {
    await db.funnelEvent.create({
      data: {
        eventName: "posting_step_completed",
        draftId: draft.id,
        properties: { completedStep: Math.min(draft.currentStep, parsed.data.currentStep - 1), nextStep: parsed.data.currentStep },
      },
    });
  }

  return NextResponse.json({ draft: publicDraft(updated) });
}
