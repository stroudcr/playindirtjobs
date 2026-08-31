'use client';

import React from "react";
import {
  Briefcase,
  Calendar,
  DollarSign,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
} from "lucide-react";

import {
  BENEFITS,
  FARM_TYPES,
  JOB_CATEGORIES,
  JOB_TYPES,
  TAGS,
} from "@/lib/constants";
import { formatSalary } from "@/lib/utils";

interface LiveJobPreviewProps {
  data: {
    title: string;
    company: string;
    city: string;
    state: string;
    postalCode?: string;
    remote?: boolean;
    description: string;
    salaryMin: string;
    salaryMax: string;
    salaryType: "annual" | "hourly";
    jobType: string[];
    farmType: string[];
    categories: string[];
    tags: string[];
    benefits: string[];
    companyWebsite: string;
    companyLogo: string;
    applyUrl: string;
    applyEmail: string;
  };
  featured?: boolean;
}

const AVATAR_COLORS = [
  "bg-primary/10 text-emerald-700",
  "bg-secondary/10 text-secondary-dark",
  "bg-accent-blue/10 text-sky-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

function getAvatarColor(company: string) {
  let hash = 0;
  for (let index = 0; index < company.length; index += 1) {
    hash = company.charCodeAt(index) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function salaryAmount(value: string) {
  if (!/^\d+$/.test(value)) return undefined;
  const amount = Number(value);
  return Number.isSafeInteger(amount) ? amount : undefined;
}

function labelFor(items: ReadonlyArray<{ id: string; label: string }>, id: string) {
  return items.find((item) => item.id === id)?.label ?? id.replace(/-/g, " ");
}

export function LiveJobPreview({ data, featured = false }: LiveJobPreviewProps) {
  const company = data.company || "Company Name";
  const initial = company.charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(company);
  const categories = data.categories
    .map((id) => JOB_CATEGORIES.find((category) => category.id === id))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));
  const location = [data.city, data.state].filter(Boolean).join(", ") || "Location";
  const displayedLocation = data.remote ? `${location} (Remote)` : location;
  const salary = formatSalary(
    salaryAmount(data.salaryMin),
    salaryAmount(data.salaryMax),
    data.salaryType
  );
  const application = data.applyUrl
    ? { type: "url" as const, value: data.applyUrl, label: "Apply Now" }
    : data.applyEmail
      ? { type: "email" as const, value: data.applyEmail, label: "Email Application" }
      : null;

  return (
    <div className="space-y-5">
      <section aria-labelledby="search-preview-title">
        <div className="mb-2 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Search results</p>
            <h3 id="search-preview-title" className="font-display text-lg text-forest">Job card preview</h3>
          </div>
          <p className="text-xs text-forest-light">How your listing appears while browsing</p>
        </div>

        <div className={`card relative cursor-default p-3 sm:p-4 ${featured ? "ring-1 ring-primary/20 shadow-soft-lg" : ""}`}>
          {featured ? <div className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-gradient-to-b from-primary to-primary-dark" /> : null}
          <div className={featured ? "pl-3" : ""}>
            {featured ? (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" /> Featured
                </span>
              </div>
            ) : null}

            <div className="mb-3 flex items-start gap-3 sm:gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold sm:h-11 sm:w-11 sm:text-base ${avatarColor}`}>
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="mb-0.5 line-clamp-2 font-display text-base text-forest sm:text-lg">{data.title || "Job Title"}</h4>
                <p className="truncate text-sm font-medium text-forest-light">{company}</p>
              </div>
              {categories.length ? <div className="shrink-0 text-xl sm:text-2xl">{categories.slice(0, 3).map((category) => category.emoji).join(" ")}</div> : null}
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-forest-light sm:text-sm">
              <span className="flex min-w-0 max-w-full items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{displayedLocation}</span></span>
              <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 shrink-0" />{salary}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 shrink-0" />Just now</span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {data.jobType.slice(0, 2).map((type) => (
                <span key={type} className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-forest-light sm:py-1">{labelFor(JOB_TYPES, type)}</span>
              ))}
              {categories.slice(0, 2).map((category) => (
                <span key={category.id} className="rounded bg-primary/5 px-2 py-0.5 text-xs font-medium text-emerald-700 sm:py-1">{category.label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <article className="overflow-hidden rounded-lg border border-border bg-white shadow-soft" aria-labelledby="public-listing-preview-title">
        <div className="border-b border-border bg-earth-sand px-4 py-3 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Full review</p>
          <h3 id="public-listing-preview-title" className="font-display text-xl text-forest">Public listing preview</h3>
          <p className="mt-1 text-xs text-forest-light">Review every public detail below. Preview links are intentionally disabled.</p>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          <header>
            {featured ? (
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" /> Featured Job
              </span>
            ) : null}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="break-words font-display text-2xl text-forest sm:text-3xl">{data.title || "Job Title"}</h4>
                <p className="mt-1 break-words text-lg font-medium text-forest-light">{company}</p>
              </div>
              {categories.length ? <div className="shrink-0 text-3xl">{categories.map((category) => category.emoji).join(" ")}</div> : null}
            </div>
          </header>

          <dl className="grid gap-3 border-y border-border py-4 text-sm text-forest-light sm:grid-cols-2">
            <div className="flex min-w-0 items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><div><dt className="sr-only">Location</dt><dd className="break-words">{displayedLocation}{data.postalCode ? ` · ${data.postalCode}` : ""}</dd></div></div>
            <div className="flex min-w-0 items-start gap-2"><DollarSign className="mt-0.5 h-4 w-4 shrink-0" /><div><dt className="sr-only">Compensation</dt><dd className="font-semibold text-emerald-700">{salary}</dd></div></div>
            <div className="flex min-w-0 items-start gap-2"><Briefcase className="mt-0.5 h-4 w-4 shrink-0" /><div><dt className="sr-only">Job type</dt><dd className="break-words">{data.jobType.map((type) => labelFor(JOB_TYPES, type)).join(", ")}</dd></div></div>
            <div className="flex min-w-0 items-start gap-2"><Calendar className="mt-0.5 h-4 w-4 shrink-0" /><div><dt className="sr-only">Posted</dt><dd>Posted today</dd></div></div>
          </dl>

          <section aria-labelledby="description-preview-title">
            <h4 id="description-preview-title" className="font-display text-xl text-forest">About this job</h4>
            <div className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-forest-light sm:text-base">
              {data.description || "Your complete job description will appear here."}
            </div>
          </section>

          <section aria-labelledby="classification-preview-title">
            <h4 id="classification-preview-title" className="font-display text-lg text-forest">Tags &amp; categories</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => <span key={category.id} className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-emerald-700">{category.emoji} {category.label}</span>)}
              {data.farmType.map((type) => <span key={type} className="rounded-lg bg-secondary/10 px-3 py-1.5 text-sm font-medium text-secondary-dark">{labelFor(FARM_TYPES, type)}</span>)}
              {data.tags.map((tag) => <span key={tag} className="rounded-lg bg-accent-blue/10 px-3 py-1.5 text-sm font-medium capitalize text-sky-700">{labelFor(TAGS, tag)}</span>)}
            </div>
          </section>

          {data.benefits.length ? (
            <section aria-labelledby="benefits-preview-title">
              <h4 id="benefits-preview-title" className="font-display text-lg text-forest">Benefits</h4>
              <ul className="mt-3 grid gap-2 text-sm text-forest-light sm:grid-cols-2">
                {data.benefits.map((benefitId) => {
                  const benefit = BENEFITS.find((item) => item.id === benefitId);
                  return benefit ? <li key={benefitId} className="flex items-center gap-2"><span aria-hidden="true">{benefit.emoji}</span>{benefit.label}</li> : null;
                })}
              </ul>
            </section>
          ) : null}

          <section className="rounded-lg border border-primary/20 bg-primary/5 p-4" aria-labelledby="application-preview-title">
            <h4 id="application-preview-title" className="font-display text-lg text-forest">Application experience</h4>
            {application ? (
              <div className="mt-3 min-w-0">
                <span className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 font-medium text-white">
                  {application.label} {application.type === "url" ? <ExternalLink className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </span>
                <p className="mt-2 break-words text-sm text-forest-light">Job seekers will use: <strong className="font-semibold text-forest">{application.value}</strong></p>
                {data.applyUrl && data.applyEmail ? <p className="mt-1 text-xs text-forest-light">The application URL takes priority; the email address will not be shown as the main button.</p> : null}
              </div>
            ) : <p className="mt-2 text-sm text-forest-light">Add an application URL or public email before payment.</p>}
          </section>

          {(data.companyWebsite || data.companyLogo) ? (
            <section aria-labelledby="company-preview-title">
              <h4 id="company-preview-title" className="font-display text-lg text-forest">Company details</h4>
              <dl className="mt-2 space-y-2 text-sm text-forest-light">
                {data.companyWebsite ? <div className="flex min-w-0 gap-2"><Globe2 className="mt-0.5 h-4 w-4 shrink-0" /><div className="min-w-0"><dt className="sr-only">Website</dt><dd className="break-all">{data.companyWebsite}</dd></div></div> : null}
                {data.companyLogo ? <div className="min-w-0"><dt className="font-semibold text-forest">Logo used in sharing previews</dt><dd className="break-all">{data.companyLogo}</dd></div> : null}
              </dl>
            </section>
          ) : null}
        </div>
      </article>
    </div>
  );
}
