import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminGrowthOperations } from "@/components/AdminGrowthOperations";
import { AuthenticationError, requireAdminSession } from "@/lib/auth";
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
  const [events, revenue, leads, messages, pendingClaims, paidCount] = await Promise.all([
    db.funnelEvent.groupBy({
      by: ["eventName"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { eventName: "desc" } },
    }),
    db.purchase.aggregate({ where: { status: "PAID", paidAt: { gte: since } }, _sum: { amount: true } }),
    db.employerLead.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    db.outreachMessage.findMany({ include: { lead: { select: { company: true, name: true } } }, orderBy: { createdAt: "desc" }, take: 50 }),
    db.listingClaim.count({ where: { status: "PENDING" } }),
    db.purchase.count({ where: { status: "PAID", paidAt: { gte: since } } }),
  ]);

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
            <Link href="/admin/claims" className="btn btn-outline">Claims ({pendingClaims})</Link>
            <a href="/api/admin/leads/export" className="btn btn-outline">Export CSV</a>
          </div>
        </div>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Thirty-day results">
          <Metric label="Paid postings" value={String(paidCount)} />
          <Metric label="Posting revenue" value={`$${((revenue._sum.amount ?? 0) / 100).toFixed(0)}`} />
          <Metric label="Employer leads" value={String(leads.length)} note="Most recent 50 shown" />
          <Metric label="Pending claims" value={String(pendingClaims)} />
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
