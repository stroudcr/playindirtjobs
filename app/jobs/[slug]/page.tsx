import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { MapPin, DollarSign, Briefcase, Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatSalary, formatDate } from "@/lib/utils";
import { JOB_CATEGORIES, FARM_TYPES, BENEFITS } from "@/lib/constants";
import type { Metadata } from "next";

interface JobPageProps {
  params: {
    slug: string;
  };
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

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const job = await getJob(params.slug);

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: `${job.title} at ${job.company} | PlayInDirtJobs`,
    description: job.description.slice(0, 155),
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const job = await getJob(params.slug);

  if (!job) {
    notFound();
  }

  const categoryEmojis = job.categories
    .map(cat => JOB_CATEGORIES.find(c => c.id === cat)?.emoji)
    .filter(Boolean)
    .join(" ");

  return (
    <main className="min-h-screen bg-earth-cream">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-forest-light hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="card p-6">
              {job.featured && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-sm font-semibold rounded">
                    ⭐ Featured Job
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-forest mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-forest-light font-medium">
                    {job.company}
                  </p>
                </div>
                <div className="text-5xl">{categoryEmojis}</div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-forest-light">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center gap-2 text-forest-light">
                  <DollarSign className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-primary">
                    {formatSalary(job.salaryMin ?? undefined, job.salaryMax ?? undefined)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-forest-light">
                  <Briefcase className="w-5 h-5 flex-shrink-0" />
                  <span className="capitalize">{job.jobType.join(", ").replace(/-/g, " ")}</span>
                </div>

                <div className="flex items-center gap-2 text-forest-light">
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-forest mb-4">About this job</h2>
              <div className="prose prose-green max-w-none text-forest-light whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Tags */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-forest mb-4">Tags & Categories</h2>
              <div className="flex flex-wrap gap-2">
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
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
                  You'll be redirected to the company's application page
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
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }}
                    className="btn btn-secondary flex-1 justify-center text-sm"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
