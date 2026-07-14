import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  EditableEmployerJob,
  EmployerJobEditForm,
} from "@/app/employer/_components/EmployerJobEditForm";
import { getCurrentEmployerSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Edit job listing | PlayInDirtJobs",
  robots: { index: false, follow: false },
};

export default async function EmployerJobEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentEmployerSession();
  if (!session) {
    redirect(`/employer/login?returnTo=${encodeURIComponent(`/employer/jobs/${id}/edit`)}`);
  }

  const job = await db.job.findFirst({
    where: { id, employerId: session.employer.id },
    select: {
      id: true,
      slug: true,
      title: true,
      company: true,
      city: true,
      state: true,
      postalCode: true,
      remote: true,
      description: true,
      salaryMin: true,
      salaryMax: true,
      salaryType: true,
      jobType: true,
      farmType: true,
      categories: true,
      tags: true,
      benefits: true,
      managementEmail: true,
      companyWebsite: true,
      companyLogo: true,
      applyUrl: true,
      applyEmail: true,
    },
  });
  if (!job) notFound();

  return (
    <main className="min-h-[75vh] bg-earth-cream px-4 py-10 sm:py-14">
      <div className="container mx-auto max-w-5xl">
        <Link href="/employer" className="text-sm font-semibold text-primary hover:text-primary-dark">← Employer workspace</Link>
        <div className="mb-8 mt-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Employer workspace</p>
          <h1 className="mt-2 font-display text-4xl text-forest">Edit listing</h1>
          <p className="mt-3 text-forest-light">Changes to active listings appear publicly after you save.</p>
        </div>
        <EmployerJobEditForm job={job satisfies EditableEmployerJob} />
      </div>
    </main>
  );
}
