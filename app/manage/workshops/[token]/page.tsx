import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { WorkshopWizard, DuplicateWorkshop } from "@/components/WorkshopWizard";
import { WorkshopManagement } from "@/components/WorkshopManagement";
import { workshopSchema } from "@/lib/workshop-validation";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Manage your workshop | PlayInDirtJobs",
  robots: { index: false, follow: false },
};
export default async function ManageWorkshop({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) notFound();
  const workshop = await db.workshop.findUnique({
    where: { editToken: token },
    include: { events: { select: { eventName: true } } },
  });
  if (!workshop || !workshop.managementEmail || workshop.status === "DRAFT")
    notFound();
  const input = workshopSchema.parse({
    ...workshop,
    startAt: workshop.startAt?.toISOString() ?? null,
    endAt: workshop.endAt?.toISOString() ?? null,
    registrationClosesAt: workshop.registrationClosesAt?.toISOString() ?? null,
  });
  const expired = Boolean(
    workshop.expiresAt && workshop.expiresAt <= new Date(),
  );
  return (
    <main className="min-h-screen bg-earth-cream px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary-dark">
          Your private management page
        </p>
        <h1 className="mt-3 font-display text-4xl text-forest">
          {workshop.title}
        </h1>
        <p className="mt-4 text-forest-light">
          Status:{" "}
          <strong>
            {expired
              ? "Expired"
              : workshop.status.replaceAll("_", " ").toLowerCase()}
          </strong>
          {workshop.expiresAt
            ? ` · Promotion ends ${workshop.expiresAt.toLocaleDateString("en-US", { timeZone: workshop.timeZone })}`
            : " · Awaiting review"}
        </p>
        {workshop.reviewNote ? (
          <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">
            {workshop.reviewNote}
          </p>
        ) : null}
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Course-page views", "workshop_detail_view"],
            ["Registration-link clicks", "workshop_registration_click"],
          ].map(([label, event]) => (
            <div
              key={event}
              className="rounded-xl border border-border bg-white p-5"
            >
              <p className="text-sm text-forest-light">{label}</p>
              <p className="mt-1 text-3xl font-bold text-forest">
                {
                  workshop.events.filter((item) => item.eventName === event)
                    .length
                }
              </p>
            </div>
          ))}
        </div>
        <p className="mb-6 text-xs text-earth-brown">
          Activity is deduplicated within a visitor session and day.
          Registration clicks are referrals, not confirmed enrollments.
        </p>
        <div className="mb-8 space-y-4">
          <WorkshopManagement
            id={workshop.id}
            token={token}
            status={expired ? "EXPIRED" : workshop.status}
          />
          <DuplicateWorkshop input={input} />
          {workshop.publishedAt ? (
            <Link
              href={`/workshops/${workshop.slug}`}
              className="ml-4 text-sm font-semibold text-primary underline"
            >
              View public listing
            </Link>
          ) : null}
        </div>
        {!expired && workshop.status !== "REJECTED" ? (
          <WorkshopWizard initial={input} manage={{ id: workshop.id, token }} />
        ) : (
          <p className="rounded-xl border border-border bg-white p-6 text-forest-light">
            This promotion has ended. Use “List the next session” to reuse these
            details for a new $15 listing.
          </p>
        )}
      </div>
    </main>
  );
}
