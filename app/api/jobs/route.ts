import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStateCode, getStateName } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse filters
    const search = searchParams.get("search") || "";
    const state = searchParams.get("state") || "";
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const jobTypes = searchParams.get("jobTypes")?.split(",").filter(Boolean) || [];
    const farmTypes = searchParams.get("farmTypes")?.split(",").filter(Boolean) || [];
    const benefits = searchParams.get("benefits")?.split(",").filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "latest";

    // Build where clause
    const where: any = {
      active: true,
      expiresAt: {
        gt: new Date(),
      },
    };

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Category filter
    if (categories.length > 0) {
      where.categories = {
        hasSome: categories,
      };
    }

    // Job type filter
    if (jobTypes.length > 0) {
      where.jobType = {
        hasSome: jobTypes,
      };
    }

    // Farm type filter
    if (farmTypes.length > 0) {
      where.farmType = {
        hasSome: farmTypes,
      };
    }

    // Benefits filter
    if (benefits.length > 0) {
      where.benefits = {
        hasSome: benefits,
      };
    }

    // State filter (supports both 2-letter codes and full names)
    if (state) {
      const stateCode = getStateCode(state);
      const stateName = getStateName(state);

      // Match either the code or the full name to handle mixed data formats
      where.OR = where.OR || [];
      where.OR.push(
        { state: { equals: stateCode, mode: "insensitive" } },
        { state: { equals: stateName, mode: "insensitive" } }
      );
    }

    // Sort order
    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "highest-paid") {
      orderBy = { salaryMax: "desc" };
    } else if (sortBy === "most-viewed") {
      orderBy = { views: "desc" };
    }

    // Fetch jobs
    const jobs = await db.job.findMany({
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
