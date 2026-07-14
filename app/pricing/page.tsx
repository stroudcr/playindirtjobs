import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, CreditCard, FileCheck, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TrackedLink } from "@/components/TrackedLink";
import { PRICING } from "@/lib/constants";
import { getUrl } from "@/lib/metadata";

const basicPrice = PRICING.BASIC / 100;
const featuredPrice = PRICING.FEATURED / 100;

export const metadata: Metadata = {
  title: "Agricultural Job Posting Pricing | PlayInDirtJobs",
  description:
    "Post one agricultural job for 60 days. Basic listings cost $15 and Featured listings cost $25, with no subscription or automatic renewal.",
  keywords: [
    "farm job posting cost",
    "agricultural job board pricing",
    "post farm jobs",
    "agriculture recruitment pricing",
  ],
  alternates: { canonical: getUrl("pricing") },
  openGraph: {
    title: "Agricultural Job Posting Pricing | PlayInDirtJobs",
    description:
      "Choose a $15 Basic or $25 Featured agricultural job listing. Both plans stay active for 60 days.",
    url: getUrl("pricing"),
    siteName: "PlayInDirtJobs",
    type: "website",
    images: [
      {
        url: "/images/PlayInDirtX.png",
        width: 1200,
        height: 630,
        alt: "PlayInDirtJobs agricultural job posting pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agricultural Job Posting Pricing | PlayInDirtJobs",
    description:
      "Choose a $15 Basic or $25 Featured agricultural job listing. Both plans stay active for 60 days.",
    images: ["/images/PlayInDirtX.png"],
  },
};

const faqs = [
  {
    question: "How long does a listing stay active?",
    answer:
      "Basic and Featured listings remain active for 60 days from publication. You can deactivate a listing earlier if the position is filled.",
  },
  {
    question: "Is this a subscription?",
    answer:
      "No. Each purchase covers one 60-day job listing. There are no recurring charges or automatic renewals.",
  },
  {
    question: "Can I edit the listing after it is published?",
    answer:
      "Yes. Use the secure management link sent to the employer email to edit or deactivate an active listing.",
  },
  {
    question: "What does Featured placement mean?",
    answer:
      "Featured listings have a highlighted treatment and Featured label and are displayed ahead of Basic listings in job result lists.",
  },
  {
    question: "How do applicants contact me?",
    answer:
      "Choose an application email address or an application page on your website. The job listing directs candidates to that destination.",
  },
  {
    question: "Are hiring results guaranteed?",
    answer:
      "No. PlayInDirtJobs provides the listing and application path but does not guarantee a number of views, applications, or hiring outcomes.",
  },
];

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${getUrl("pricing")}#job-posting`,
        name: "PlayInDirtJobs job posting",
        description: "A 60-day agricultural job listing on PlayInDirtJobs.",
        offers: [
          {
            "@type": "Offer",
            name: "Basic job listing",
            price: basicPrice.toFixed(2),
            priceCurrency: "USD",
            url: getUrl("post-job?plan=basic&source=pricing_schema"),
          },
          {
            "@type": "Offer",
            name: "Featured job listing",
            price: featuredPrice.toFixed(2),
            priceCurrency: "USD",
            url: getUrl("post-job?plan=featured&source=pricing_schema"),
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
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-earth-cream">
      <JsonLd />

      <section className="border-b border-border bg-gradient-to-b from-white to-earth-sand py-10 sm:py-14 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pricing" }]} />
            <div className="mt-7 max-w-4xl">
              <h1 className="text-balance font-display text-4xl leading-[1.06] text-forest sm:text-5xl lg:text-6xl">
                One job. One payment. 60 days.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-forest-light sm:text-xl">
                Choose standard or Featured placement for one agricultural job. There is no subscription, recurring charge, or automatic renewal.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-forest-light">
              <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />60-day listing</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" aria-hidden="true" />Visible nationwide</span>
              <span className="inline-flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />Checkout powered by Stripe</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <article className="card flex flex-col p-7 sm:p-9">
            <div className="flex items-start justify-between gap-6 border-b border-border pb-7">
              <div>
                <h2 className="font-display text-3xl text-forest">Basic</h2>
                <p className="mt-2 text-sm text-forest-light">Standard placement for one opening</p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold text-primary">${basicPrice}</p>
                <p className="mt-1 text-xs text-forest-light">one payment</p>
              </div>
            </div>
            <ul className="mt-7 flex-1 space-y-4 text-forest-light">
              <li className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" /><span>Active for 60 days</span></li>
              <li className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" /><span>Standard placement in job results</span></li>
              <li className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" /><span>Application email address or application URL</span></li>
              <li className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" /><span>Edit or deactivate during the active period</span></li>
            </ul>
            <TrackedLink
              href="/post-job?plan=basic&source=pricing_basic"
              eventName="employer_cta_click"
              eventParams={{ source: "pricing", placement: "plan_card", plan: "basic" }}
              className="btn btn-primary mt-9 w-full justify-center"
            >
              Choose Basic — ${basicPrice}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </TrackedLink>
          </article>

          <article className="card flex flex-col overflow-hidden border-2 border-primary/40 p-7 sm:p-9">
            <div className="-mx-9 -mt-9 mb-8 h-1 bg-gradient-to-r from-primary via-primary-light to-accent-yellow" aria-hidden="true" />
            <div className="flex items-start justify-between gap-6 border-b border-border pb-7">
              <div>
                <h2 className="font-display text-3xl text-forest">Featured</h2>
                <p className="mt-2 text-sm text-forest-light">More prominent placement for one opening</p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold text-primary">${featuredPrice}</p>
                <p className="mt-1 text-xs text-forest-light">one payment</p>
              </div>
            </div>
            <ul className="mt-7 flex-1 space-y-4 text-forest-light">
              <li className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" /><span>Everything included with Basic</span></li>
              <li className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" /><span>Featured label and highlighted listing treatment</span></li>
              <li className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" /><span>Displayed ahead of Basic listings in job result lists</span></li>
              <li className="flex items-start gap-3"><Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" /><span>Active for the same 60-day period</span></li>
            </ul>
            <TrackedLink
              href="/post-job?plan=featured&source=pricing_featured"
              eventName="employer_cta_click"
              eventParams={{ source: "pricing", placement: "plan_card", plan: "featured" }}
              className="btn btn-primary mt-9 w-full justify-center"
            >
              Choose Featured — ${featuredPrice}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </TrackedLink>
          </article>
        </div>

        <p className="mx-auto mt-7 max-w-3xl text-center text-sm leading-relaxed text-forest-light">
          PlayInDirtJobs does not guarantee a number of views, applications, or hiring outcomes.
        </p>
      </section>

      <section className="border-y border-border bg-white py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
              <div>
                <FileCheck className="h-9 w-9 text-primary" aria-hidden="true" />
                <h2 className="mt-5 font-display text-3xl text-forest sm:text-4xl">What happens after checkout</h2>
                <p className="mt-4 leading-relaxed text-forest-light">
                  Your application destination stays under your control, and the employer email receives the secure management link.
                </p>
              </div>
              <ol className="divide-y divide-border border-y border-border">
                {[
                  ["Payment completes", "Checkout is processed by Stripe."],
                  ["The listing is published", "The job becomes available in PlayInDirtJobs results."],
                  ["Candidates follow your application path", "They use the email address or website you provided."],
                  ["You manage the listing", "Use the secure link sent to the employer email to edit or deactivate it."],
                ].map(([title, body], index) => (
                  <li key={title} className="flex gap-5 py-5">
                    <span className="font-display text-xl text-primary">0{index + 1}</span>
                    <div>
                      <h3 className="font-semibold text-forest">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-forest-light">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl text-forest sm:text-4xl">Pricing questions</h2>
          <div className="mt-9 divide-y divide-border border-y border-border">
            {faqs.map((faq) => (
              <article key={faq.question} className="py-6 sm:grid sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-10">
                <h3 className="font-semibold text-forest">{faq.question}</h3>
                <p className="mt-3 leading-relaxed text-forest-light sm:mt-0">{faq.answer}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-forest-light">
            For payment and refund terms, review the <Link href="/terms" className="font-medium text-primary hover:underline">Terms of Service</Link>.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-7 rounded-lg bg-forest px-7 py-10 text-center text-white sm:px-10 lg:flex-row lg:text-left">
          <div>
            <h2 className="font-display text-3xl">Ready to post this opening?</h2>
            <p className="mt-3 text-white/75">Start a Basic listing for ${basicPrice} and review everything before checkout.</p>
          </div>
          <TrackedLink
            href="/post-job?plan=basic&source=pricing_final"
            eventName="employer_cta_click"
            eventParams={{ source: "pricing", placement: "final", plan: "basic" }}
            className="btn flex-shrink-0 justify-center bg-white text-forest hover:bg-earth-sand"
          >
            Start a listing
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </TrackedLink>
        </div>
      </section>
    </main>
  );
}
