import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { AuthenticationError, requireAdminMutation } from "@/lib/auth";
import { db } from "@/lib/db";

const outreachSchema = z.object({
  leadId: z.string().cuid(),
  template: z.enum(["claim_listing", "seasonal_hiring", "partnership_intro"]).default("seasonal_hiring"),
  subject: z.string().trim().min(3).max(180),
  message: z.string().trim().min(20).max(8_000),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdminMutation();
    const parsed = outreachSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Complete the outreach draft." }, { status: 400 });
    const lead = await db.employerLead.findUnique({ where: { id: parsed.data.leadId } });
    if (!lead?.email) return NextResponse.json({ error: "This lead does not have an email address." }, { status: 400 });
    const suppressed = await db.suppressionEntry.findUnique({ where: { email: lead.email } });
    if (suppressed) return NextResponse.json({ error: "This recipient has opted out." }, { status: 409 });

    const message = await db.outreachMessage.create({
      data: {
        leadId: lead.id,
        employerId: lead.employerId,
        recipient: lead.email,
        template: parsed.data.template,
        subject: parsed.data.subject,
        payload: { message: parsed.data.message } as Prisma.InputJsonValue,
      },
    });
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Outreach draft creation failed", error);
    return NextResponse.json({ error: "Unable to create outreach draft." }, { status: 500 });
  }
}
