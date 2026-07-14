import { after, NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import {
  AuthenticationError,
  requireEmployerMutation,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyGoogleAboutJob } from "@/lib/google-indexing";

const statusSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("deactivate") }),
  z.object({
    action: z.literal("close"),
    closeReason: z.enum(["filled", "no_longer_hiring"]).default("filled"),
    hireSource: z
      .enum(["playindirtjobs", "elsewhere", "not_sure"])
      .optional(),
  }),
]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const [{ id }, session, parsed] = await Promise.all([
      params,
      requireEmployerMutation(),
      request
        .json()
        .then((body) => statusSchema.safeParse(body))
        .catch(() => statusSchema.safeParse(null)),
    ]);
    if (!parsed.success) {
      return NextResponse.json({ error: "Choose a valid listing action." }, { status: 400 });
    }

    const job = await db.job.findFirst({
      where: { id, employerId: session.employer.id },
      select: { id: true, slug: true },
    });
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    const now = new Date();
    const updated = await db.job.updateMany({
      where: { id: job.id, employerId: session.employer.id },
      data:
        parsed.data.action === "close"
          ? {
              active: false,
              closedAt: now,
              closeReason: parsed.data.closeReason,
              hireSource: parsed.data.hireSource || null,
            }
          : { active: false },
    });
    if (updated.count !== 1) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    await db.funnelEvent.create({
      data: {
        eventName: parsed.data.action === "close" ? "listing_closed" : "listing_deactivated",
        jobId: job.id,
        employerId: session.employer.id,
        source: "employer_workspace",
        properties:
          parsed.data.action === "close"
            ? {
                closeReason: parsed.data.closeReason,
                hireSource: parsed.data.hireSource ?? "not_sure",
              }
            : {},
      },
    }).catch((error) => console.warn("Unable to record listing outcome event:", error));

    revalidateTag("public-jobs");
    after(() => notifyGoogleAboutJob(job.slug, "URL_DELETED"));

    return NextResponse.json({
      job: {
        id: job.id,
        active: false,
        closedAt: parsed.data.action === "close" ? now.toISOString() : null,
      },
      message:
        parsed.data.action === "close"
          ? "The listing was closed. Thank you for sharing the hiring outcome."
          : "The listing was deactivated.",
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Unable to change employer job status:", error);
    return NextResponse.json(
      { error: "Unable to update this listing right now." },
      { status: 500 }
    );
  }
}
