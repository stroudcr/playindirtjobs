import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { MapPin, DollarSign, Briefcase, Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatSalary, formatDate } from "@/lib/utils";
import { JOB_CATEGORIES, FARM_TYPES, BENEFITS } from "@/lib/constants";
import type { Metadata } from "next";
import { ShareButton } from "./share-button";
import { getUrl } from "@/lib/metadata";

interface JobPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getJob(slug: string) {
  const job = await db.job.findUnique({
    where: { slug },
  });

  if (!job || !job.active || job.expiresAt < new Date()) {
    return null;
  }

  // Increment views
  await db.job.update({
    where: { id: job.id },
    data: { views: { increment: 1 } },
  });

  return job;
}

export async function generateStaticParams() {
  // Generate static params for all active jobs at build time
  const jobs = await db.job.findMany({
    where: {
      active: true,
      expiresAt: {
        gte: new Date(),
      },
    },
    select: {
      slug: true,
    },
  });

  return jobs.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  const salaryRange = job.salaryMin && job.salaryMax
    ? `$${job.salaryMin.toLocaleString()}-$${job.salaryMax.toLocaleString()}`
    : "";

  return {
    title: `${job.title} - ${job.company} | ${job.location} ${job.jobType.includes('full-time') ? 'Full-Time' : ''} Jobs`,
    description: `${job.title} at ${job.company} in ${job.location}. ${salaryRange ? salaryRange + '. ' : ''}${job.description.slice(0, 120)}...`,
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: job.description.slice(0, 155),
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
      title: `${job.title} at ${job.company}`,
      description: job.description.slice(0, 155),
      images: [job.companyLogo || '/images/PlayInDirtX.png'],
    },
    alternates: {
      canonical: getUrl(`jobs/${job.slug}`),
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  const categoryEmojis = job.categories
    .map(cat => JOB_CATEGORIES.find(c => c.id === cat)?.emoji)
    .filter(Boolean)
    .join(" ");

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
            <div className="card p-4 sticky top-20 z-10">
              <h3 className="text-lg font-bold text-forest mb-3">Apply for this job</h3>

              {job.applyUrl && (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full justify-center mb-2 py-3"
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {job.applyEmail && !job.applyUrl && (
                <a
                  href={`mailto:${job.applyEmail}`}
                  className="btn btn-primary w-full justify-center mb-2 py-3"
                >
                  Email Application
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <p className="text-xs text-forest-light text-center">
                You&apos;ll be redirected to the company&apos;s application page
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="card p-4 sm:p-6">
              {job.featured && (
                <div className="mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-xs sm:text-sm font-semibold rounded">
                    ⭐ Featured Job
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-2 sm:gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-forest mb-2">
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
              <h2 className="text-xl sm:text-2xl font-bold text-forest mb-3 sm:mb-4">About this job</h2>
              <div className="prose prose-green max-w-none text-sm sm:text-base text-forest-light whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Tags */}
            <div className="card p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-forest mb-3 sm:mb-4">Tags & Categories</h2>
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
              <div className="card p-6">
                <h3 className="text-xl font-bold text-forest mb-4">Apply for this job</h3>

                {job.applyUrl && (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full justify-center mb-3"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {job.applyEmail && !job.applyUrl && (
                  <a
                    href={`mailto:${job.applyEmail}`}
                    className="btn btn-primary w-full justify-center mb-3"
                  >
                    Email Application
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <p className="text-xs text-forest-light text-center">
                  You&apos;ll be redirected to the company&apos;s application page
                </p>
              </div>

              {/* Benefits */}
              {job.benefits.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-xl font-bold text-forest mb-4">Benefits</h3>
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
                <h3 className="text-xl font-bold text-forest mb-4">About {job.company}</h3>
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
                <p className="text-sm text-forest-light">
                  Contact: {job.companyEmail}
                </p>
              </div>

              {/* Share */}
              <div className="card p-6">
                <h3 className="text-xl font-bold text-forest mb-4">Share this job</h3>
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
                <h3 className="text-lg font-bold text-forest mb-3">Benefits</h3>
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
              <h3 className="text-lg font-bold text-forest mb-3">About {job.company}</h3>
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
              <p className="text-sm text-forest-light">
                Contact: {job.companyEmail}
              </p>
            </div>

            {/* Share */}
            <div className="card p-4">
              <h3 className="text-lg font-bold text-forest mb-3">Share this job</h3>
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
