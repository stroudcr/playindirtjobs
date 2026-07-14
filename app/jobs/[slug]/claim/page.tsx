import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Building2, MapPin } from "lucide-react";

import { ClaimListingForm } from "@/app/employer/_components/ClaimListingForm";
import { EmployerLoginForm } from "@/app/employer/_components/EmployerLoginForm";
import { getCurrentEmployerSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Claim an employer listing | PlayInDirtJobs",
  description: "Verify ownership of an imported PlayInDirtJobs listing.",
  robots: { index: false, follow: false },
};

export default async function ClaimListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [job, session] = await Promise.all([
    db.job.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        company: true,
        location: true,
        origin: true,
        employerId: true,
      },
    }),
    getCurrentEmployerSession(),
  ]);

  if (!job || job.origin !== "IMPORTED") notFound();
  if (job.employerId === session?.employer.id) {
    redirect("/employer?notice=listing-claimed");
  }

  const existingClaim = session
    ? await db.listingClaim.findFirst({
        where: { jobId: job.id, employerId: session.employer.id },
        orderBy: { createdAt: "desc" },
        select: { status: true, notes: true, updatedAt: true },
      })
    : null;
  const returnTo = `/jobs/${encodeURIComponent(job.slug)}/claim`;

  return (
    <main className="min-h-[75vh] bg-earth-cream px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href={`/jobs/${job.slug}`} className="text-sm font-semibold text-primary hover:text-primary-dark">
          ← Back to listing
        </Link>

        <section className="card mt-5 overflow-hidden">
          <div className="border-b border-border bg-earth-sand p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Employer ownership</p>
            <h1 className="mt-3 font-display text-3xl text-forest sm:text-4xl">Claim this imported listing</h1>
            <p className="mt-3 leading-relaxed text-forest-light">
              Verify that you represent the employer to edit, close, duplicate, or renew this job.
            </p>
          </div>

          <div className="border-b border-border p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-forest">{job.title}</h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-forest-light">
              <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4" aria-hidden="true" />{job.company}</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />{job.location}</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {job.employerId ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                This listing is already managed by a verified employer. Contact support if you believe ownership is incorrect.
              </div>
            ) : existingClaim ? (
              <div className="rounded-lg border border-border bg-earth-sand p-5">
                <h2 className="font-semibold text-forest">Claim {existingClaim.status.toLowerCase()}</h2>
                <p className="mt-2 text-sm leading-relaxed text-forest-light">
                  {existingClaim.status === "PENDING"
                    ? "An administrator is reviewing your work email and the listing’s employer details."
                    : existingClaim.notes || "This claim has already been reviewed."}
                </p>
                <Link href="/employer" className="mt-4 inline-flex text-sm font-semibold text-primary hover:text-primary-dark">
                  Open employer workspace
                </Link>
              </div>
            ) : session ? (
              <ClaimListingForm jobId={job.id} workEmail={session.employer.email} />
            ) : (
              <div>
                <h2 className="mb-5 text-xl font-semibold text-forest">Verify your work email to continue</h2>
                <EmployerLoginForm returnTo={returnTo} />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
