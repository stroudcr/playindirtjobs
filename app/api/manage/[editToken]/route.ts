import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobUpdateSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editToken: string }> }
) {
  try {
    const { editToken } = await params;

    // Find job by editToken
    const job = await db.job.findUnique({
      where: { editToken },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Return job data (excluding sensitive fields)
    return NextResponse.json({
      job: {
        id: job.id,
        slug: job.slug,
        title: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryType: job.salaryType,
        jobType: job.jobType,
        farmType: job.farmType,
        categories: job.categories,
        tags: job.tags,
        benefits: job.benefits,
        companyEmail: job.companyEmail,
        companyLogo: job.companyLogo,
        companyWebsite: job.companyWebsite,
        applyUrl: job.applyUrl,
        applyEmail: job.applyEmail,
        featured: job.featured,
        active: job.active,
        views: job.views,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        expiresAt: job.expiresAt,
      }
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ editToken: string }> }
) {
  try {
    const { editToken } = await params;
    const updates = await request.json();

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

    // Don't allow editing expired jobs
    if (new Date() > existingJob.expiresAt && !updates.reactivate) {
      return NextResponse.json(
        { error: "Cannot edit expired job" },
        { status: 400 }
      );
    }

    // Validate the update data
    const validation = jobUpdateSchema.safeParse(updates);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Update only allowed fields (prevent changing payment status, editToken, etc.)
    const job = await db.job.update({
      where: { editToken },
      data: {
        title: updates.title,
        company: updates.company,
        description: updates.description,
        location: updates.location,
        salaryMin: updates.salaryMin || null,
        salaryMax: updates.salaryMax || null,
        salaryType: updates.salaryType || "annual",
        jobType: updates.jobType,
        farmType: updates.farmType,
        categories: updates.categories,
        tags: updates.tags || [],
        benefits: updates.benefits || [],
        companyEmail: updates.companyEmail,
        companyWebsite: updates.companyWebsite || null,
        companyLogo: updates.companyLogo || null,
        applyUrl: updates.applyUrl || null,
        applyEmail: updates.applyEmail || null,
      },
    });

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        slug: job.slug,
        title: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryType: job.salaryType,
        jobType: job.jobType,
        farmType: job.farmType,
        categories: job.categories,
        tags: job.tags,
        benefits: job.benefits,
        companyEmail: job.companyEmail,
        companyLogo: job.companyLogo,
        companyWebsite: job.companyWebsite,
        applyUrl: job.applyUrl,
        applyEmail: job.applyEmail,
        featured: job.featured,
        active: job.active,
        views: job.views,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        expiresAt: job.expiresAt,
      }
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}
