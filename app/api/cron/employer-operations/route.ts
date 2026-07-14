import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { processPendingEmailOutbox } from "@/lib/email-outbox";

export const dynamic = "force-dynamic";

function jsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function appUrl(path: string) {
  return new URL(path, process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").toString();
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const inDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1_000);
  const [fourteenDayJobs, threeDayJobs, missingApplicationJobs, recoveryDrafts] = await Promise.all([
    db.job.findMany({
      where: { active: true, expiresAt: { gte: inDays(13), lt: inDays(15) }, managementEmail: { not: null } },
      select: { id: true, title: true, managementEmail: true, editToken: true, expiresAt: true },
    }),
    db.job.findMany({
      where: { active: true, expiresAt: { gte: inDays(2), lt: inDays(4) }, managementEmail: { not: null } },
      select: { id: true, title: true, managementEmail: true, editToken: true, expiresAt: true },
    }),
    db.job.findMany({
      where: {
        active: true,
        applyUrl: null,
        applyEmail: null,
        managementEmail: { not: null },
        expiresAt: { gt: now },
      },
      select: { id: true, title: true, managementEmail: true, editToken: true },
      take: 100,
    }),
    db.jobDraft.findMany({
      where: {
        status: { in: ["DRAFT", "CHECKOUT"] },
        recoveryOptIn: true,
        email: { not: null },
        updatedAt: { lte: new Date(now.getTime() - 24 * 60 * 60 * 1_000), gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1_000) },
        expiresAt: { gt: now },
      },
      select: { id: true, email: true },
      take: 100,
    }),
  ]);

  const reminderJobs = [
    ...fourteenDayJobs.map((job) => ({ ...job, days: 14 })),
    ...threeDayJobs.map((job) => ({ ...job, days: 3 })),
  ];
  for (const job of reminderJobs) {
    if (!job.managementEmail) continue;
    await db.emailOutbox.upsert({
      where: { deduplicationKey: `${job.id}:expiry:${job.days}` },
      update: {},
      create: {
        template: "EXPIRY_REMINDER",
        recipient: job.managementEmail,
        deduplicationKey: `${job.id}:expiry:${job.days}`,
        payload: jsonValue({
          subject: `Your job posting expires in ${job.days} days`,
          heading: "Keep your listing active",
          message: `“${job.title}” is scheduled to expire on ${job.expiresAt.toLocaleDateString("en-US")}. Renewing is always manual—there is no automatic charge.`,
          actionLabel: "Review or renew listing",
          actionUrl: appUrl(`/manage/${job.editToken}`),
        }),
      },
    });
  }

  for (const job of missingApplicationJobs) {
    if (!job.managementEmail) continue;
    await db.emailOutbox.upsert({
      where: { deduplicationKey: `${job.id}:application-contact-required` },
      update: {},
      create: {
        template: "APPLICATION_CONTACT_REQUIRED",
        recipient: job.managementEmail,
        deduplicationKey: `${job.id}:application-contact-required`,
        payload: jsonValue({
          subject: "Choose how candidates should apply",
          heading: "Your management email is now private",
          message: `We stopped displaying the private management address on “${job.title}.” Add a separate public application email or application URL so candidates can apply.`,
          actionLabel: "Update application details",
          actionUrl: appUrl(`/manage/${job.editToken}`),
        }),
      },
    });
  }

  for (const draft of recoveryDrafts) {
    if (!draft.email) continue;
    await db.emailOutbox.upsert({
      where: { deduplicationKey: `${draft.id}:draft-recovery` },
      update: {},
      create: {
        template: "DRAFT_RECOVERY",
        recipient: draft.email,
        deduplicationKey: `${draft.id}:draft-recovery`,
        payload: jsonValue({
          subject: "Finish your PlayInDirtJobs posting",
          heading: "Your draft is saved",
          message: "You asked for one reminder if you left your job posting unfinished. Open it in the browser where you started; we will not send a follow-up sequence.",
          actionLabel: "Resume saved draft",
          actionUrl: appUrl(`/post-job?draft=${encodeURIComponent(draft.id)}`),
        }),
      },
    });
  }

  const delivery = await processPendingEmailOutbox(50);
  return NextResponse.json({
    queued: {
      expiryReminders: reminderJobs.length,
      applicationContactRequests: missingApplicationJobs.length,
      draftRecovery: recoveryDrafts.length,
    },
    delivery,
  });
}
