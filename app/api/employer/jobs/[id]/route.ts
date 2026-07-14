import { after, NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import {
  AuthenticationError,
  normalizeEmail,
  requireEmployerMutation,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyGoogleAboutJob } from "@/lib/google-indexing";
import { postingSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const [{ id }, session, parsed] = await Promise.all([
      params,
      requireEmployerMutation(),
      request
        .json()
        .then((body) => postingSchema.safeParse(body))
        .catch(() => postingSchema.safeParse(null)),
    ]);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Some listing fields need attention.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const ownedJob = await db.job.findFirst({
      where: { id, employerId: session.employer.id },
      select: { id: true, slug: true, active: true, expiresAt: true },
    });
    if (!ownedJob) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    const data = parsed.data;
    if (normalizeEmail(data.managementEmail) !== session.employer.email) {
      return NextResponse.json(
        { error: "The management email must match the signed-in employer. Contact support to transfer ownership." },
        { status: 400 }
      );
    }
    const location = data.remote
      ? `${data.city}, ${data.state} (Remote)`
      : `${data.city}, ${data.state}`;
    const update = await db.job.updateMany({
      where: { id: ownedJob.id, employerId: session.employer.id },
      data: {
        title: data.title,
        company: data.company,
        description: data.description,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode || null,
        remote: data.remote,
        location,
        salaryMin: data.salaryMin ?? null,
        salaryMax: data.salaryMax ?? null,
        salaryType: data.salaryType,
        jobType: data.jobType,
        farmType: data.farmType,
        categories: data.categories,
        tags: data.tags,
        benefits: data.benefits,
        managementEmail: session.employer.email,
        companyEmail: session.employer.email,
        companyWebsite: data.companyWebsite || null,
        companyLogo: data.companyLogo || null,
        applyUrl: data.applyUrl || null,
        applyEmail: data.applyEmail || null,
      },
    });
    if (update.count !== 1) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    revalidateTag("public-jobs");
    if (ownedJob.active && ownedJob.expiresAt > new Date()) {
      after(() => notifyGoogleAboutJob(ownedJob.slug, "URL_UPDATED"));
    }

    return NextResponse.json({
      job: { id: ownedJob.id, slug: ownedJob.slug },
      message: "Listing saved.",
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Unable to update employer job:", error);
    return NextResponse.json(
      { error: "Unable to save this listing right now." },
      { status: 500 }
    );
  }
}
