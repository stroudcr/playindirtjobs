import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  Monitor,
  Sprout,
} from "lucide-react";
import { getWorkshop, relatedWorkshops } from "@/lib/workshops";
import { getUrl } from "@/lib/metadata";
import {
  workshopDate,
  workshopFormat,
  workshopIsOpen,
  workshopPrice,
  workshopTopic,
} from "@/lib/workshop-types";
import { safeJsonLd, workshopStructuredData } from "@/lib/workshop-seo";
import {
  WorkshopImpression,
  WorkshopRegistration,
} from "@/components/WorkshopTracking";
import { WorkshopCard } from "@/components/WorkshopCard";

export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const workshop = await getWorkshop((await params).slug);
  if (!workshop)
    return { title: "Workshop not found", robots: { index: false } };
  return {
    title: `${workshop.title} | ${workshop.organization} | PlayInDirtJobs`,
    description: workshop.summary,
    alternates: { canonical: getUrl(`/workshops/${workshop.slug}`) },
    ...(!workshopIsOpen(workshop)
      ? { robots: { index: false, follow: true } }
      : {}),
    openGraph: {
      title: workshop.title,
      description: workshop.summary,
      url: getUrl(`/workshops/${workshop.slug}`),
      type: "website",
      images: [getUrl("/images/home-hero-linocut-field.webp")],
    },
    twitter: {
      card: "summary_large_image",
      title: workshop.title,
      description: workshop.summary,
    },
  };
}
export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const workshop = await getWorkshop((await params).slug);
  if (!workshop) notFound();
  const open = workshopIsOpen(workshop),
    topic = workshopTopic(workshop.topic);
  const related = await relatedWorkshops({
    topics: [workshop.topic],
    state: workshop.state,
    exclude: workshop.id,
  });
  const jobLink =
    workshop.topic === "livestock"
      ? "/ranch-jobs"
      : workshop.topic === "greenhouse"
        ? "/gardening-jobs"
        : "/farming-jobs";
  const time = workshop.startAt
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
        timeZone: workshop.timeZone,
      }).format(new Date(workshop.startAt))
    : "Your schedule, your pace";
  return (
    <main className="min-h-screen bg-earth-cream">
      {open ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(workshopStructuredData(workshop)),
          }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "PlayInDirtJobs",
                item: getUrl(""),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Workshops",
                item: getUrl("/workshops"),
              },
              {
                "@type": "ListItem",
                position: 3,
                name: workshop.title,
                item: getUrl(`/workshops/${workshop.slug}`),
              },
            ],
          }),
        }}
      />
      <section className="border-b border-[#dedbd1] bg-[#f7f6ed]">
        <div className="container mx-auto max-w-6xl px-5 py-9 sm:py-12">
          <Link
            href="/workshops"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            All workshops
          </Link>
          <div className="mt-7 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7eddf] px-3 py-1 text-xs font-semibold text-forest">
              <Sprout className="h-3.5 w-3.5" />
              {topic.label}
            </span>
            <span className="rounded-full border border-forest/15 px-3 py-1 text-xs text-forest-light">
              {workshop.level}
            </span>
            <span className="rounded-full border border-forest/15 px-3 py-1 text-xs text-forest-light">
              {workshopFormat(workshop.format)}
            </span>
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[1.08] tracking-tight text-forest sm:text-5xl lg:text-6xl">
            {workshop.title}
          </h1>
          <p className="mt-4 text-base font-medium text-forest-light">
            Offered by {workshop.organization}
          </p>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-forest-light">
            {workshop.summary}
          </p>
        </div>
      </section>
      <div className="container mx-auto max-w-6xl px-5 py-8 sm:py-12">
        {!open ? (
          <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
            <p className="font-semibold">
              {workshop.status === "SOLD_OUT"
                ? "This workshop is marked full."
                : workshop.status === "CANCELED"
                  ? "This workshop has been canceled."
                  : workshop.status === "PENDING_REVIEW"
                    ? "This listing is being updated."
                    : "This listing is no longer open."}
            </p>
            <Link
              href="/workshops"
              className="mt-2 inline-block underline underline-offset-4"
            >
              Explore current workshops and training
            </Link>
          </div>
        ) : (
          <WorkshopImpression id={workshop.id} source="detail" detail />
        )}
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px] lg:gap-12">
          <aside className="order-first rounded-2xl border border-[#d9ddcc] bg-white p-6 shadow-soft lg:order-last lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-wider text-earth-brown">
              Course tuition
            </p>
            <p className="mt-1 font-display text-4xl text-forest">
              {workshopPrice(workshop)}
            </p>
            {workshop.priceNotes ? (
              <p className="mt-2 text-sm leading-relaxed text-forest-light">
                {workshop.priceNotes}
              </p>
            ) : null}
            <div className="my-6 space-y-5 border-y border-border py-5">
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-forest">
                    {workshopDate(workshop)}
                  </p>
                  <p className="mt-1 text-sm text-forest-light">{time}</p>
                  {workshop.endAt ? (
                    <p className="mt-1 text-xs text-earth-brown">
                      Ends{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: workshop.timeZone,
                      }).format(new Date(workshop.endAt))}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-3">
                {workshop.format === "in-person" ? (
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                ) : (
                  <Monitor className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                )}
                <div>
                  <p className="font-semibold text-forest">
                    {workshop.format === "in-person"
                      ? workshop.venue
                      : workshopFormat(workshop.format)}
                  </p>
                  {workshop.format === "in-person" ? (
                    <p className="mt-1 text-sm leading-relaxed text-forest-light">
                      {workshop.address}
                      <br />
                      {workshop.city}, {workshop.state} {workshop.postalCode}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-forest-light">
                      Join from your own space.
                    </p>
                  )}
                </div>
              </div>
            </div>
            {open ? (
              <WorkshopRegistration
                id={workshop.id}
                url={workshop.registrationUrl}
                gifted={workshop.origin === "GIFTED"}
              />
            ) : (
              <Link href="/workshops" className="btn btn-primary w-full">
                Find an open workshop
              </Link>
            )}
            <p className="mt-3 text-center text-xs leading-relaxed text-earth-brown">
              Enrollment and payment happen on the organizer’s website.
            </p>
            {workshop.registrationClosesAt ? (
              <p className="mt-4 text-xs text-earth-brown">
                Registration closes{" "}
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: workshop.timeZone,
                }).format(new Date(workshop.registrationClosesAt))}
                .
              </p>
            ) : null}
          </aside>
          <div className="space-y-9">
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary-dark">
                About the experience
              </p>
              <h2 className="mt-2 font-display text-3xl text-forest">
                Learn it. Then try it.
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-forest-light">
                {workshop.description
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </section>
            <section className="rounded-2xl border border-[#dedfd3] bg-[#f0f3e9] p-6 sm:p-7">
              <h2 className="font-display text-2xl text-forest">
                What you’ll learn
              </h2>
              <ul className="mt-5 space-y-4">
                {workshop.outcomes.map((outcome, index) => (
                  <li key={index} className="flex gap-3 text-forest-light">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="font-display text-2xl text-forest">
                Who it’s for
              </h2>
              <p className="mt-3 leading-relaxed text-forest-light">
                {workshop.audience}
              </p>
              {workshop.prerequisites ? (
                <p className="mt-3 text-sm leading-relaxed text-forest-light">
                  <strong>Before you join: </strong>
                  {workshop.prerequisites}
                </p>
              ) : null}
            </section>
            {workshop.scheduleNotes ? (
              <section>
                <h2 className="font-display text-2xl text-forest">
                  Plan your time
                </h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-forest-light">
                  {workshop.scheduleNotes}
                </p>
              </section>
            ) : null}
            <section className="border-t border-border pt-7">
              <h2 className="font-display text-2xl text-forest">
                Meet the organizer
              </h2>
              <p className="mt-3 font-semibold text-forest">
                {workshop.organization}
              </p>
              {workshop.instructor ? (
                <p className="mt-2 text-sm text-forest-light">
                  Instructor: {workshop.instructor}
                </p>
              ) : null}
              {workshop.organizerWebsite ? (
                <a
                  href={workshop.organizerWebsite}
                  rel="noopener"
                  className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-4"
                >
                  Visit organizer’s website ↗
                </a>
              ) : null}
              <p className="mt-5 rounded-lg bg-earth-sand p-4 text-xs leading-relaxed text-earth-brown">
                {workshop.origin === "GIFTED"
                  ? "Complimentary launch listing: PlayInDirtJobs gifted this first listing and summarized the organizer’s public course information. Course tuition is separate. This does not imply a partnership or organizer endorsement."
                  : "Sponsored listing submitted by the organizer. PlayInDirtJobs promotes this course; the organizer delivers the training."}
                {workshop.verifiedAt
                  ? ` Details checked ${new Date(workshop.verifiedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}.`
                  : ""}{" "}
                Check the organizer’s page for current availability and
                policies.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-block text-xs font-medium text-primary underline underline-offset-4"
              >
                Organize this course or notice a correction? Contact us.
              </Link>
            </section>
          </div>
        </div>
        {related.length ? (
          <section className="mt-14 border-t border-border pt-9">
            <h2 className="mb-6 font-display text-3xl text-forest">
              Keep your curiosity growing.
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {related.map((item) => (
                <WorkshopCard
                  key={item.id}
                  workshop={item}
                  compact
                  source="related"
                />
              ))}
            </div>
          </section>
        ) : null}
        <section className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-forest p-7 text-white">
          <div>
            <h2 className="font-display text-2xl">
              Ready to put your skills to work?
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Find hands-on agricultural jobs with employers across the U.S.
            </p>
          </div>
          <Link
            href={jobLink}
            className="btn bg-white text-forest hover:bg-earth-sand"
          >
            Explore related jobs →
          </Link>
        </section>
      </div>
    </main>
  );
}
