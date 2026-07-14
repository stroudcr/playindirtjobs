import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

const ANONYMOUS_ID_COOKIE = "pidj_anon_id";
const BOT = /bot|crawler|spider|headless|preview|slurp|monitor/i;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (BOT.test(request.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });
  const { id: slug } = await params;
  const job = await db.job.findFirst({
    where: { slug, active: true, expiresAt: { gt: new Date() } },
    select: { id: true },
  });
  if (!job) return NextResponse.json({ error: "Job not found." }, { status: 404 });

  const cookieId = request.cookies.get(ANONYMOUS_ID_COOKIE)?.value;
  const anonymousId = cookieId && /^[0-9a-f-]{36}$/i.test(cookieId) ? cookieId : randomUUID();
  const duplicate = await db.funnelEvent.findFirst({
    where: {
      eventName: "job_viewed",
      jobId: job.id,
      anonymousId,
      createdAt: { gte: new Date(Date.now() - 30 * 60_000) },
    },
    select: { id: true },
  });
  if (!duplicate) {
    await db.$transaction([
      db.funnelEvent.create({ data: { eventName: "job_viewed", jobId: job.id, anonymousId, source: "job_detail", landingPath: `/jobs/${slug}` } }),
      db.job.update({ where: { id: job.id }, data: { views: { increment: 1 } } }),
    ]);
  }
  const response = new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  if (!cookieId) {
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
