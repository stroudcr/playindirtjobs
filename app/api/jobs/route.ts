import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
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

    // Build where clause with AND to keep filter groups independent
    const andConditions: Prisma.JobWhereInput[] = [];

    // Search filter
    if (search) {
      andConditions.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    // State filter (supports both 2-letter codes and full names)
    if (state) {
      const stateCode = getStateCode(state);
      const stateName = getStateName(state);

      andConditions.push({
        OR: [
          { state: { equals: stateCode, mode: "insensitive" } },
          { state: { equals: stateName, mode: "insensitive" } },
        ],
      });
    }

    const where: Prisma.JobWhereInput = {
      active: true,
      expiresAt: {
        gt: new Date(),
      },
      ...(andConditions.length > 0 && { AND: andConditions }),
    };

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

    // Sort order
    let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: "desc" };
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
