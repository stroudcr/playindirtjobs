import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ExternalLink, ShieldCheck } from "lucide-react";

import { AdminClaimReview } from "@/app/employer/_components/AdminClaimReview";
import {
  AuthenticationError,
  requireAdminSession,
} from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Listing claim review | PlayInDirtJobs",
  robots: { index: false, follow: false },
};

async function requireClaimAdministrator() {
  try {
    return await requireAdminSession();
  } catch (error) {
    if (error instanceof AuthenticationError && error.status === 401) {
      redirect("/employer/login?returnTo=%2Fadmin%2Fclaims");
    }
    notFound();
  }
}

export default async function AdminClaimsPage() {
  const session = await requireClaimAdministrator();
  const claims = await db.listingClaim.findMany({
    where: { status: { in: ["PENDING", "DISPUTED"] } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      status: true,
      workEmail: true,
      evidence: true,
      createdAt: true,
      employer: { select: { email: true, name: true, company: true } },
      job: {
        select: {
          slug: true,
          title: true,
          company: true,
          location: true,
          companyWebsite: true,
          applyUrl: true,
          employerId: true,
        },
      },
    },
  });

  return (
    <main className="min-h-[75vh] bg-earth-cream px-4 py-10 sm:py-14">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Administration</p>
            <h1 className="mt-2 font-display text-4xl text-forest">Listing claim review</h1>
            <p className="mt-3 text-forest-light">Signed in as {session.employer.email}</p>
          </div>
          <Link href="/employer" className="btn btn-outline">Employer workspace</Link>
        </div>

        {claims.length === 0 ? (
          <div className="card mt-8 p-8 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-forest">No claims waiting</h2>
            <p className="mt-2 text-forest-light">The manual review queue is clear.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {claims.map((claim) => (
              <article key={claim.id} className="card p-6 sm:p-7">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">{claim.status}</span>
                      {claim.job.employerId ? (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">Already owned</span>
                      ) : null}
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-forest">{claim.job.title}</h2>
                    <p className="mt-1 text-sm text-forest-light">{claim.job.company} · {claim.job.location}</p>
                  </div>
                  <Link href={`/jobs/${claim.job.slug}`} target="_blank" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    View listing <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>

                <dl className="mt-5 grid gap-4 rounded-lg bg-earth-sand p-4 text-sm sm:grid-cols-2">
                  <div><dt className="font-semibold text-forest">Claimant</dt><dd className="mt-1 break-all text-forest-light">{claim.workEmail}</dd></div>
                  <div><dt className="font-semibold text-forest">Submitted</dt><dd className="mt-1 text-forest-light">{claim.createdAt.toLocaleString("en-US")}</dd></div>
                  <div><dt className="font-semibold text-forest">Company website</dt><dd className="mt-1 break-all text-forest-light">{claim.job.companyWebsite || "Not provided"}</dd></div>
                  <div><dt className="font-semibold text-forest">Application URL</dt><dd className="mt-1 break-all text-forest-light">{claim.job.applyUrl || "Not provided"}</dd></div>
                  <div className="sm:col-span-2"><dt className="font-semibold text-forest">Automated evidence</dt><dd className="mt-1 break-all font-mono text-xs text-forest-light">{JSON.stringify(claim.evidence)}</dd></div>
                </dl>

                <AdminClaimReview claimId={claim.id} />
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
