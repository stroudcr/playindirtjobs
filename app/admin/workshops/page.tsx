import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthenticationError, requireAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminWorkshopActions } from "@/components/AdminWorkshops";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Workshop operations | PlayInDirtJobs",
  robots: { index: false, follow: false },
};
export default async function AdminWorkshops() {
  try {
    await requireAdminSession();
  } catch (error) {
    if (error instanceof AuthenticationError)
      redirect("/employer/login?returnTo=/admin/workshops");
    throw error;
  }
  const [workshops, paid, visits, clicks] = await Promise.all([
    db.workshop.findMany({
      where: { status: { not: "DRAFT" } },
      include: { order: { select: { status: true, amount: true } } },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 100,
    }),
    db.workshopOrder.aggregate({
      where: { status: "PAID" },
      _count: { id: true },
      _sum: { amount: true },
    }),
    db.workshopEvent.count({ where: { eventName: "workshop_detail_view" } }),
    db.workshopEvent.count({
      where: { eventName: "workshop_registration_click" },
    }),
  ]);
  return (
    <main className="min-h-screen bg-earth-cream px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-sm font-semibold text-primary">
          ← Employer operations
        </Link>
        <h1 className="mt-5 font-display text-4xl text-forest">
          Workshop operations
        </h1>
        <p className="mt-3 text-forest-light">
          Review the organizer, registration destination, dates, tuition and
          learning content before publishing. Gifted listings are excluded from
          paid demand.
        </p>
        <div className="my-7 grid gap-4 sm:grid-cols-4">
          {[
            ["Paid listings", paid._count.id],
            [
              "Gross paid revenue",
              `$${((paid._sum.amount ?? 0) / 100).toFixed(2)}`,
            ],
            ["Course-page views", visits],
            ["Registration clicks", clicks],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-white p-5"
            >
              <p className="text-xs text-earth-brown">{label}</p>
              <p className="mt-2 text-3xl font-bold text-forest">{value}</p>
            </div>
          ))}
        </div>
        <p className="mb-6 text-xs text-earth-brown">
          Lifetime activity, deduplicated per visitor session, placement and
          day. Referrals are not confirmed enrollments.
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          {workshops
            .sort(
              (a, b) =>
                Number(b.status === "PENDING_REVIEW") -
                Number(a.status === "PENDING_REVIEW"),
            )
            .map((workshop) => (
              <article
                key={workshop.id}
                className="rounded-xl border border-border bg-white p-6"
              >
                <p className="text-xs font-semibold uppercase text-secondary-dark">
                  {workshop.origin} · {workshop.status.replaceAll("_", " ")}
                </p>
                <h2 className="mt-2 font-display text-2xl text-forest">
                  {workshop.title}
                </h2>
                <p className="mt-2 text-sm text-forest-light">
                  {workshop.organization} ·{" "}
                  {workshop.managementEmail || "Owner unassigned"}
                </p>
                <p className="mt-3 text-sm text-forest-light">
                  {workshop.summary}
                </p>
                <details className="mt-4 text-sm text-forest-light">
                  <summary className="cursor-pointer font-semibold">
                    Review full submission
                  </summary>
                  <p className="mt-3 whitespace-pre-line">
                    {workshop.description}
                  </p>
                  <ul className="mt-3 list-disc pl-5">
                    {workshop.outcomes.map((outcome, i) => (
                      <li key={i}>{outcome}</li>
                    ))}
                  </ul>
                  <p className="mt-3">Audience: {workshop.audience}</p>
                  <p className="mt-2">
                    Prerequisites: {workshop.prerequisites || "None specified"}
                  </p>
                  <p className="mt-2">
                    Instructor: {workshop.instructor || "Not specified"}
                  </p>
                  <p className="mt-2">
                    Schedule: {workshop.startAt?.toISOString() || "Self-paced"}{" "}
                    – {workshop.endAt?.toISOString() || ""} ·{" "}
                    {workshop.timeZone}
                  </p>
                  <p className="mt-2">{workshop.scheduleNotes}</p>
                  <p className="mt-2">
                    Registration closes:{" "}
                    {workshop.registrationClosesAt?.toISOString() ||
                      "By start / promotion end"}
                  </p>
                  <p className="mt-2">
                    Location: {workshop.venue} {workshop.address}{" "}
                    {workshop.city} {workshop.state}
                  </p>
                  <p className="mt-2">
                    Tuition: ${(workshop.tuitionCents / 100).toFixed(2)} ·{" "}
                    {workshop.priceNotes}
                  </p>
                </details>
                <a
                  href={workshop.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block break-all text-sm font-semibold text-primary underline"
                >
                  Open registration page ↗
                </a>
                {workshop.publishedAt ? (
                  <Link
                    href={`/workshops/${workshop.slug}`}
                    className="ml-4 text-sm text-primary underline"
                  >
                    Public listing
                  </Link>
                ) : null}
                <AdminWorkshopActions
                  id={workshop.id}
                  pending={workshop.status === "PENDING_REVIEW"}
                  rejecting={workshop.status === "REJECTING"}
                  giftedUnassigned={
                    workshop.origin === "GIFTED" && !workshop.managementEmail
                  }
                />
              </article>
            ))}
        </div>
      </div>
    </main>
  );
}
