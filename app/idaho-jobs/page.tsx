import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { JobCard } from "@/components/JobCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmailSubscribe } from "@/components/EmailSubscribe";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ArrowRight, MapPin } from "lucide-react";
import { getUrl } from "@/lib/metadata";
import { getStateContent } from "@/lib/state-content";
import { getStateImage } from "@/lib/state-images";

export const dynamic = 'force-dynamic';

const STATE_CODE = 'ID';
const stateContent = getStateContent(STATE_CODE)!;
const stateImage = getStateImage(STATE_CODE);

export const metadata: Metadata = {
  title: stateContent.metaTitle,
  description: stateContent.metaDescription,
  openGraph: {
    title: stateContent.metaTitle,
    description: stateContent.metaDescription,
    url: getUrl("idaho-jobs"),
    siteName: 'PlayInDirtJobs',
    locale: 'en_US',
    type: 'website',
    images: [{ url: stateImage.src, width: 1920, height: 1080, alt: stateImage.alt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: stateContent.metaTitle,
    description: stateContent.metaDescription,
    images: [stateImage.src],
  },
  alternates: {
    canonical: getUrl("idaho-jobs"),
  },
};

export default async function IdahoJobsPage() {
  const jobs = await db.job.findMany({
    where: {
      active: true,
      expiresAt: { gte: new Date() },
      OR: [
        { state: { equals: STATE_CODE, mode: "insensitive" } },
        { state: { equals: stateContent.name, mode: "insensitive" } },
      ],
    },
    take: 50,
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <>
      <main className="min-h-screen bg-earth-cream">
        {/* Hero Section - Full-Bleed Image */}
        <section className="relative h-[50vh] md:h-[60vh] min-h-[400px] max-h-[700px] overflow-hidden">
          <Image
            src={stateImage.src}
            alt={stateImage.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/20" />
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-10 md:pb-14">
            <Breadcrumbs
              variant="light"
              items={[
                { label: "Home", href: "/" },
                { label: "Jobs", href: "/" },
                { label: `${stateContent.name} Jobs` }
              ]}
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-4">
              Farm Jobs in {stateContent.name}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed mb-6">
              {stateContent.heroDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {stateContent.majorCities.slice(0, 8).map((city) => (
                <span key={city} className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                  {city}
                </span>
              ))}
            </div>
          </div>
          {/* Photo Credit */}
          <div className="absolute bottom-3 right-4 text-white/40 text-xs">
            Photo by{" "}
            <a href={stateImage.creditUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">
              {stateImage.credit}
            </a>
          </div>
        </section>

        {/* Job Listings - Two Column */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-display text-forest">
                  Farm Jobs in {stateContent.name}
                </h2>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  {jobs.length}
                </span>
              </div>

              {jobs.length > 0 ? (
                <div className="grid gap-4 animate-stagger">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={{
                        ...job,
                        salaryMin: job.salaryMin ?? undefined,
                        salaryMax: job.salaryMax ?? undefined,
                        salaryType: job.salaryType ?? undefined,
                        createdAt: new Date(job.createdAt),
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-border">
                  <MapPin className="w-12 h-12 text-forest-light/30 mx-auto mb-4" />
                  <p className="text-forest-light mb-2">No farm jobs in {stateContent.name} right now.</p>
                  <p className="text-sm text-forest-light/70 mb-6">New positions are added regularly — check back soon!</p>
                  <Link href="/" className="btn btn-primary">
                    Browse All Jobs
                  </Link>
                </div>
              )}
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <EmailSubscribe />
              </div>
            </div>
          </div>
        </section>

        {/* State Quick Facts */}
        <section className="bg-white border-y border-border py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-display text-forest mb-4">About Agriculture in {stateContent.name}</h2>
            <p className="text-lg text-forest-light leading-relaxed mb-8">
              {stateContent.content.introduction.leadParagraph}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stateContent.content.introduction.stats.map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-earth-sand/50">
                  <span className="text-2xl mb-1 block">{stat.emoji}</span>
                  <span className="text-xl font-bold text-forest block">{stat.value}</span>
                  <span className="text-sm text-forest-light">{stat.label}</span>
                </div>
              ))}
            </div>

            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1">
                Read full overview
                <ChevronIcon />
              </summary>
              <div className="prose prose-green max-w-none text-forest-light mt-4">
                <p>{stateContent.content.introduction.fullText}</p>
              </div>
            </details>
          </div>
        </section>

        {/* Why Work Here */}
        <section className="bg-earth-cream py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-display text-forest mb-6">Why Work on {stateContent.name} Farms?</h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {stateContent.content.whyWork.highlights.map((highlight, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-border">
                  <span className="text-2xl mb-2 block">{highlight.emoji}</span>
                  <h3 className="font-semibold text-forest mb-1">{highlight.title}</h3>
                  <p className="text-sm text-forest-light">{highlight.description}</p>
                </div>
              ))}
            </div>

            {stateContent.content.whyWork.pullQuote && (
              <blockquote className="border-l-4 border-primary pl-5 py-2 mb-8 text-lg text-forest italic">
                {stateContent.content.whyWork.pullQuote}
              </blockquote>
            )}

            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1">
                Read full details
                <ChevronIcon />
              </summary>
              <div className="prose prose-green max-w-none text-forest-light mt-4">
                <p>{stateContent.content.whyWork.fullText}</p>
              </div>
            </details>
          </div>
        </section>

        {/* Types of Farms */}
        <section className="bg-white border-y border-border py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-display text-forest mb-6">Types of Farms in {stateContent.name}</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {stateContent.content.typesOfFarms.farmTypes.map((farm, i) => (
                <div key={i} className="bg-earth-sand/50 rounded-xl p-5 hover:bg-earth-sand transition-colors">
                  <span className="text-2xl mb-2 block">{farm.emoji}</span>
                  <h3 className="font-semibold text-forest mb-1">{farm.name}</h3>
                  <p className="text-sm text-forest-light">{farm.description}</p>
                </div>
              ))}
            </div>

            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1">
                Read full details
                <ChevronIcon />
              </summary>
              <div className="prose prose-green max-w-none text-forest-light mt-4">
                <p>{stateContent.content.typesOfFarms.fullText}</p>
              </div>
            </details>
          </div>
        </section>

        {/* Getting Started */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-display text-forest mb-8">Getting Started with Farm Work in {stateContent.name}</h2>

            <div className="space-y-6 mb-8">
              {stateContent.content.gettingStarted.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold text-forest mb-1">{step.title}</h3>
                    <p className="text-sm text-forest-light">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 md:p-8 text-white">
              <h3 className="text-xl font-display mb-2">Ready to start your agricultural career?</h3>
              <p className="text-white/80 mb-4">Browse open positions in {stateContent.name} and apply today.</p>
              <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors">
                Browse All Jobs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <details className="group mt-8">
              <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1">
                Read full guide
                <ChevronIcon />
              </summary>
              <div className="prose prose-green max-w-none text-forest-light mt-4">
                <p>{stateContent.content.gettingStarted.fullText}</p>
              </div>
            </details>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="bg-white border-y border-border py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-display text-forest mb-6">Frequently Asked Questions</h2>
            <FaqAccordion faqs={stateContent.faqs} />
          </div>
        </section>

        {/* Related States */}
        {stateContent.relatedStates.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-display text-forest mb-6">Farm Jobs in Nearby States</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl">
              {stateContent.relatedStates.slice(0, 6).map((stateCode) => {
                const relatedState = getStateContent(stateCode);
                if (!relatedState) return null;
                const slug = relatedState.name.toLowerCase().replace(/\s+/g, '-');
                const relatedImage = getStateImage(stateCode);
                return (
                  <Link key={stateCode} href={`/${slug}-jobs`} className="card overflow-hidden hover:border-primary/50 transition group">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={relatedImage.src}
                        alt={relatedImage.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-forest group-hover:text-primary flex items-center justify-between">
                        {relatedState.name} Farm Jobs
                        <ArrowRight className="w-4 h-4" />
                      </h3>
                      <p className="text-sm text-forest-light mt-1">Browse agricultural positions in {relatedState.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Categories */}
        <section className="bg-white border-t border-border py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-display text-forest mb-6">Browse by Job Category</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/farming-jobs" className="card p-6 hover:border-primary/50 transition group">
                <h3 className="font-semibold text-forest mb-2 group-hover:text-primary flex items-center justify-between">
                  Farming Jobs
                  <ArrowRight className="w-4 h-4" />
                </h3>
                <p className="text-sm text-forest-light">Farm hand and crop production positions</p>
              </Link>
              <Link href="/gardening-jobs" className="card p-6 hover:border-primary/50 transition group">
                <h3 className="font-semibold text-forest mb-2 group-hover:text-primary flex items-center justify-between">
                  Gardening Jobs
                  <ArrowRight className="w-4 h-4" />
                </h3>
                <p className="text-sm text-forest-light">Professional gardener and horticulture positions</p>
              </Link>
              <Link href="/ranch-jobs" className="card p-6 hover:border-primary/50 transition group">
                <h3 className="font-semibold text-forest mb-2 group-hover:text-primary flex items-center justify-between">
                  Ranch Jobs
                  <ArrowRight className="w-4 h-4" />
                </h3>
                <p className="text-sm text-forest-light">Ranch hand and livestock management careers</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* JSON-LD - FAQPage only (Breadcrumbs component handles BreadcrumbList) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": stateContent.faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </>
  );
}

function ChevronIcon() {
  return (
    <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
