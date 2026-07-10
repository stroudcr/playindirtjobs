import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyGoogleAboutJobs } from "@/lib/google-indexing";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const recentlyUpdatedSince = new Date(now.getTime() - 36 * 60 * 60 * 1000);

  const [expiredJobs, recentlyUpdatedJobs] = await Promise.all([
    db.job.findMany({
      where: {
        active: true,
        expiresAt: { lt: now },
      },
      select: {
        id: true,
        slug: true,
      },
    }),
    db.job.findMany({
      where: {
        active: true,
        expiresAt: { gte: now },
        updatedAt: { gte: recentlyUpdatedSince },
      },
      select: { slug: true },
    }),
  ]);

  if (expiredJobs.length > 0) {
    await db.job.updateMany({
      where: { id: { in: expiredJobs.map((job) => job.id) } },
      data: { active: false },
    });
  }

  const [deletionNotifications, updateNotifications] = await Promise.all([
    notifyGoogleAboutJobs(
      expiredJobs.map((job) => job.slug),
      "URL_DELETED"
    ),
    notifyGoogleAboutJobs(
      recentlyUpdatedJobs.map((job) => job.slug),
      "URL_UPDATED"
    ),
  ]);

  return NextResponse.json({
    expired: expiredJobs.length,
    recentlyUpdated: recentlyUpdatedJobs.length,
    deletionNotificationsSent: deletionNotifications.filter((result) => result.sent).length,
    updateNotificationsSent: updateNotifications.filter((result) => result.sent).length,
  });
}
