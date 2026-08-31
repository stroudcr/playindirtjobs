import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAccessibleDraft } from "@/lib/draft-access";
import { importJobFromUrl } from "@/lib/job-import";

export const runtime = "nodejs";

const requestSchema = z.object({
  url: z.string().url().max(2_000),
  draftId: z.string().cuid(),
});

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid job-post URL." }, { status: 400 });
  }

  const draft = await getAccessibleDraft(request, parsed.data.draftId);
  if (!draft || draft.status !== "DRAFT") {
    return NextResponse.json({ error: "This posting draft is unavailable or has expired." }, { status: 404 });
  }

  try {
    const result = await importJobFromUrl(parsed.data.url);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to import that job page.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
