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

    // Check if already inactive
    if (!existingJob.active) {
      return NextResponse.json(
        { error: "Job is already inactive" },
        { status: 400 }
      );
    }

    // Deactivate the job
    const job = await db.job.update({
      where: { editToken },
      data: {
        active: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job deactivated successfully",
      job: {
        id: job.id,
        active: job.active,
      }
    });
  } catch (error) {
    console.error("Error deactivating job:", error);
    return NextResponse.json(
      { error: "Failed to deactivate job" },
      { status: 500 }
    );
  }
}
