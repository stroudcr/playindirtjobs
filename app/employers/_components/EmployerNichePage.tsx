import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardCheck,
  ExternalLink,
  MapPin,
  Sprout,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TrackPageView } from "@/components/TrackPageView";
import { TrackedLink } from "@/components/TrackedLink";
import { getUrl } from "@/lib/metadata";
import { employerNicheList, type EmployerNicheConfig } from "../content";

type EmployerNichePageProps = {
  config: EmployerNicheConfig;
};

const postingSteps = [
  ["Define the role", "Add the title, location, job type, and dates."],
  ["Describe the work", "Explain responsibilities, compensation, requirements, and benefits."],
  ["Choose applications", "Send candidates to your application email or website."],
  ["Preview and pay", "Select Basic or Featured, review the listing, and complete checkout."],
] as const;

function postHref(config: EmployerNicheConfig, plan: "basic" | "featured", placement: string) {
  return `/post-job?plan=${plan}&source=${config.source}_${placement}`;
}

function JsonLd({ config }: { config: EmployerNicheConfig }) {
  const pageUrl = getUrl(config.slug);
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: config.title,
        description: config.description,
        isPartOf: {
          "@type": "WebSite",
          name: "PlayInDirtJobs",
          url: getUrl(),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: getUrl(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "For Employers",
            item: getUrl("employers"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: config.navLabel,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: config.faqs.map((faq) => ({
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

export function EmployerNichePage({ config }: EmployerNichePageProps) {
  const relatedNiches = employerNicheList.filter((niche) => niche.slug !== config.slug);

  return (
    <main className="min-h-screen bg-earth-cream">
      <JsonLd config={config} />
      <TrackPageView
        eventName="employer_landing_view"
        eventParams={{ landing_page: `/${config.slug}`, niche: config.source }}
      />

      <section className="border-b border-border bg-gradient-to-b from-white to-earth-sand">
        <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "For Employers", href: "/employers" },
                { label: config.navLabel },
              ]}
            />

            <div className="mt-7 grid items-center gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)] lg:gap-14">
              <div>
                <h1 className="max-w-4xl text-balance font-display text-4xl leading-[1.08] text-forest sm:text-5xl lg:text-6xl">
                  {config.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-forest-light sm:text-xl">
                  {config.heroBody}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <TrackedLink
                    href={postHref(config, "basic", "hero")}
                    eventName="employer_cta_click"
                    eventParams={{ source: config.source, placement: "hero", plan: "basic" }}
                    className="btn btn-primary justify-center sm:justify-start"
                  >
                    Post a job for $15
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </TrackedLink>
                  <TrackedLink
                    href={postHref(config, "featured", "hero")}
                    eventName="employer_cta_click"
                    eventParams={{ source: config.source, placement: "hero", plan: "featured" }}
                    className="btn btn-outline justify-center sm:justify-start"
                  >
                    Choose Featured — $25
                  </TrackedLink>
                </div>
                <p className="mt-4 text-sm text-forest-light">
                  One payment. Both plans stay active for 60 days. No automatic renewal.
                </p>
              </div>

              <aside className="card overflow-hidden" aria-label="Job posting plan summary">
                <div className="border-b border-border bg-forest px-6 py-5 text-white">
                  <p className="font-display text-2xl">Simple posting terms</p>
                  <p className="mt-1 text-sm text-white/75">Choose the placement that fits this opening.</p>
                </div>
                <div className="divide-y divide-border px-6">
                  <div className="flex items-start justify-between gap-5 py-5">
                    <div>
                      <p className="font-semibold text-forest">Basic</p>
                      <p className="mt-1 text-sm text-forest-light">Standard job-result placement</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">$15</p>
                  </div>
                  <div className="flex items-start justify-between gap-5 py-5">
                    <div>
                      <p className="font-semibold text-forest">Featured</p>
                      <p className="mt-1 text-sm text-forest-light">Highlighting and priority placement</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">$25</p>
                  </div>
                  <div className="flex items-center gap-3 py-5 text-sm text-forest-light">
                    <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Every listing remains active for 60 days.</span>
                  </div>
                  <div className="flex items-center gap-3 py-5 text-sm text-forest-light">
                    <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Listings can be viewed nationwide.</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-20">
          <div>
            <h2 className="text-balance font-display text-3xl text-forest sm:text-4xl">
              {config.hiringTitle}
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-forest-light">
              {config.hiringBody.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              href={config.browseHref}
              className="mt-7 inline-flex items-center gap-2 font-medium text-primary hover:text-primary-dark"
            >
              {config.browseLabel}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="border-l-2 border-primary/25 pl-6 sm:pl-8">
            <p className="font-display text-2xl text-forest">Roles you can post</p>
            <ul className="mt-6 space-y-4">
              {config.roles.map((role) => (
                <li key={role} className="flex items-start gap-3 text-forest-light">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                  <span>{role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <h2 className="text-balance font-display text-3xl text-forest sm:text-4xl">
                Details that help candidates understand the job
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-forest-light">
                A specific listing helps people decide whether the location, schedule, and work fit before they apply.
              </p>
            </div>
            <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {config.checklist.map((item, index) => (
                <article key={item.title} className="flex gap-4 border-t border-border pt-6">
                  <span className="font-display text-2xl text-primary" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-forest">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-forest-light">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex max-w-3xl items-start gap-4">
            <ClipboardCheck className="mt-1 h-8 w-8 flex-shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-display text-3xl text-forest sm:text-4xl">Post in four clear steps</h2>
              <p className="mt-4 text-lg leading-relaxed text-forest-light">
                Preview the complete listing before payment and choose where candidates should apply.
              </p>
            </div>
          </div>

          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {postingSteps.map(([title, body], index) => (
              <li key={title} className="card p-6">
                <span className="text-sm font-semibold text-primary">Step {index + 1}</span>
                <h3 className="mt-3 font-display text-xl text-forest">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-forest-light">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-forest py-14 text-white md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-balance font-display text-3xl sm:text-4xl">
                One opening, 60 days of listing time
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
                Basic costs $15. Featured costs $25 and adds highlighting, a Featured label, and placement ahead of Basic listings in job results.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <TrackedLink
                href={postHref(config, "basic", "pricing")}
                eventName="employer_cta_click"
                eventParams={{ source: config.source, placement: "pricing", plan: "basic" }}
                className="btn justify-center bg-white text-forest hover:bg-earth-sand"
              >
                Choose Basic — $15
              </TrackedLink>
              <TrackedLink
                href={postHref(config, "featured", "pricing")}
                eventName="employer_cta_click"
                eventParams={{ source: config.source, placement: "pricing", plan: "featured" }}
                className="btn justify-center border border-white/35 text-white hover:bg-white/10"
              >
                Choose Featured — $25
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3">
              <Sprout className="h-7 w-7 text-primary" aria-hidden="true" />
              <h2 className="font-display text-3xl text-forest sm:text-4xl">Frequently asked questions</h2>
            </div>
            <div className="mt-9 divide-y divide-border border-y border-border">
              {config.faqs.map((faq) => (
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
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl text-forest">More employer hiring guides</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {relatedNiches.map((niche) => (
              <Link
                key={niche.slug}
                href={`/${niche.slug}`}
                className="group flex min-h-28 items-center justify-between gap-5 rounded-lg border border-border bg-white p-5 shadow-soft transition-all hover:border-primary/30 hover:shadow-soft-lg"
              >
                <span className="font-display text-lg text-forest transition-colors group-hover:text-primary">
                  Hire {niche.navLabel.toLowerCase()}
                </span>
                <ArrowRight className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
              </Link>
            ))}
          </div>

          <div className="mt-14 rounded-lg border border-primary/20 bg-primary/5 px-6 py-9 text-center sm:px-10">
            <h2 className="font-display text-3xl text-forest">Ready to publish this opening?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-forest-light">
              Start a 60-day listing and choose the application destination that works for your operation.
            </p>
            <TrackedLink
              href={postHref(config, "basic", "final")}
              eventName="employer_cta_click"
              eventParams={{ source: config.source, placement: "final", plan: "basic" }}
              className="btn btn-primary mt-7 justify-center"
            >
              Start a Basic listing — $15
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
