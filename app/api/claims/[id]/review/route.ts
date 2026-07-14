import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  AuthenticationError,
  requireAdminMutation,
} from "@/lib/auth";
import { db } from "@/lib/db";

const reviewSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  notes: z.string().trim().max(2_000).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const [{ id }, session, parsed] = await Promise.all([
      params,
      requireAdminMutation(),
      request
        .json()
        .then((body) => reviewSchema.safeParse(body))
        .catch(() => reviewSchema.safeParse(null)),
    ]);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Choose approve or reject and keep notes under 2,000 characters." },
        { status: 400 }
      );
    }

    const result = await db.$transaction(async (tx) => {
      const claim = await tx.listingClaim.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          jobId: true,
          employerId: true,
          workEmail: true,
        },
      });
      if (!claim) return { kind: "not_found" as const };
      if (claim.status !== "PENDING" && claim.status !== "DISPUTED") {
        return { kind: "already_reviewed" as const, status: claim.status };
      }

      if (parsed.data.decision === "approve") {
        const job = await tx.job.findUnique({
          where: { id: claim.jobId },
          select: { employerId: true, origin: true },
        });
        if (!job || job.origin !== "IMPORTED") {
          return { kind: "invalid_job" as const };
        }
        if (job.employerId && job.employerId !== claim.employerId) {
          return { kind: "owned" as const };
        }

        if (!job.employerId) {
          const ownership = await tx.job.updateMany({
            where: {
              id: claim.jobId,
              origin: "IMPORTED",
              employerId: null,
            },
            data: {
              employerId: claim.employerId,
              managementEmail: claim.workEmail,
              companyEmail: claim.workEmail,
            },
          });
          if (ownership.count !== 1) return { kind: "owned" as const };
        }
      }

      const reviewed = await tx.listingClaim.update({
        where: { id: claim.id },
        data: {
          status: parsed.data.decision === "approve" ? "APPROVED" : "REJECTED",
          reviewedById: session.employer.id,
          reviewedAt: new Date(),
          notes: parsed.data.notes || null,
        },
        select: { id: true, status: true },
      });

      return { kind: "reviewed" as const, claim: reviewed };
    });

    if (result.kind === "not_found") {
      return NextResponse.json({ error: "Claim not found." }, { status: 404 });
    }
    if (result.kind === "already_reviewed") {
      return NextResponse.json(
        { error: `This claim is already ${result.status.toLowerCase()}.` },
        { status: 409 }
      );
    }
    if (result.kind === "invalid_job") {
      return NextResponse.json(
        { error: "The source listing is no longer eligible to be claimed." },
        { status: 409 }
      );
    }
    if (result.kind === "owned") {
      return NextResponse.json(
        { error: "Another employer already manages this listing." },
        { status: 409 }
      );
    }

    return NextResponse.json({ claim: result.claim });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Unable to review listing claim:", error);
    return NextResponse.json(
      { error: "Unable to review this claim right now." },
      { status: 500 }
    );
  }
}
