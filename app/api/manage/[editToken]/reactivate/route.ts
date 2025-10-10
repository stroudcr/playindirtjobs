import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { editToken: string } }
) {
  try {
    const { editToken } = params;

    // Find job by editToken first
    const existingJob = await db.job.findUnique({
      where: { editToken },
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if already active
    if (existingJob.active) {
      return NextResponse.json(
        { error: "Job is already active" },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > existingJob.expiresAt) {
      return NextResponse.json(
        { error: "Cannot reactivate expired job. Please contact support to renew." },
        { status: 400 }
      );
    }

    // Reactivate the job
    const job = await db.job.update({
      where: { editToken },
      data: {
        active: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job reactivated successfully",
      job: {
        id: job.id,
        active: job.active,
      }
    });
  } catch (error) {
    console.error("Error reactivating job:", error);
    return NextResponse.json(
      { error: "Failed to reactivate job" },
      { status: 500 }
    );
  }
}
