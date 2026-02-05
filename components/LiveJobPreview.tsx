'use client';

import { MapPin, DollarSign, Clock } from "lucide-react";
import { formatSalary } from "@/lib/utils";
import { JOB_CATEGORIES } from "@/lib/constants";

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
    categories: string[];
  };
  featured?: boolean;
}

const AVATAR_COLORS = [
  "bg-primary/10 text-primary",
  "bg-secondary/10 text-secondary",
  "bg-accent-blue/10 text-accent-blue",
  "bg-purple-100 text-purple-600",
  "bg-rose-100 text-rose-600",
  "bg-teal-100 text-teal-600",
];

function getAvatarColor(company: string) {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function LiveJobPreview({ data, featured = false }: LiveJobPreviewProps) {
  const categoryEmojis = data.categories
    .map(cat => JOB_CATEGORIES.find(c => c.id === cat)?.emoji)
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");

  const formatLocation = () => {
    if (!data.city && !data.state) return "Location";
    if (data.remote) return `${data.city || ''}, ${data.state || ''} (Remote)`.trim();
    return `${data.city || ''}, ${data.state || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '');
  };

  const company = data.company || "Company Name";
  const initial = company.charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(company);

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-forest-light">Preview:</p>
      <div
        className={`card p-3 sm:p-4 transition-all cursor-default relative ${
          featured ? "ring-1 ring-primary/20 shadow-soft-lg" : ""
        }`}
      >
        {/* Featured accent bar */}
        {featured && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary-dark rounded-l-lg" />
        )}

        <div className={featured ? "pl-3" : ""}>
          {/* Featured badge */}
          {featured && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Featured
              </span>
            </div>
          )}

          {/* Header with avatar */}
          <div className="flex items-start gap-3 sm:gap-4 mb-3">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center text-sm sm:text-base font-semibold flex-shrink-0 ${avatarColor}`}>
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base sm:text-lg text-forest mb-0.5 line-clamp-2">
                {data.title || "Job Title"}
              </h3>
              <p className="text-sm text-forest-light font-medium truncate">
                {company}
              </p>
            </div>
            {categoryEmojis && (
              <div className="text-xl sm:text-2xl flex-shrink-0">{categoryEmojis}</div>
            )}
          </div>

          {/* Details row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 text-xs sm:text-sm text-forest-light">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{formatLocation()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {formatSalary(
                  data.salaryMin ? parseInt(data.salaryMin) : undefined,
                  data.salaryMax ? parseInt(data.salaryMax) : undefined,
                  data.salaryType
                )}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Just now</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {data.jobType.slice(0, 2).map((type) => (
              <span
                key={type}
                className="px-2 py-0.5 sm:py-1 bg-gray-100 text-forest-light text-xs font-medium rounded capitalize"
              >
                {type.replace("-", " ")}
              </span>
            ))}
            {data.categories.slice(0, 2).map((cat) => {
              const category = JOB_CATEGORIES.find(c => c.id === cat);
              return category ? (
                <span
                  key={cat}
                  className="px-2 py-0.5 sm:py-1 bg-primary/5 text-primary text-xs font-medium rounded"
                >
                  {category.label}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
