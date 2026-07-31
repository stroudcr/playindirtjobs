import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { buildPublicJobWhere, normalizeSearchQuery } from "@/lib/job-search";
import { findPublicJobs } from "@/lib/public-jobs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse filters
    const search = normalizeSearchQuery(searchParams.get("search"));
    const state = searchParams.get("state") || "";
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const jobTypes = searchParams.get("jobTypes")?.split(",").filter(Boolean) || [];
    const farmTypes = searchParams.get("farmTypes")?.split(",").filter(Boolean) || [];
    const benefits = searchParams.get("benefits")?.split(",").filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "latest";

    const where = buildPublicJobWhere({
      search,
      state,
      categories,
      jobTypes,
      farmTypes,
      benefits,
      sortBy,
    });

    // Sort order
    let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "highest-paid") {
      orderBy = { salaryMax: "desc" };
    } else if (sortBy === "most-viewed") {
      orderBy = { views: "desc" };
    }

    // Fetch jobs
    const jobs = await findPublicJobs("api-jobs", {
      where,
      orderBy: [
        { featured: "desc" }, // Featured jobs first
        orderBy,
      ],
      select: {
        id: true,
        slug: true,
        title: true,
        company: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        categories: true,
        jobType: true,
        featured: true,
        createdAt: true,
      },
      take: 50, // Limit results
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
