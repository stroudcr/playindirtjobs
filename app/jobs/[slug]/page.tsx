import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { db } from "@/lib/db";
import { MapPin, DollarSign, Briefcase, Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatSalary, formatDate } from "@/lib/utils";
import { BENEFITS, FARM_TYPES, getStateSlug, JOB_CATEGORIES, US_STATES_WITHOUT_DC } from "@/lib/constants";
import type { Metadata } from "next";
import { ShareButton } from "./share-button";
import { getUrl, truncateMetaText } from "@/lib/metadata";
import { isTransientPrismaReadError, logTransientPrismaReadError } from "@/lib/public-jobs";
import { TrackedLink } from "@/components/TrackedLink";
import { getPublicApplicationDestination } from "@/lib/public-application";
import { TrackJobView } from "@/components/TrackJobView";

interface JobPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getJob = cache(async (slug: string) => {
  const job = await db.job.findFirst({
    where: {
      slug,
      active: true,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      company: true,
      description: true,
      city: true,
      state: true,
      postalCode: true,
      remote: true,
      location: true,
      salaryMin: true,
      salaryMax: true,
      salaryType: true,
      jobType: true,
      farmType: true,
      categories: true,
      tags: true,
      benefits: true,
      companyLogo: true,
      companyWebsite: true,
      applyUrl: true,
      applyEmail: true,
      featured: true,
      createdAt: true,
      expiresAt: true,
      origin: true,
      employerId: true,
    },
  });

  return job;
});

function ApplicationCard({
  slug,
  applicationType,
  compact = false,
  className = "",
}: {
  slug: string;
  applicationType: "url" | "email" | null;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={`card ${compact ? "p-4" : "p-6"} ${className}`}>
      <h3 className={`${compact ? "text-lg mb-3" : "text-xl mb-4"} font-display text-forest`}>
        Apply for this job
      </h3>

      {applicationType ? (
        <>
          <TrackedLink
            href={`/jobs/${slug}/apply`}
            eventName="apply_clicked"
            eventParams={{
              job_slug: slug,
              destination_type: applicationType,
            }}
            className={`btn btn-primary bg-gradient-to-r from-primary to-primary-dark w-full justify-center ${compact ? "mb-2 py-3" : "mb-3"}`}
          >
            {applicationType === "url" ? "Apply Now" : "Email Application"}
            <ExternalLink className="w-4 h-4" />
          </TrackedLink>
          <p className="text-xs text-forest-light text-center">
            {applicationType === "url"
              ? "You’ll be redirected to the company’s application page."
              : "This will open your email application."}
          </p>
        </>
      ) : (
        <p className="rounded-lg bg-earth-cream px-4 py-3 text-sm text-forest-light">
          Applications temporarily unavailable
        </p>
      )}
    </div>
  );
}

function EmployerActionCards({
  slug,
  company,
  isClaimable,
  compact = false,
}: {
  slug: string;
  company: string;
  isClaimable: boolean;
  compact?: boolean;
}) {
  const cardPadding = compact ? "p-4" : "p-6";
  const headingSize = compact ? "text-lg mb-2" : "text-xl mb-3";

  return (
    <>
      {isClaimable ? (
        <div className={`card ${cardPadding}`}>
          <h3 className={`${headingSize} font-display text-forest`}>
            Is this your listing?
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-forest-light">
            Claim {company}&apos;s listing to manage its details and application method.
          </p>
          <TrackedLink
            href={`/jobs/${slug}/claim`}
            eventName="claim_started"
            eventParams={{ job_slug: slug, placement: "job_detail" }}
            className="btn w-full justify-center border border-primary bg-white text-primary hover:bg-primary/5"
          >
            Claim this listing
          </TrackedLink>
        </div>
      ) : null}

      <div className={`card border-primary/20 bg-primary/5 ${cardPadding}`}>
        <h3 className={`${headingSize} font-display text-forest`}>
          Hiring for an agricultural role?
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-forest-light">
          Reach people actively looking for farm, ranch, greenhouse, and horticulture work.
        </p>
        <TrackedLink
          href="/employers?utm_source=job_detail&utm_medium=referral&utm_campaign=employer_cta"
          eventName="employer_cta_click"
          eventParams={{ job_slug: slug, placement: "job_detail" }}
          className="btn btn-primary w-full justify-center"
        >
          Post a job
        </TrackedLink>
      </div>
    </>
  );
}

function getLegacyJobRedirect(slug: string): string | null {
  const state = US_STATES_WITHOUT_DC.find((state) =>
    slug.includes(getStateSlug(state.code))
  );

  if (state) {
    return `/${getStateSlug(state.code)}-jobs`;
  }

  if (/(apprentice|apprenticeship|internship|intern)/.test(slug)) {
    return "/farm-apprenticeships";
  }

  if (/(organic|regenerative|permaculture|biodynamic)/.test(slug)) {
    return "/organic-farm-jobs";
  }

  if (/(ranch|livestock|cattle|equine|horse)/.test(slug)) {
    return "/ranch-jobs";
  }

  if (/(garden|gardener|greenhouse|horticulture|nursery|landscape|grower)/.test(slug)) {
    return "/gardening-jobs";
  }

  if (/(farm|agriculture|agricultural|harvest|crop|field)/.test(slug)) {
    return "/farming-jobs";
  }

  return null;
}

