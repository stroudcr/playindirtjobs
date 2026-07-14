import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { normalizeEmail } from "@/lib/auth";
import { db } from "@/lib/db";

const leadSchema = z.object({
  email: z.string().email().max(320),
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  need: z.string().trim().min(5).max(2_000),
  source: z.string().trim().max(120).default("employers_hub"),
  marketingOptIn: z.boolean().default(false),
  website: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  const parsed = leadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete the employer inquiry form." }, { status: 400 });
  const email = normalizeEmail(parsed.data.email);
  const recent = await db.employerLead.findFirst({
    where: { email, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1_000) } },
    select: { id: true },
  });
  if (!recent) {
    let sourceUrl: string | null = null;
    const referrer = request.headers.get("referer");
    if (referrer) {
      try {
        const parsedReferrer = new URL(referrer);
        sourceUrl = `${parsedReferrer.origin}${parsedReferrer.pathname}`.slice(0, 2_000);
      } catch {
        sourceUrl = null;
      }
    }
    const lead = await db.employerLead.create({
      data: {
        email,
        name: parsed.data.name,
        company: parsed.data.company,
        source: parsed.data.source,
        sourceUrl,
        notes: parsed.data.need,
        metadata: { marketingOptIn: parsed.data.marketingOptIn } as Prisma.InputJsonValue,
      },
    });
    await db.funnelEvent.create({
      data: {
        eventName: "lead_captured",
        source: parsed.data.source,
        properties: { leadId: lead.id, marketingOptIn: parsed.data.marketingOptIn } as Prisma.InputJsonValue,
      },
    });
  }
  return NextResponse.json({ message: "Thanks—we’ll follow up about your hiring plans." }, { status: 201 });
}
