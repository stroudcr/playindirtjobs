import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardList,
  CreditCard,
  PenLine,
  Send,
  Sprout,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmployerLeadForm } from "@/components/EmployerLeadForm";
import { TrackPageView } from "@/components/TrackPageView";
import { TrackedLink } from "@/components/TrackedLink";
import { PRICING } from "@/lib/constants";
import { db } from "@/lib/db";
import { getUrl } from "@/lib/metadata";
import { employerNicheList } from "./content";

const basicPrice = PRICING.BASIC / 100;
const featuredPrice = PRICING.FEATURED / 100;

export const dynamic = "force-dynamic";

async function getObservedActivity() {
  const end = new Date();
  const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1_000);

  try {
    const activity = await db.funnelEvent.groupBy({
      by: ["eventName"],
      where: {
        eventName: { in: ["job_viewed", "apply_clicked"] },
        createdAt: { gte: start, lt: end },
      },
      _count: { _all: true },
    });
    const counts = new Map(activity.map((item) => [item.eventName, item._count._all]));
    const jobViews = counts.get("job_viewed") ?? 0;
    const applicationClicks = counts.get("apply_clicked") ?? 0;

    // Avoid turning a very small sample into marketing proof. These are exact,
    // first-party activity counts, not promises about future results.
    if (jobViews < 100 || applicationClicks < 20) return null;

    return {
      jobViews,
      applicationClicks,
      period: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}–${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}`,
    };
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Post Agricultural Jobs Nationwide | PlayInDirtJobs",
  description:
    "Post a farm, greenhouse, nursery, orchard, vineyard, or CSA job nationwide. Basic listings cost $15, Featured listings cost $25, and both stay active for 60 days.",
  keywords: [
    "post agricultural jobs",
    "agriculture job board for employers",
    "post farm jobs",
    "hire farm workers",
    "post greenhouse jobs",
    "post vineyard jobs",
  ],
  alternates: { canonical: getUrl("employers") },
  openGraph: {
    title: "Post Agricultural Jobs Nationwide | PlayInDirtJobs",
    description:
      "Choose a $15 Basic or $25 Featured agriculture job listing. Both plans stay active for 60 days.",
    url: getUrl("employers"),
    siteName: "PlayInDirtJobs",
    type: "website",
    images: [
      {
        url: "/images/PlayInDirtX.png",
        width: 1200,
        height: 630,
        alt: "Post an agricultural job on PlayInDirtJobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Post Agricultural Jobs Nationwide | PlayInDirtJobs",
    description:
      "Choose a $15 Basic or $25 Featured agriculture job listing. Both plans stay active for 60 days.",
    images: ["/images/PlayInDirtX.png"],
  },
};

const faqs = [
  {
    question: "How much does an agriculture job posting cost?",
    answer:
      "A Basic listing costs $15 and a Featured listing costs $25. Each purchase covers one job listing for 60 days, with no automatic renewal.",
  },
  {
    question: "What is included with a Basic listing?",
    answer:
      "A Basic listing remains active for 60 days and appears in standard job results. You can provide an application email address or a link to your own application page.",
  },
  {
    question: "What is different about a Featured listing?",
    answer:
      "Featured listings are highlighted, carry a Featured label, and are displayed ahead of Basic listings in job result lists. They remain active for the same 60-day period.",
  },
  {
    question: "Where can job seekers see my listing?",
    answer:
      "Published listings can be viewed nationwide. Each listing shows its job location, and job seekers can browse or filter listings by location and job details.",
  },
  {
    question: "How do candidates apply?",
    answer:
      "You choose the application destination. Send candidates to a public application email address or an application page on your own website or hiring system.",
  },
  {
    question: "Can I post several open roles?",
    answer:
      "Yes. Use a separate listing for each distinct job so the title, location, schedule, and requirements remain clear. Contact us if you need help planning several postings.",
  },
];

const postingSteps = [
  {
    icon: ClipboardList,
    title: "Add the role and location",
    body: "Start with the job title, work location, job type, and timing.",
  },
  {
    icon: PenLine,
    title: "Describe the work",
    body: "Add responsibilities, compensation, requirements, benefits, and schedule.",
  },
  {
    icon: Send,
    title: "Choose how people apply",
    body: "Use an application email address or link to your existing application page.",
  },
  {
    icon: CreditCard,
    title: "Preview and publish",
    body: "Review the complete listing, select Basic or Featured, and complete checkout.",
  },
] as const;

function JsonLd() {
  const pageUrl = getUrl("employers");
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Post Agricultural Jobs Nationwide",
        description:
          "Post an agricultural job with a 60-day Basic or Featured listing on PlayInDirtJobs.",
        isPartOf: {
          "@type": "WebSite",
          name: "PlayInDirtJobs",
          url: getUrl(),
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#job-posting-service`,
        name: "PlayInDirtJobs job posting",
        provider: {
          "@type": "Organization",
          name: "PlayInDirtJobs",
          url: getUrl(),
        },
        areaServed: {
          "@type": "Country",
          name: "United States",
        },
        offers: [
          {
            "@type": "Offer",
            name: "Basic job listing",
            price: basicPrice.toFixed(2),
            priceCurrency: "USD",
            url: getUrl("post-job?plan=basic&source=employers_hub_schema"),
          },
          {
            "@type": "Offer",
            name: "Featured job listing",
            price: featuredPrice.toFixed(2),
            priceCurrency: "USD",
            url: getUrl("post-job?plan=featured&source=employers_hub_schema"),
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function EmployersPage() {
  const observedActivity = await getObservedActivity();

  return (
    <main className="min-h-screen bg-earth-cream">
      <JsonLd />
      <TrackPageView
        eventName="employer_landing_view"
        eventParams={{ landing_page: "/employers", niche: "all" }}
      />

      <section className="overflow-hidden border-b border-border bg-gradient-to-b from-white to-earth-sand">
        <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "For Employers" }]} />

            <div className="mt-7 grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:gap-16">
              <div>
                <h1 className="max-w-3xl text-balance font-display text-4xl leading-[1.06] text-forest sm:text-5xl lg:text-6xl">
                  Hire for the work that keeps your operation moving
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-forest-light sm:text-xl">
                  Post farm, greenhouse, nursery, orchard, vineyard, ranch, and CSA roles on a nationwide agriculture job board. Choose one 60-day listing with one payment.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <TrackedLink
                    href="/post-job?plan=basic&source=employers_hub_hero"
                    eventName="employer_cta_click"
                    eventParams={{ source: "employers_hub", placement: "hero", plan: "basic" }}
                    className="btn btn-primary justify-center sm:justify-start"
                  >
                    Post a job for ${basicPrice}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </TrackedLink>
                  <Link href="/pricing?source=employers_hub_hero" className="btn btn-outline justify-center sm:justify-start">
                    Compare plans
                  </Link>
                </div>
                <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-forest-light">
                  <span className="inline-flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />
                    ${basicPrice} Basic
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-primary" aria-hidden="true" />
                    ${featuredPrice} Featured
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                    60 days
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-white shadow-soft-xl">
                  <Image
                    src="/images/about2.jpg"
                    alt="A farm worker planting seedlings in a field"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 520px"
                    priority
                  />
                </div>
                <div className="relative -mt-7 ml-5 mr-5 rounded-lg border border-border bg-white p-5 shadow-soft-lg sm:ml-10 sm:mr-0">
                  <p className="font-display text-xl text-forest">You choose the application path</p>
                  <p className="mt-2 text-sm leading-relaxed text-forest-light">
                    Send candidates to an application email address or directly to your website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {observedActivity ? (
        <section className="border-b border-border bg-white" aria-label="Recent job seeker activity">
          <div className="container mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-10">
            <div>
              <p className="font-display text-xl text-forest">Observed on PlayInDirtJobs</p>
              <p className="mt-1 text-xs text-forest-light">Exact first-party activity, {observedActivity.period}. Results vary by role and location.</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{observedActivity.jobViews.toLocaleString("en-US")}</p>
              <p className="text-xs text-forest-light">job-detail views</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{observedActivity.applicationClicks.toLocaleString("en-US")}</p>
              <p className="text-xs text-forest-light">application-destination clicks</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h2 className="text-balance font-display text-3xl text-forest sm:text-4xl">
              Start with the kind of operation you run
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-forest-light">
              Each guide covers the schedule, conditions, skills, and benefits candidates need to understand that work.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {employerNicheList.map((niche, index) => (
              <Link
                key={niche.slug}
                href={`/${niche.slug}`}
                className="group card flex min-h-48 flex-col justify-between p-6 hover:border-primary/30 hover:shadow-soft-lg sm:p-7"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="font-display text-3xl text-primary/30" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
                <div className="mt-8">
                  <h3 className="font-display text-2xl text-forest transition-colors group-hover:text-primary">
                    {niche.shortName}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest-light">Read the hiring guide</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl text-forest sm:text-4xl">A straightforward path from role to listing</h2>
              <p className="mt-4 text-lg leading-relaxed text-forest-light">
                Build the posting in four parts, review what candidates will see, and pay only when it is ready.
              </p>
            </div>

            <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {postingSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="border-t-2 border-primary/25 pt-6">
                    <div className="flex items-center justify-between">
                      <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      <span className="text-sm font-semibold text-primary">0{index + 1}</span>
                    </div>
                    <h3 className="mt-5 font-display text-xl text-forest">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-forest-light">{step.body}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <div>
              <h2 className="text-balance font-display text-3xl text-forest sm:text-4xl">
                Put the practical details in one place
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-forest-light">
                A PlayInDirtJobs listing gives candidates a consistent way to review the role before following your application instructions.
              </p>
            </div>
            <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {[
                "Job title and location",
                "Compensation and schedule",
                "Responsibilities and requirements",
                "Job and farm types",
                "Benefits such as housing or meals",
                "Application email or website",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 border-b border-border pb-5 text-forest-light">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-forest py-14 text-white md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl sm:text-4xl">Choose how your opening appears</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/75">
                Both plans cover one job for 60 days. There are no recurring charges or automatic renewals.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <article className="rounded-lg border border-white/15 bg-white p-7 text-forest shadow-soft-xl sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-display text-2xl">Basic listing</h3>
                    <p className="mt-2 text-sm text-forest-light">Standard placement in job results</p>
                  </div>
                  <p className="text-4xl font-bold text-primary">${basicPrice}</p>
                </div>
                <ul className="mt-7 space-y-3 text-sm text-forest-light">
                  <li className="flex gap-3"><Check className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />60-day active listing</li>
                  <li className="flex gap-3"><Check className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />Standard result placement</li>
                  <li className="flex gap-3"><Check className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />Your application email address or URL</li>
                </ul>
                <TrackedLink
                  href="/post-job?plan=basic&source=employers_hub_pricing"
                  eventName="employer_cta_click"
                  eventParams={{ source: "employers_hub", placement: "pricing", plan: "basic" }}
                  className="btn btn-primary mt-8 w-full justify-center"
                >
                  Choose Basic — ${basicPrice}
                </TrackedLink>
              </article>

              <article className="rounded-lg border border-primary-light/40 bg-white p-7 text-forest shadow-soft-xl sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-display text-2xl">Featured listing</h3>
                    <p className="mt-2 text-sm text-forest-light">More prominent placement in job results</p>
                  </div>
                  <p className="text-4xl font-bold text-primary">${featuredPrice}</p>
                </div>
                <ul className="mt-7 space-y-3 text-sm text-forest-light">
                  <li className="flex gap-3"><Check className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />Everything included with Basic</li>
                  <li className="flex gap-3"><Check className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />Featured label and highlighted listing</li>
                  <li className="flex gap-3"><Check className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />Displayed ahead of Basic listings in results</li>
                </ul>
                <TrackedLink
                  href="/post-job?plan=featured&source=employers_hub_pricing"
                  eventName="employer_cta_click"
                  eventParams={{ source: "employers_hub", placement: "pricing", plan: "featured" }}
                  className="btn btn-primary mt-8 w-full justify-center"
                >
                  Choose Featured — ${featuredPrice}
                </TrackedLink>
              </article>
            </div>
            <p className="mt-6 text-center text-sm text-white/65">
              PlayInDirtJobs does not guarantee a number of views, applications, or hiring outcomes.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-3xl text-forest sm:text-4xl">Employer questions</h2>
            <div className="mt-9 divide-y divide-border border-y border-border">
              {faqs.map((faq) => (
                <article key={faq.question} className="py-6 sm:grid sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-10">
                  <h3 className="font-semibold text-forest">{faq.question}</h3>
                  <p className="mt-3 leading-relaxed text-forest-light sm:mt-0">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-8 rounded-lg border border-primary/20 bg-primary/5 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(360px,1.2fr)]">
          <div>
            <h2 className="font-display text-3xl text-forest">Ready to plan your next hire?</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-forest-light">
              Start one Basic listing for $15, or tell us about several roles, seasonal staffing, or an industry partnership.
            </p>
            <TrackedLink
              href="/post-job?plan=basic&source=employers_hub_final"
              eventName="employer_cta_click"
              eventParams={{ source: "employers_hub", placement: "final", plan: "basic" }}
              className="btn btn-primary mt-6 justify-center"
            >
              Start one listing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </TrackedLink>
          </div>
          <EmployerLeadForm source="employers_hub" />
        </div>
      </section>
    </main>
  );
}
