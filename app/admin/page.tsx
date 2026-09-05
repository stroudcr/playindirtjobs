import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminGrowthOperations } from "@/components/AdminGrowthOperations";
import {
  EMPLOYER_ACTIVITY_EVENTS,
  summarizeEmployerActivity,
} from "@/lib/admin-analytics";
import { AuthenticationError, requireAdminSession } from "@/lib/auth";
import {
  formatKnownRevenue,
  reconcilePaidCustomerActivity,
} from "@/lib/customer-reporting";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Employer operations | PlayInDirtJobs", robots: { index: false, follow: false } };

export default async function AdminPage() {
  try {
    await requireAdminSession();
  } catch (error) {
    if (error instanceof AuthenticationError) redirect("/employer/login?returnTo=/admin");
    throw error;
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1_000);
  const [
    events,
    employerActivityEvents,
    normalizedPurchases,
    legacyPaidJobs,
    leads,
    messages,
    pendingClaims,
  ] = await Promise.all([
    db.funnelEvent.groupBy({
      by: ["eventName"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { eventName: "desc" } },
    }),
    db.funnelEvent.findMany({
      where: {
        createdAt: { gte: since },
        eventName: { in: [...EMPLOYER_ACTIVITY_EVENTS] },
      },
      select: { eventName: true, anonymousId: true, properties: true },
    }),
    db.purchase.findMany({
      select: {
        id: true,
        status: true,
        jobId: true,
        employerId: true,
        amount: true,
        currency: true,
        stripePaymentIntentId: true,
        paidAt: true,
        createdAt: true,
        employer: { select: { email: true } },
      },
    }),
    db.job.findMany({
      where: { origin: "EMPLOYER", stripePaymentId: { not: null } },
      select: {
        id: true,
        employerId: true,
        managementEmail: true,
        companyEmail: true,
        stripePaymentId: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
    db.employerLead.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    db.outreachMessage.findMany({ include: { lead: { select: { company: true, name: true } } }, orderBy: { createdAt: "desc" }, take: 50 }),
    db.listingClaim.count({ where: { status: "PENDING" } }),
  ]);
  const purchasesForReport = normalizedPurchases.map((purchase) => ({
    ...purchase,
    employerEmail: purchase.employer?.email ?? null,
  }));
  const recentCustomerReport = reconcilePaidCustomerActivity(
    purchasesForReport,
    legacyPaidJobs,
    { since }
  );
  const lifetimeCustomerReport = reconcilePaidCustomerActivity(
    purchasesForReport,
    legacyPaidJobs
  );
  const employerActivity = summarizeEmployerActivity(employerActivityEvents);

  return (
    <main className="min-h-screen bg-earth-cream py-10">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Secure admin</p>
            <h1 className="mt-1 text-4xl font-display text-forest">Employer operations</h1>
            <p className="mt-2 text-forest-light">Human-approved outreach, claims, leads and a 30-day funnel view.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/workshops" className="btn btn-outline">Workshops</Link>
            <Link href="/admin/claims" className="btn btn-outline">Claims ({pendingClaims})</Link>
            <a href="/api/admin/leads/export" className="btn btn-outline">Export CSV</a>
          </div>
        </div>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Thirty-day results">
          <Metric
            label="Paid postings · 30 days"
            value={String(recentCustomerReport.paidPostings)}
            note={`${recentCustomerReport.normalizedPaidPostings} purchase ledger + ${recentCustomerReport.legacyPaidPostings} unmatched legacy`}
          />
          <Metric
            label="Gross paid revenue · 30 days"
            value={formatKnownRevenue(recentCustomerReport.knownRevenueByCurrency)}
            note={recentCustomerReport.legacyRevenueUnknown
              ? `${recentCustomerReport.legacyRevenueUnknown} legacy transaction value${recentCustomerReport.legacyRevenueUnknown === 1 ? " is" : "s are"} unavailable`
              : "All counted transaction values are known"}
          />
          <Metric
            label="Paying employers · 30 days"
            value={String(recentCustomerReport.payingEmployers)}
            note="Distinct reconciled buyer identities"
          />
          <Metric label="Recent employer leads" value={String(leads.length)} note="Most recent 50 shown" />
          <Metric label="Pending claims" value={String(pendingClaims)} />
          <Metric
            label="Lifetime paid records"
            value={String(lifetimeCustomerReport.paidPostings)}
            note={`${lifetimeCustomerReport.payingEmployers} employers · ${formatKnownRevenue(lifetimeCustomerReport.knownRevenueByCurrency)} known gross revenue`}
          />
        </section>

        <section className="card mt-6 p-5 sm:p-6">
          <h2 className="text-xl font-display text-forest">Qualified U.S. employer activity · last 30 days</h2>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-forest-light">
            Distinct anonymous visitors are grouped using Vercel’s country header. Obvious bot and prefetch signatures are rejected before storage, but this remains a directional quality signal—not perfect human detection. Older events without a country remain unknown.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-b border-forest/15 text-xs uppercase tracking-wide text-forest-light">
                <tr>
                  <th className="px-3 py-3 font-semibold">Employer action</th>
                  <th className="px-3 py-3 text-right font-semibold">U.S.</th>
                  <th className="px-3 py-3 text-right font-semibold">Non-U.S.</th>
                  <th className="px-3 py-3 text-right font-semibold">Unknown</th>
                  <th className="px-3 py-3 text-right font-semibold">All accepted</th>
                </tr>
              </thead>
              <tbody>
                {employerActivity.map((activity) => (
                  <tr key={activity.eventName} className="border-b border-forest/10 last:border-0">
                    <td className="px-3 py-3 font-medium text-forest">
                      {activity.eventName === "employer_landing_view" ? "Employer landings" : "Employer CTA clickers"}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-forest">{activity.us}</td>
                    <td className="px-3 py-3 text-right text-forest-light">{activity.nonUs}</td>
                    <td className="px-3 py-3 text-right text-forest-light">{activity.unknown}</td>
                    <td className="px-3 py-3 text-right text-forest-light">{activity.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card mt-6 p-5 sm:p-6">
          <h2 className="text-xl font-display text-forest">Employer funnel · last 30 days</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {events.length ? events.map((event) => (
              <div key={event.eventName} className="rounded-lg bg-earth-cream/60 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-forest-light">{event.eventName.replaceAll("_", " ")}</p>
                <p className="mt-1 text-2xl font-bold text-forest">{event._count._all}</p>
              </div>
            )) : <p className="text-sm text-forest-light">Funnel events will appear after the new employer journey receives traffic.</p>}
          </div>
        </section>

        <AdminGrowthOperations
          leads={leads.map((lead) => ({
            id: lead.id,
            email: lead.email,
            name: lead.name,
            company: lead.company,
            source: lead.source,
            status: lead.status,
          }))}
          messages={messages.map((message) => ({
            id: message.id,
            recipient: message.recipient,
            subject: message.subject,
            template: message.template,
            status: message.status,
            leadLabel: message.lead?.company || message.lead?.name || message.recipient,
            createdAt: message.createdAt.toISOString(),
          }))}
          outreachConfigured={Boolean(process.env.OUTREACH_POSTAL_ADDRESS && (process.env.OUTREACH_UNSUBSCRIBE_SECRET || process.env.CRON_SECRET))}
        />
      </div>
    </main>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-forest-light">{label}</p>
      <p className="mt-1 text-3xl font-bold text-forest">{value}</p>
      {note ? <p className="mt-1 text-xs text-forest-light">{note}</p> : null}
    </div>
  );
}
