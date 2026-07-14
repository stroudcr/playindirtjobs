import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CreditCard,
  Eye,
  FileText,
  MousePointerClick,
  Plus,
  ShieldCheck,
} from "lucide-react";

import { EmployerJobActions } from "@/app/employer/_components/EmployerJobActions";
import { EmployerLogoutButton } from "@/app/employer/_components/EmployerLogoutButton";
import { getCurrentEmployerSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Employer workspace | PlayInDirtJobs",
  description: "Manage your agricultural job listings and purchases.",
  robots: { index: false, follow: false },
};

function statusLabel(job: { active: boolean; closedAt: Date | null; expiresAt: Date }) {
  if (job.closedAt) return { label: "Closed", className: "bg-gray-100 text-gray-700" };
  if (job.expiresAt <= new Date()) return { label: "Expired", className: "bg-amber-100 text-amber-900" };
  if (job.active) return { label: "Active", className: "bg-emerald-100 text-emerald-900" };
  return { label: "Inactive", className: "bg-gray-100 text-gray-700" };
}

function currency(amount: number, code: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code.toUpperCase(),
  }).format(amount / 100);
}

export default async function EmployerWorkspacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getCurrentEmployerSession();
  if (!session) redirect("/employer/login?returnTo=%2Femployer");

  const [jobs, purchases, claims, params] = await Promise.all([
    db.job.findMany({
      where: { employerId: session.employer.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        company: true,
        location: true,
        active: true,
        featured: true,
        views: true,
        expiresAt: true,
        closedAt: true,
        createdAt: true,
        _count: {
          select: {
            funnelEvents: { where: { eventName: "apply_clicked" } },
          },
        },
      },
    }),
    db.purchase.findMany({
      where: { employerId: session.employer.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        kind: true,
        plan: true,
        amount: true,
        currency: true,
        status: true,
        paidAt: true,
        createdAt: true,
        job: { select: { title: true, slug: true } },
      },
    }),
    db.listingClaim.findMany({
      where: { employerId: session.employer.id, status: { not: "APPROVED" } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        job: { select: { slug: true, title: true, company: true } },
      },
    }),
    searchParams,
  ]);

  const totalViews = jobs.reduce((sum, job) => sum + job.views, 0);
  const totalClicks = jobs.reduce((sum, job) => sum + job._count.funnelEvents, 0);
  const activeCount = jobs.filter((job) => job.active && job.expiresAt > new Date()).length;
  const showClaimNotice = params.notice === "listing-claimed";

  return (
    <main className="min-h-[75vh] bg-earth-cream px-4 py-10 sm:py-14">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Employer workspace</p>
            <h1 className="mt-2 font-display text-4xl text-forest sm:text-5xl">Your job listings</h1>
            <p className="mt-3 text-forest-light">Signed in as {session.employer.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {session.employer.role === "ADMIN" ? <Link href="/admin/claims" className="btn btn-outline"><ShieldCheck className="h-4 w-4" />Claim queue</Link> : null}
            <EmployerLogoutButton />
            <Link href="/post-job?source=employer_workspace" className="btn btn-primary"><Plus className="h-4 w-4" />Post a job</Link>
          </div>
        </div>

        {showClaimNotice ? (
          <div className="mt-7 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            The listing is verified and now appears in your workspace.
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Listing overview">
          <div className="card p-5"><div className="flex items-center gap-2 text-sm font-semibold text-forest-light"><FileText className="h-4 w-4 text-primary" />Active listings</div><p className="mt-2 text-3xl font-bold text-forest">{activeCount}</p></div>
          <div className="card p-5"><div className="flex items-center gap-2 text-sm font-semibold text-forest-light"><Eye className="h-4 w-4 text-primary" />Listing views</div><p className="mt-2 text-3xl font-bold text-forest">{totalViews.toLocaleString()}</p></div>
          <div className="card p-5"><div className="flex items-center gap-2 text-sm font-semibold text-forest-light"><MousePointerClick className="h-4 w-4 text-primary" />Application clicks</div><p className="mt-2 text-3xl font-bold text-forest">{totalClicks.toLocaleString()}</p></div>
        </section>

        <section className="mt-10" aria-labelledby="workspace-listings-title">
          <div className="flex items-center justify-between gap-4">
            <h2 id="workspace-listings-title" className="font-display text-3xl text-forest">Listings</h2>
            <span className="text-sm text-forest-light">{jobs.length} total</span>
          </div>
          {jobs.length === 0 ? (
            <div className="card mt-5 p-8 text-center sm:p-10">
              <BarChart3 className="mx-auto h-10 w-10 text-primary" />
              <h3 className="mt-4 text-xl font-semibold text-forest">No managed listings yet</h3>
              <p className="mx-auto mt-2 max-w-lg text-forest-light">Post a new agricultural job, or claim an imported listing from its job page.</p>
              <Link href="/post-job?source=employer_empty_workspace" className="btn btn-primary mt-6">Post your first job <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {jobs.map((job) => {
                const status = statusLabel(job);
                const daysRemaining = Math.max(0, Math.ceil((job.expiresAt.getTime() - Date.now()) / 86_400_000));
                const expired = job.expiresAt <= new Date();
                return (
                  <article key={job.id} className="card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                          {job.featured ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">Featured</span> : null}
                        </div>
                        <h3 className="mt-3 text-xl font-semibold text-forest">{job.title}</h3>
                        <p className="mt-1 text-sm text-forest-light">{job.company} · {job.location}</p>
                      </div>
                    </div>
                    <dl className="mt-5 grid grid-cols-3 gap-3 rounded-lg bg-earth-sand p-4 text-center">
                      <div><dt className="text-xs text-earth-brown">Views</dt><dd className="mt-1 font-bold text-forest">{job.views}</dd></div>
                      <div><dt className="text-xs text-earth-brown">Apply clicks</dt><dd className="mt-1 font-bold text-forest">{job._count.funnelEvents}</dd></div>
                      <div><dt className="text-xs text-earth-brown">Days left</dt><dd className="mt-1 font-bold text-forest">{daysRemaining}</dd></div>
                    </dl>
                    <EmployerJobActions jobId={job.id} slug={job.slug} active={job.active} closed={Boolean(job.closedAt)} expired={expired} />
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {claims.length ? (
          <section className="mt-10" aria-labelledby="claims-title">
            <h2 id="claims-title" className="font-display text-3xl text-forest">Ownership claims</h2>
            <div className="card mt-5 divide-y divide-border">
              {claims.map((claim) => (
                <div key={claim.id} className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
                  <div><p className="font-semibold text-forest">{claim.job.title}</p><p className="mt-1 text-sm text-forest-light">{claim.job.company} · submitted {claim.createdAt.toLocaleDateString("en-US")}</p></div>
                  <span className="w-fit rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">{claim.status}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10" aria-labelledby="purchase-history-title">
          <div className="flex items-center gap-3"><CreditCard className="h-6 w-6 text-primary" /><h2 id="purchase-history-title" className="font-display text-3xl text-forest">Purchase history</h2></div>
          {purchases.length === 0 ? <p className="mt-4 text-forest-light">No purchases are associated with this employer account yet.</p> : (
            <div className="card mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-earth-sand text-forest"><tr><th className="px-5 py-3 font-semibold">Listing</th><th className="px-5 py-3 font-semibold">Type</th><th className="px-5 py-3 font-semibold">Amount</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Date</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id}><td className="px-5 py-4 text-forest">{purchase.job?.title || "Posting draft"}</td><td className="px-5 py-4 text-forest-light">{purchase.kind === "RENEWAL" ? "Renewal" : "Posting"} · {purchase.plan}</td><td className="px-5 py-4 text-forest-light">{currency(purchase.amount, purchase.currency)}</td><td className="px-5 py-4"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">{purchase.status}</span></td><td className="px-5 py-4 text-forest-light"><span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />{(purchase.paidAt || purchase.createdAt).toLocaleDateString("en-US")}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
