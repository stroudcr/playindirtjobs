import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await db.job.findFirst({
      where: {
        id,
        active: true,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        company: true,
        description: true,
        city: true,
        state: true,
        postalCode: true,
        remote: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        salaryType: true,
        jobType: true,
        farmType: true,
        categories: true,
        tags: true,
        benefits: true,
        companyLogo: true,
        companyWebsite: true,
        applyUrl: true,
        applyEmail: true,
        featured: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { job },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}
