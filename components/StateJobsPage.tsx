import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmailSubscribe } from "@/components/EmailSubscribe";
import { JobCard } from "@/components/JobCard";
import { getUrl } from "@/lib/metadata";
import { getCachedPublicJobs } from "@/lib/public-jobs";
import { PUBLIC_JOB_CARD_SELECT } from "@/lib/public-job-dto";
import { getStateContent } from "@/lib/state-content";
import { getStateImage } from "@/lib/state-images";

interface StateJobsPageProps {
  stateCode: string;
  stateSlug: string;
}

export function createStateJobsMetadata(stateCode: string, stateSlug: string): Metadata {
  const stateContent = getStateContent(stateCode);
  const stateImage = getStateImage(stateCode);

  if (!stateContent) return {};

  return {
    title: stateContent.metaTitle,
    description: stateContent.metaDescription,
    openGraph: {
      title: stateContent.metaTitle,
      description: stateContent.metaDescription,
      url: getUrl(`${stateSlug}-jobs`),
      siteName: "PlayInDirtJobs",
      locale: "en_US",
      type: "website",
      images: [{ url: stateImage.src, width: 1920, height: 1080, alt: stateImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: stateContent.metaTitle,
      description: stateContent.metaDescription,
      images: [stateImage.src],
    },
    alternates: { canonical: getUrl(`${stateSlug}-jobs`) },
  };
}

export async function StateJobsPage({ stateCode, stateSlug }: StateJobsPageProps) {
  const stateContent = getStateContent(stateCode);

  if (!stateContent) return null;

  const stateImage = getStateImage(stateCode);
  const jobs = await getCachedPublicJobs(`${stateSlug}-jobs`, {
    where: {
      active: true,
      expiresAt: { gte: new Date() },
      OR: [
        { state: { equals: stateCode, mode: "insensitive" } },
        { state: { equals: stateContent.name, mode: "insensitive" } },
      ],
    },
    take: 50,
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
      { id: "asc" },
    ],
    select: PUBLIC_JOB_CARD_SELECT,
  });

  return (
    <main className="min-h-screen bg-earth-cream">
      <section className="relative min-h-[400px] overflow-hidden md:h-[60vh] md:max-h-[700px]">
        <Image
          src={stateImage.src}
          alt={stateImage.alt}
          fill
          className="object-cover"
          priority
          unoptimized
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/65 md:bg-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/55 md:to-black/20" />
        <div className="relative container mx-auto flex min-h-[400px] flex-col justify-end px-4 pb-14 pt-8 md:h-full md:min-h-0 md:pb-14 md:pt-0">
          <Breadcrumbs
            variant="light"
            items={[
              { label: "Jobs", href: "/" },
              { label: `${stateContent.name} Jobs` },
            ]}
          />
          <h1 className="mb-4 font-display text-4xl text-white md:text-5xl lg:text-6xl">
            Farm Jobs in {stateContent.name}
          </h1>
          <p className="mb-6 max-w-3xl text-lg leading-relaxed text-white/85 md:text-xl">
            {stateContent.heroDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            {stateContent.majorCities.slice(0, 8).map((city) => (
              <span key={city} className="rounded-full bg-white/20 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
                {city}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-3 right-4 text-xs text-white/50">
          Illustration by{" "}
          <a href={stateImage.creditUrl} className="underline hover:text-white/80">
            {stateImage.credit}
          </a>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-center gap-3">
              <h2 className="font-display text-2xl text-forest">Farm Jobs in {stateContent.name}</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {jobs.length}
              </span>
            </div>

            {jobs.length > 0 ? (
              <div className="grid gap-4 animate-stagger">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-white py-16 text-center">
                <MapPin className="mx-auto mb-4 h-12 w-12 text-forest-light/30" />
                <p className="mb-2 text-forest-light">No farm jobs in {stateContent.name} right now.</p>
                <p className="mb-6 text-sm text-forest-light/70">New positions are added regularly.</p>
                <Link href="/#jobs" className="btn btn-primary">Browse all jobs</Link>
              </div>
            )}
          </div>

          <aside className="flex-shrink-0 lg:w-80">
            <div className="lg:sticky lg:top-24">
              <EmailSubscribe />
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-border bg-white py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-4 font-display text-2xl text-forest">About Agriculture in {stateContent.name}</h2>
          <p className="mb-8 text-lg leading-relaxed text-forest-light">
            {stateContent.content.introduction.leadParagraph}
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stateContent.content.introduction.stats.map((stat) => (
              <div key={`${stat.value}-${stat.label}`} className="rounded-xl bg-earth-sand/50 p-4 text-center">
                <span className="mb-1 block text-2xl">{stat.emoji}</span>
                <span className="block text-xl font-bold text-forest">{stat.value}</span>
                <span className="text-sm text-forest-light">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-6 font-display text-2xl text-forest">Why Work on {stateContent.name} Farms?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {stateContent.content.whyWork.highlights.map((highlight) => (
              <article key={highlight.title} className="rounded-xl border border-border bg-white p-5">
                <span className="mb-2 block text-2xl">{highlight.emoji}</span>
                <h3 className="mb-1 font-semibold text-forest">{highlight.title}</h3>
                <p className="text-sm text-forest-light">{highlight.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-6 font-display text-2xl text-forest">Types of Farms in {stateContent.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stateContent.content.typesOfFarms.farmTypes.slice(0, 6).map((farm) => (
              <article key={farm.name} className="rounded-xl bg-earth-sand/50 p-5">
                <span className="mb-2 block text-2xl">{farm.emoji}</span>
                <h3 className="mb-1 font-semibold text-forest">{farm.name}</h3>
                <p className="text-sm text-forest-light">{farm.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-8 font-display text-2xl text-forest">Getting Started with Farm Work in {stateContent.name}</h2>
          <ol className="grid gap-6 md:grid-cols-2">
            {stateContent.content.gettingStarted.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div className="pt-1">
                  <h3 className="mb-1 font-semibold text-forest">{step.title}</h3>
                  <p className="text-sm text-forest-light">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {stateContent.relatedStates.length > 0 ? (
        <section className="border-y border-border bg-white py-12">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="mb-6 font-display text-2xl text-forest">Farm Jobs in Nearby States</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {stateContent.relatedStates.slice(0, 6).map((relatedStateCode) => {
                const relatedState = getStateContent(relatedStateCode);
                if (!relatedState) return null;
                const relatedSlug = relatedState.name.toLowerCase().replace(/\s+/g, "-");

                return (
                  <Link key={relatedStateCode} href={`/${relatedSlug}-jobs`} className="card group p-5 transition hover:border-primary/50">
                    <h3 className="flex items-center justify-between font-semibold text-forest group-hover:text-primary">
                      {relatedState.name} Jobs
                      <ArrowRight className="h-4 w-4" />
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-6 font-display text-2xl text-forest">Browse by Job Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              ["/farming-jobs", "Farming Jobs", "Farm hand and crop production positions"],
              ["/gardening-jobs", "Gardening Jobs", "Gardening, greenhouse, and nursery positions"],
              ["/ranch-jobs", "Ranch Jobs", "Ranch hand and livestock management positions"],
            ].map(([href, title, description]) => (
              <Link key={href} href={href} className="card group p-6 transition hover:border-primary/50">
                <h3 className="mb-2 flex items-center justify-between font-semibold text-forest group-hover:text-primary">
                  {title}
                  <ArrowRight className="h-4 w-4" />
                </h3>
                <p className="text-sm text-forest-light">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
