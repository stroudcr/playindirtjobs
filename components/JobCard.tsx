import Link from "next/link";
import { MapPin, DollarSign, Clock } from "lucide-react";
import { formatSalary, formatDate } from "@/lib/utils";
import { JOB_CATEGORIES } from "@/lib/constants";

interface JobCardProps {
  job: {
    id: string;
    slug: string;
    title: string;
    company: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryType?: string;
    categories: string[];
    jobType: string[];
    featured: boolean;
    createdAt: Date;
  };
}

export function JobCard({ job }: JobCardProps) {
  const categoryEmojis = job.categories
    .map(cat => JOB_CATEGORIES.find(c => c.id === cat)?.emoji)
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");

  return (
    <Link href={`/jobs/${job.slug}`}>
      <div
        className={`card p-3 sm:p-4 hover:border-primary/50 transition-all cursor-pointer active:scale-[0.98] ${
          job.featured ? "border-2 border-primary bg-primary/5" : ""
        }`}
      >
        {/* Featured badge */}
        {job.featured && (
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
              {job.title}
            </h3>
            <p className="text-sm sm:text-base text-forest-light font-medium truncate">{job.company}</p>
          </div>
          <div className="text-xl sm:text-2xl flex-shrink-0">{categoryEmojis}</div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 sm:space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-forest-light">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-forest-light">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-forest-light">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{formatDate(job.createdAt)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {job.jobType.slice(0, 2).map((type) => (
            <span
              key={type}
              className="px-2 py-0.5 sm:py-1 bg-primary/10 text-primary text-xs font-medium rounded capitalize"
            >
              {type.replace("-", " ")}
            </span>
          ))}
          {job.categories.slice(0, 2).map((cat) => {
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
    </Link>
  );
}
