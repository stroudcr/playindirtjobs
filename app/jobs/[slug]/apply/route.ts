import { randomUUID } from "crypto";
import { after, NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPublicApplicationDestination } from "@/lib/public-application";

const ANONYMOUS_ID_COOKIE = "pidj_anon_id";
const DEDUPE_WINDOW_MS = 5 * 60 * 1000;
const BOT_USER_AGENT =
  /bot|crawler|spider|crawling|headless|preview|facebookexternalhit|slurp|bingpreview|googleother|monitor/i;
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isLikelyBotOrPrefetch(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const purpose = [
    request.headers.get("purpose"),
    request.headers.get("sec-purpose"),
    request.headers.get("x-moz"),
  ]
    .filter(Boolean)
    .join(" ");

  return BOT_USER_AGENT.test(userAgent) || /prefetch/i.test(purpose);
}

function getReferrerHost(request: NextRequest) {
  const referrer = request.headers.get("referer");
  if (!referrer) return null;

  try {
    return new URL(referrer).hostname.toLowerCase();
  } catch {
    return null;
  }
}

async function recordApplicationClick({
  jobId,
  jobSlug,
  anonymousId,
  referrerHost,
  destinationType,
}: {
  jobId: string;
  jobSlug: string;
  anonymousId: string;
  referrerHost: string | null;
  destinationType: "url" | "email";
}) {
  try {
    const duplicate = await db.funnelEvent.findFirst({
      where: {
        eventName: "apply_clicked",
        jobId,
        anonymousId,
        createdAt: { gte: new Date(Date.now() - DEDUPE_WINDOW_MS) },
      },
      select: { id: true },
    });

    if (duplicate) return;

    await db.funnelEvent.create({
      data: {
        eventName: "apply_clicked",
        jobId,
        anonymousId,
        source: "job_detail",
        landingPath: `/jobs/${jobSlug}`,
        referrerHost,
        properties: { destinationType },
      },
    });
  } catch (error) {
    console.warn("Failed to record application click:", error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const job = await db.job.findFirst({
    where: {
      slug,
      active: true,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      slug: true,
      applyUrl: true,
      applyEmail: true,
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const destination = getPublicApplicationDestination(job);
  if (!destination) {
    const unavailableResponse = NextResponse.redirect(
      new URL(`/jobs/${job.slug}?application=unavailable`, request.url),
      303
    );
    unavailableResponse.headers.set("Cache-Control", "no-store");
    unavailableResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
    return unavailableResponse;
  }

  const anonymousIdCookie = request.cookies.get(ANONYMOUS_ID_COOKIE)?.value;
  const existingAnonymousId =
    anonymousIdCookie && UUID.test(anonymousIdCookie)
      ? anonymousIdCookie
      : undefined;
  const anonymousId = existingAnonymousId || randomUUID();

  if (!isLikelyBotOrPrefetch(request)) {
    const referrerHost = getReferrerHost(request);
    after(() =>
      recordApplicationClick({
        jobId: job.id,
        jobSlug: job.slug,
        anonymousId,
        referrerHost,
        destinationType: destination.type,
      })
    );
  }

  const response = NextResponse.redirect(destination.url, 307);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "origin");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  if (!existingAnonymousId) {
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
