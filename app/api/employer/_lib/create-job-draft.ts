import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import {
  createDraftAccess,
  setDraftAccessCookie,
} from "@/lib/draft-access";
import { db } from "@/lib/db";

type DraftKind = "duplicate" | "renew";

function jsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function createJobBasedDraft({
  jobId,
  employerId,
  employerEmail,
  kind,
}: {
  jobId: string;
  employerId: string;
  employerEmail: string;
  kind: DraftKind;
}) {
  const job = await db.job.findFirst({
    where: { id: jobId, employerId },
    select: {
      id: true,
      title: true,
      company: true,
      city: true,
      state: true,
      postalCode: true,
      remote: true,
      description: true,
      salaryMin: true,
      salaryMax: true,
      salaryType: true,
      jobType: true,
      farmType: true,
      categories: true,
      tags: true,
      benefits: true,
      managementEmail: true,
      companyWebsite: true,
      companyLogo: true,
      applyUrl: true,
      applyEmail: true,
      featured: true,
    },
  });

  if (!job) return null;

  const { token, tokenHash } = createDraftAccess();
  const action = kind === "renew" ? "renewal" : "duplicate";
  const draft = await db.$transaction(async (tx) => {
    const created = await tx.jobDraft.create({
      data: {
        employerId,
        sourceJobId: kind === "renew" ? job.id : null,
        accessTokenHash: tokenHash,
        email: employerEmail,
        status: "DRAFT",
        data: jsonValue({
          title: job.title,
          company: job.company,
          city: job.city,
          state: job.state,
          postalCode: job.postalCode || "",
          remote: job.remote,
          description: job.description,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          salaryType: job.salaryType || "annual",
          jobType: job.jobType,
          farmType: job.farmType,
          categories: job.categories,
          tags: job.tags,
          benefits: job.benefits,
          managementEmail: employerEmail,
          companyWebsite: job.companyWebsite || "",
          companyLogo: job.companyLogo || "",
          applyUrl: job.applyUrl || "",
          applyEmail: job.applyEmail || "",
        }),
        plan: job.featured ? "featured" : "basic",
        currentStep: kind === "renew" ? 4 : 1,
        attribution: jsonValue({
          source: "employer_workspace",
          action,
        }),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1_000),
      },
      select: { id: true },
    });

    await tx.funnelEvent.create({
      data: {
        eventName: kind === "renew" ? "renewal_started" : "posting_started",
        employerId,
        draftId: created.id,
        jobId: kind === "renew" ? job.id : undefined,
        source: "employer_workspace",
        landingPath: "/employer",
        properties: { action },
      },
    });

    return created;
  });

  const url = `/post-job?draft=${encodeURIComponent(draft.id)}`;
  const response = NextResponse.json({ draftId: draft.id, url }, { status: 201 });
  setDraftAccessCookie(response, draft.id, token);
  return response;
}
