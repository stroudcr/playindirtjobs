import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  MapPin,
  Monitor,
  Search,
  Sprout,
} from "lucide-react";
import { getWorkshops } from "@/lib/workshops";
import { getUrl } from "@/lib/metadata";
import { US_STATES } from "@/lib/constants";
import { WORKSHOP_TOPICS, WORKSHOP_FORMATS } from "@/lib/workshop-types";
import { WorkshopCard } from "@/components/WorkshopCard";
import { safeJsonLd } from "@/lib/workshop-seo";

export const dynamic = "force-dynamic";
type Query = {
  q?: string;
  topic?: string;
  format?: string;
  state?: string;
  price?: string;
};
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Query>;
}): Promise<Metadata> {
  const params = await searchParams;
  const filtered = Object.values(params).some(Boolean);
  return {
    title: "Farm Workshops & Agricultural Training | PlayInDirtJobs",
    description:
      "Build practical farm, garden, greenhouse and ranch skills. Explore hands-on workshops, live online classes and self-paced agricultural courses. Register directly with the organizer.",
    alternates: { canonical: getUrl("/workshops") },
    ...(filtered ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: "Learn skills you can put to work",
      description:
        "Farm, garden and ranch workshops from people who do the work.",
      url: getUrl("/workshops"),
      images: [
        {
          url: getUrl("/images/home-hero-linocut-field.webp"),
          width: 1536,
          height: 1024,
        },
      ],
    },
  };
}
export default async function WorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const [params, workshops] = await Promise.all([searchParams, getWorkshops()]);
  const string = (value: unknown) =>
    typeof value === "string" ? value.slice(0, 120) : "";
  const q = string(params.q),
    topic = string(params.topic),
    format = string(params.format),
    state = string(params.state),
    price = string(params.price);
  const filtered = workshops.filter(
    (workshop) =>
      (!q ||
        `${workshop.title} ${workshop.organization} ${workshop.summary}`
          .toLowerCase()
          .includes(q.toLowerCase())) &&
      (!topic || workshop.topic === topic) &&
      (!format || workshop.format === format) &&
      (!state || workshop.state === state) &&
      (price !== "free" || workshop.tuitionCents === 0),
  );
  const hasFilters = Boolean(q || topic || format || state || price);
  const input =
    "mt-2 min-h-12 w-full rounded-lg border border-[#d9dbcf] bg-white px-3 text-sm text-forest focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
  return (
    <main className="min-h-screen bg-earth-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Farm workshops and agricultural training",
            url: getUrl("/workshops"),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: filtered.map((workshop, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: getUrl(`/workshops/${workshop.slug}`),
                name: workshop.title,
              })),
            },
          }),
        }}
      />
      <section className="overflow-hidden border-b border-[#dedbd1] bg-[#f7f6ed]">
        <div className="container mx-auto grid items-center gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-16">
          <div>
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-dark">
              <Sprout className="h-4 w-4" /> Workshops &amp; training
            </p>
            <h1 className="max-w-2xl font-display text-[2.8rem] leading-[1.04] tracking-[-0.025em] text-forest sm:text-6xl">
              Learn skills you can
              <br className="hidden sm:block" /> put to work.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-forest-light sm:text-lg">
              Get your hands in the soil. Learn from experienced growers. Find
              your next step in farm, garden, greenhouse, and ranch work.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#find-workshops" className="btn btn-primary min-h-12">
                Explore workshops <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/post-workshop"
                className="btn min-h-12 border border-forest/25 bg-transparent text-forest hover:bg-white"
              >
                List a workshop · $15
              </Link>
            </div>
            <p className="mt-5 text-sm text-earth-brown">
              Browse freely. Register directly with the organizer.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-3 rotate-2 rounded-[2rem] border border-forest/15" />
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-[#e7ebd9]">
              <Image
                src="/images/home-hero-linocut-field.webp"
                alt="Illustrated farm with garden rows, a greenhouse and people working outdoors"
                fill
                priority
                sizes="(min-width:1024px) 42vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/95 via-forest/75 to-transparent px-6 pb-6 pt-16 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">
                  Keep growing
                </p>
                <p className="mt-1 font-display text-2xl">
                  A little knowledge.
                  <br />A lot of possibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="border-b border-border bg-white">
        <div className="container mx-auto flex flex-wrap justify-center gap-x-10 gap-y-3 px-4 py-5 text-sm font-medium text-forest">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            In the field
          </span>
          <span className="inline-flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" />
            Live online
          </span>
          <span className="inline-flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            At your own pace
          </span>
        </div>
      </div>
      <section
        id="find-workshops"
        className="container mx-auto scroll-mt-24 px-4 py-10 sm:px-6 sm:py-14"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-secondary-dark">
              Your next growing season starts here
            </p>
            <h2 className="font-display text-3xl text-forest sm:text-4xl">
              Find your next class.
            </h2>
          </div>
          <p className="text-sm text-earth-brown">
            {workshops.length} open workshop{workshops.length === 1 ? "" : "s"}{" "}
            &amp; courses
          </p>
        </div>
        <form
          action="/workshops#find-workshops"
          className="mb-8 rounded-2xl border border-[#dedfd3] bg-white p-5 sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.1fr_1fr_1fr_auto]">
            <label className="text-xs font-semibold text-forest">
              Search classes
              <input
                name="q"
                defaultValue={q}
                placeholder="Skills, courses or organizers"
                className={input}
              />
            </label>
            <label className="text-xs font-semibold text-forest">
              Topic
              <select name="topic" defaultValue={topic} className={input}>
                <option value="">All topics</option>
                {WORKSHOP_TOPICS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-forest">
              How you learn
              <select name="format" defaultValue={format} className={input}>
                <option value="">All formats</option>
                {WORKSHOP_FORMATS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-forest">
              In-person location
              <select name="state" defaultValue={state} className={input}>
                <option value="">Any state</option>
                {US_STATES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn btn-primary min-h-12 self-end">
              <Search className="h-4 w-4" />
              Find classes
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-forest-light">
              <input
                type="checkbox"
                name="price"
                value="free"
                defaultChecked={price === "free"}
                className="h-4 w-4 accent-primary"
              />
              Free to attend
            </label>
            {hasFilters ? (
              <Link
                href="/workshops#find-workshops"
                className="text-sm font-semibold text-primary underline underline-offset-4"
              >
                Clear filters
              </Link>
            ) : (
              <p className="text-xs text-earth-brown">
                Prices shown are course tuition, paid to the organizer.
              </p>
            )}
          </div>
        </form>
        {hasFilters ? (
          <p className="mb-5 text-sm text-forest-light" role="status">
            {filtered.length} matching{" "}
            {filtered.length === 1 ? "course" : "courses"}
          </p>
        ) : null}
        {filtered.length ? (
          <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/30 px-6 py-14 text-center">
            <Sprout className="mx-auto mb-4 h-9 w-9 text-primary" />
            <h3 className="font-display text-2xl text-forest">
              Room for something new.
            </h3>
            <p className="mx-auto mt-3 max-w-md text-forest-light">
              No open classes match these filters yet. Explore online options or
              browse all workshops.
            </p>
            <Link
              href="/workshops#find-workshops"
              className="btn btn-primary mt-6"
            >
              See all workshops
            </Link>
          </div>
        )}
      </section>
      <section className="border-y border-[#dedbd1] bg-[#f0f2e7]">
        <div className="container mx-auto grid gap-8 px-5 py-12 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-secondary-dark">
              For people who teach
            </p>
            <h2 className="mt-3 font-display text-3xl text-forest sm:text-4xl">
              Share what you know.
              <br />
              Reach people ready to learn.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-forest-light">
              List your workshop for $15. Get a dedicated page and relevant
              placements alongside agricultural jobs and guides, for up to 60
              days.
            </p>
          </div>
          <div className="rounded-2xl border border-forest/15 bg-white p-7">
            <p className="font-display text-4xl text-forest">
              $15{" "}
              <span className="font-sans text-sm font-normal text-earth-brown">
                one time
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-forest-light">
              Import your existing course page, review the details, and pay.
              Manage everything through an emailed link. No account or
              subscription.
            </p>
            <Link href="/post-workshop" className="btn btn-primary mt-5 w-full">
              List your workshop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <section className="container mx-auto max-w-4xl px-5 py-12">
        <h2 className="mb-6 font-display text-3xl text-forest">
          A few things to know.
        </h2>
        <div className="divide-y divide-border">
          {[
            [
              "Do I need an account to browse?",
              "No. Explore every listing freely. When you find a course, follow the registration link to the organizer’s website. They handle enrollment and any course fees.",
            ],
            [
              "Are complimentary listings free courses?",
              "Complimentary means PlayInDirtJobs gifted the organizer their first promotional listing. The course may still have tuition; the attendee price is always shown separately.",
            ],
            [
              "How long does a workshop listing run?",
              "Promotion lasts up to 60 days from approval, ending sooner if registration closes or the workshop begins. Renewal is manual. Rejected submissions receive a refund of the listing fee.",
            ],
            [
              "Who handles changes or cancellations?",
              "Organizers manage class schedules, attendance and attendee refunds. Check their registration page for current availability and policies. Contact PlayInDirtJobs if a listing needs correcting.",
            ],
          ].map(([question, answer]) => (
            <details key={question} className="group py-5">
              <summary className="cursor-pointer font-semibold text-forest">
                {question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-forest-light">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
