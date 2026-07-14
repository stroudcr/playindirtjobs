import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { verifyClaimDomain } from "@/app/api/claims/domain-verification";
import {
  AuthenticationError,
  requireEmployerMutation,
} from "@/lib/auth";
import { db } from "@/lib/db";

const claimSchema = z.object({
  jobId: z.string().cuid(),
});

function jsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function POST(request: NextRequest) {
  try {
    const [session, parsed] = await Promise.all([
      requireEmployerMutation(),
      request
        .json()
        .then((body) => claimSchema.safeParse(body))
        .catch(() => claimSchema.safeParse(null)),
    ]);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Choose a valid listing to claim." },
        { status: 400 }
      );
    }
    if (!session.employer.emailVerifiedAt) {
      return NextResponse.json(
        { error: "Verify your work email before claiming a listing." },
        { status: 403 }
      );
    }

    const result = await db.$transaction(async (tx) => {
      const job = await tx.job.findUnique({
        where: { id: parsed.data.jobId },
        select: {
          id: true,
          origin: true,
          employerId: true,
          companyWebsite: true,
          applyUrl: true,
        },
      });

      if (!job) return { kind: "not_found" as const };
      if (job.origin !== "IMPORTED") return { kind: "not_imported" as const };

      const existing = await tx.listingClaim.findFirst({
        where: {
          jobId: job.id,
          employerId: session.employer.id,
        },
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true },
      });
      if (existing) {
        return { kind: "existing" as const, claim: existing };
      }
      if (job.employerId) return { kind: "claimed" as const };

      const verification = verifyClaimDomain({
        workEmail: session.employer.email,
        companyWebsite: job.companyWebsite,
        applyUrl: job.applyUrl,
      });
      const claim = await tx.listingClaim.create({
        data: {
          jobId: job.id,
          employerId: session.employer.id,
          workEmail: session.employer.email,
          status: "PENDING",
          evidence: jsonValue({
            ...verification.evidence,
            verification: "registrable_domain_v1",
          }),
        },
        select: { id: true, status: true },
      });

      if (!verification.autoApprove) {
        return { kind: "created" as const, claim };
      }

      const ownership = await tx.job.updateMany({
        where: {
          id: job.id,
          origin: "IMPORTED",
          employerId: null,
        },
        data: {
          employerId: session.employer.id,
          managementEmail: session.employer.email,
          companyEmail: session.employer.email,
        },
      });
      if (ownership.count !== 1) {
        await tx.listingClaim.update({
          where: { id: claim.id },
          data: {
            status: "DISPUTED",
            notes: "Ownership changed while this claim was being verified.",
          },
        });
        return { kind: "claimed" as const };
      }

      const approved = await tx.listingClaim.update({
        where: { id: claim.id },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
          notes: "Automatically approved by an exact registrable-domain match.",
        },
        select: { id: true, status: true },
      });

      return { kind: "created" as const, claim: approved };
    });

    if (result.kind === "not_found") {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }
    if (result.kind === "not_imported") {
      return NextResponse.json(
        { error: "Only imported listings can be claimed." },
        { status: 400 }
      );
    }
    if (result.kind === "claimed") {
      return NextResponse.json(
        { error: "This listing is already managed by another employer." },
        { status: 409 }
      );
    }

    const claim = result.claim;
    return NextResponse.json(
      {
        claim,
        message:
          claim.status === "APPROVED"
            ? "Your work email matched the employer domain. The listing is now in your workspace."
            : claim.status === "PENDING"
              ? "Your claim was submitted for review."
              : `This claim is ${claim.status.toLowerCase()}.`,
      },
      { status: result.kind === "created" ? 201 : 200 }
    );
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Unable to submit listing claim:", error);
    return NextResponse.json(
      { error: "Unable to submit this claim right now." },
      { status: 500 }
    );
  }
}
