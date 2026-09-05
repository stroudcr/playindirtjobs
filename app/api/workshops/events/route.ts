import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isSameOrigin } from "@/lib/workshop-security";
import {
  isLikelyAutomatedEmployerEvent,
  vercelCountryCode,
} from "@/lib/public-event-quality";
const schema = z.object({
  workshopId: z.string().min(5).max(80),
  eventName: z.enum([
    "workshop_detail_view",
    "workshop_placement_view",
    "workshop_registration_click",
  ]),
  source: z.string().regex(/^[a-z_-]{1,40}$/),
  visitor: z.string().uuid(),
});
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request) || isLikelyAutomatedEmployerEvent(request.headers))
    return new NextResponse(null, { status: 204 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  const { visitor, ...data } = parsed.data;
  const workshop = await db.workshop.findFirst({
    where: {
      id: data.workshopId,
      status: "PUBLISHED",
      expiresAt: { gt: new Date() },
    },
    select: { id: true },
  });
  if (!workshop) return new NextResponse(null, { status: 204 });
  const id = createHash("sha256")
    .update(
      `${data.workshopId}:${data.eventName}:${data.source}:${visitor}:${new Date().toISOString().slice(0, 10)}`,
    )
    .digest("hex");
  await db.workshopEvent.upsert({
    where: { id },
    update: {},
    create: { id, ...data, country: vercelCountryCode(request.headers) },
  });
  return new NextResponse(null, { status: 204 });
}