function JobTemporarilyUnavailable() {
  return (
    <main className="min-h-screen bg-earth-cream">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl rounded-lg border border-border bg-white p-8 shadow-soft">
          <Link href="/" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all jobs
          </Link>
          <h1 className="text-3xl font-display text-forest mb-4">
            Job Details Temporarily Unavailable
          </h1>
          <p className="text-forest-light leading-relaxed">
            We could not load this job listing because the database is temporarily unreachable. Please try again in a few minutes.
          </p>
        </div>
      </section>
    </main>
  );
}

// Skip static generation - render job pages dynamically at request time
// This ensures the build succeeds even when the database is unreachable
export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const job = await getJob(slug);

    if (!job) {
      return {
        title: "Job Not Found",
        robots: { index: false, follow: false },
      };
    }

    const salaryRange = job.salaryMin && job.salaryMax
      ? `$${job.salaryMin.toLocaleString()}-$${job.salaryMax.toLocaleString()}`
      : "";
    const metaTitle = truncateMetaText(
      `${job.title} at ${job.company} | ${job.location}`,
      60
    );
    const metaDescription = truncateMetaText(
      `Apply for ${job.title} at ${job.company} in ${job.location}. ${salaryRange ? `${salaryRange}. ` : ""}${job.description}`,
      155
    );

    return {
      title: metaTitle,
      description: metaDescription,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: getUrl(`jobs/${job.slug}`),
        type: 'website',
        images: [
          {
            url: job.companyLogo || '/images/PlayInDirtX.png',
            width: 1200,
            height: 630,
            alt: `${job.company} logo`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [job.companyLogo || '/images/PlayInDirtX.png'],
      },
      alternates: {
        canonical: getUrl(`jobs/${job.slug}`),
      },
    };
  } catch (error) {
    if (isTransientPrismaReadError(error)) {
      logTransientPrismaReadError("job-metadata", error);
    } else {
      console.warn('Failed to generate metadata for job:', error);
    }

    return {
      title: "Job Details | PlayInDirt Jobs",
    };
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  let job;

  try {
    job = await getJob(slug);
  } catch (error) {
    if (isTransientPrismaReadError(error)) {
      logTransientPrismaReadError("job-page", error);
      return <JobTemporarilyUnavailable />;
    }

    throw error;
  }

  if (!job) {
    const legacyRedirect = getLegacyJobRedirect(slug);

    if (legacyRedirect) {
      permanentRedirect(legacyRedirect);
    }

    notFound();
  }

  const categoryEmojis = job.categories
    .map(cat => JOB_CATEGORIES.find(c => c.id === cat)?.emoji)
    .filter(Boolean)
    .join(" ");
  const isClaimable = job.origin === "IMPORTED" && !job.employerId;
  const applicationDestination = getPublicApplicationDestination(job);

  // JobPosting Schema for Google Jobs
  const jobUrl = getUrl(`jobs/${job.slug}`);

  // Map job types to Google's expected values
  const mapEmploymentType = (type: string): string => {
    const typeMap: Record<string, string> = {
      'full-time': 'FULL_TIME',
      'part-time': 'PART_TIME',
      'seasonal': 'TEMPORARY',
      'contract': 'CONTRACTOR',
      'apprenticeship': 'INTERN',
      'volunteer': 'VOLUNTEER',
      'internship': 'INTERN',
      'temporary': 'TEMPORARY',
    };
    return typeMap[type] || type.toUpperCase().replace(/-/g, '_');
  };

  // Format description as HTML for better Google parsing
  const descriptionHtml = `<p>${job.description.replace(/\n/g, '</p><p>')}</p>`;

  const jobPostingSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": descriptionHtml,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company,
      "value": job.id
    },
    "datePosted": job.createdAt.toISOString(),
    "validThrough": job.expiresAt.toISOString(),
    "employmentType": job.jobType.map(mapEmploymentType),
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      ...(job.companyWebsite && { "sameAs": job.companyWebsite }),
      ...(job.companyLogo && { "logo": job.companyLogo }),
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.city,
        "addressRegion": job.state,
        ...(job.postalCode && { "postalCode": job.postalCode }),
        "addressCountry": "US"
      }
    },
    ...(job.salaryMin || job.salaryMax ? {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          ...(job.salaryMin && { "minValue": job.salaryMin }),
          ...(job.salaryMax && { "maxValue": job.salaryMax }),
          "unitText": job.salaryType === "hourly" ? "HOUR" : "YEAR"
        }
      }
    } : {}),
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "US"
    },
    ...(job.remote && { "jobLocationType": "TELECOMMUTE" }),
    "directApply": false,
    "industry": "Agriculture",
    "url": jobUrl
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
    <main className="min-h-screen bg-earth-cream">
      <TrackJobView slug={job.slug} />
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-forest-light hover:text-primary mb-4 sm:mb-6 transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Apply section - Mobile Only (at top) */}
          <div className="lg:hidden">
            <ApplicationCard
              slug={job.slug}
              applicationType={applicationDestination?.type ?? null}
              compact
              className="sticky top-20 z-10"
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="card p-4 sm:p-6">
              {job.featured && (
                <div className="mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm font-semibold rounded-full">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Featured Job
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-2 sm:gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-display text-forest mb-2">
                    {job.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-forest-light font-medium">
                    {job.company}
                  </p>
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl flex-shrink-0">{categoryEmojis}</div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm sm:text-base text-forest-light">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm sm:text-base text-forest-light">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-semibold text-primary truncate">
                    {formatSalary(job.salaryMin ?? undefined, job.salaryMax ?? undefined, job.salaryType ?? "annual")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm sm:text-base text-forest-light">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="capitalize truncate">{job.jobType.join(", ").replace(/-/g, " ")}</span>
                </div>

                <div className="flex items-center gap-2 text-sm sm:text-base text-forest-light">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-display text-forest mb-3 sm:mb-4">About this job</h2>
              <div className="prose prose-green max-w-none text-sm sm:text-base text-forest-light whitespace-pre-wrap leading-relaxed">
                {job.description}
              </div>
            </div>

            {/* Tags */}
            <div className="card p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-display text-forest mb-3 sm:mb-4">Tags & Categories</h2>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {job.categories.map((cat) => {
                  const category = JOB_CATEGORIES.find(c => c.id === cat);
                  return category ? (
                    <span
                      key={cat}
                      className="px-3 py-1.5 bg-primary/10 text-primary font-medium rounded-lg text-sm"
                    >
                      {category.emoji} {category.label}
                    </span>
                  ) : null;
                })}
                {job.farmType.map((type) => {
                  const farmType = FARM_TYPES.find(f => f.id === type);
                  return farmType ? (
                    <span
                      key={type}
                      className="px-3 py-1.5 bg-secondary/10 text-secondary font-medium rounded-lg text-sm"
                    >
                      {farmType.emoji} {farmType.label}
                    </span>
                  ) : null;
                })}
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-accent-blue/10 text-accent-blue font-medium rounded-lg text-sm capitalize"
                  >
                    {tag.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Apply section */}
              <ApplicationCard
                slug={job.slug}
                applicationType={applicationDestination?.type ?? null}
              />

              {/* Benefits */}
              {job.benefits.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-xl font-display text-forest mb-4">Benefits</h3>
                  <ul className="space-y-3">
                    {job.benefits.map((benefitId) => {
                      const benefit = BENEFITS.find(b => b.id === benefitId);
                      return benefit ? (
                        <li key={benefitId} className="flex items-center gap-2 text-forest-light">
                          <span className="text-xl">{benefit.emoji}</span>
                          <span>{benefit.label}</span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}

              {/* Company info */}
              <div className="card p-6">
                <h3 className="text-xl font-display text-forest mb-4">About {job.company}</h3>
                {job.companyWebsite && (
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 mb-3"
                  >
                    Visit website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <EmployerActionCards
                slug={job.slug}
                company={job.company}
                isClaimable={isClaimable}
              />

              {/* Share */}
              <div className="card p-6">
                <h3 className="text-xl font-display text-forest mb-4">Share this job</h3>
                <div className="flex gap-2">
                  <ShareButton />
                </div>
              </div>
            </div>
          </div>

          {/* Benefits & Company Info - Mobile Only */}
          <div className="lg:hidden lg:col-span-2 space-y-4">
            {/* Benefits */}
            {job.benefits.length > 0 && (
              <div className="card p-4">
                <h3 className="text-lg font-display text-forest mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {job.benefits.map((benefitId) => {
                    const benefit = BENEFITS.find(b => b.id === benefitId);
                    return benefit ? (
                      <li key={benefitId} className="flex items-center gap-2 text-sm text-forest-light">
                        <span className="text-lg">{benefit.emoji}</span>
                        <span>{benefit.label}</span>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            )}

            {/* Company info */}
            <div className="card p-4">
              <h3 className="text-lg font-display text-forest mb-3">About {job.company}</h3>
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 mb-2 text-sm py-2"
                >
                  Visit website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <EmployerActionCards
              slug={job.slug}
              company={job.company}
              isClaimable={isClaimable}
              compact
            />

            {/* Share */}
            <div className="card p-4">
              <h3 className="text-lg font-display text-forest mb-3">Share this job</h3>
              <div className="flex gap-2">
                <ShareButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
