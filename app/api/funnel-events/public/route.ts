import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import {
  employerEventDedupeDimensions,
  isLikelyAutomatedEmployerEvent,
  vercelCountryCode,
} from "@/lib/public-event-quality";

const ANONYMOUS_ID_COOKIE = "pidj_anon_id";
const eventSchema = z.object({
  eventName: z.enum(["employer_landing_view", "employer_cta_click"]),
  path: z.string().startsWith("/").max(1_000),
  referrerHost: z.string().trim().toLowerCase().max(253).regex(/^[a-z0-9.-]+$/).optional(),
  properties: z.record(z.union([z.string().max(1_000), z.number(), z.boolean(), z.null()])).optional(),
});

export async function POST(request: NextRequest) {
  if (isLikelyAutomatedEmployerEvent(request.headers)) {
    return new NextResponse(null, { status: 204 });
  }
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid event." }, { status: 400 });

  const existingId = request.cookies.get(ANONYMOUS_ID_COOKIE)?.value;
  const anonymousId = existingId && /^[0-9a-f-]{36}$/i.test(existingId) ? existingId : randomUUID();
  const { source, placement } = employerEventDedupeDimensions(
    parsed.data.properties
  );
  const dedupeSince = new Date(Date.now() - (parsed.data.eventName === "employer_landing_view" ? 30 * 60_000 : 10_000));
  const duplicate = await db.funnelEvent.findFirst({
    where: {
      eventName: parsed.data.eventName,
      anonymousId,
      landingPath: parsed.data.path,
      source: source ?? null,
      ...(placement
        ? { properties: { path: ["placement"], equals: placement } }
        : {}),
      createdAt: { gte: dedupeSince },
    },
    select: { id: true },
  });
  if (!duplicate) {
    const properties = {
      ...(parsed.data.properties ?? {}),
      country: vercelCountryCode(request.headers),
    };
    await db.funnelEvent.create({
      data: {
        eventName: parsed.data.eventName,
        anonymousId,
        source,
        landingPath: parsed.data.path,
        referrerHost: parsed.data.referrerHost,
        properties: properties as Prisma.InputJsonValue,
      },
    });
  }
  const response = new NextResponse(null, { status: 204 });
  if (!existingId) {
    response.cookies.set(ANONYMOUS_ID_COOKIE, anonymousId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 180,
      path: "/",
    });
  }
  return response;
}
