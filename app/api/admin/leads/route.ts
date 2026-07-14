import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { AuthenticationError, normalizeEmail, requireAdminMutation } from "@/lib/auth";
import { db } from "@/lib/db";

const leadSchema = z.object({
  email: z.union([z.string().email().max(320), z.literal("")]).optional(),
  name: z.string().trim().max(120).optional(),
  company: z.string().trim().max(160).optional(),
  source: z.string().trim().max(120).default("manual"),
  sourceUrl: z.union([z.string().url().max(2_000), z.literal("")]).optional(),
  notes: z.string().trim().max(5_000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdminMutation();
    const parsed = leadSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success || (!parsed.data.email && !parsed.data.company)) {
      return NextResponse.json({ error: "Add an email or organization name." }, { status: 400 });
    }
    const lead = await db.employerLead.create({
      data: {
        ...parsed.data,
        email: parsed.data.email ? normalizeEmail(parsed.data.email) : null,
        sourceUrl: parsed.data.sourceUrl || null,
      },
    });
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Admin lead creation failed", error);
    return NextResponse.json({ error: "Unable to create lead." }, { status: 500 });
  }
}
