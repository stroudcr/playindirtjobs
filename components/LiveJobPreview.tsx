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

export function LiveJobPreview({ data, featured = false }: LiveJobPreviewProps) {
  const categoryEmojis = data.categories
    .map(cat => JOB_CATEGORIES.find(c => c.id === cat)?.emoji)
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");

  // Format location from structured fields
  const formatLocation = () => {
    if (!data.city && !data.state) return "Location";
    if (data.remote) return `${data.city || ''}, ${data.state || ''} (Remote)`.trim();
    return `${data.city || ''}, ${data.state || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '');
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-forest-light">Preview:</p>
      <div
        className={`card p-3 sm:p-4 transition-all cursor-default ${
          featured ? "border-2 border-primary bg-primary/5" : ""
        }`}
      >
        {/* Featured badge */}
        {featured && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white text-xs font-semibold rounded">
              ⭐ Featured
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-2 sm:gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-forest mb-1 line-clamp-2">
              {data.title || "Job Title"}
            </h3>
            <p className="text-sm sm:text-base text-forest-light font-medium truncate">
              {data.company || "Company Name"}
            </p>
          </div>
          {categoryEmojis && (
            <div className="text-xl sm:text-2xl flex-shrink-0">{categoryEmojis}</div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1.5 sm:space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-forest-light">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{formatLocation()}</span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-forest-light">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">
              {formatSalary(
                data.salaryMin ? parseInt(data.salaryMin) : undefined,
                data.salaryMax ? parseInt(data.salaryMax) : undefined,
                data.salaryType
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-forest-light">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>Just now</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {data.jobType.slice(0, 2).map((type) => (
            <span
              key={type}
              className="px-2 py-0.5 sm:py-1 bg-primary/10 text-primary text-xs font-medium rounded capitalize"
            >
              {type.replace("-", " ")}
            </span>
          ))}
          {data.categories.slice(0, 2).map((cat) => {
            const category = JOB_CATEGORIES.find(c => c.id === cat);
            return category ? (
              <span
                key={cat}
                className="px-2 py-0.5 sm:py-1 bg-secondary/10 text-secondary text-xs font-medium rounded"
              >
                {category.label}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
