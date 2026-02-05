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

export function JobCard({ job }: JobCardProps) {
  const categoryEmojis = job.categories
    .map(cat => JOB_CATEGORIES.find(c => c.id === cat)?.emoji)
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");

  const initial = job.company.charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(job.company);

  return (
    <Link href={`/jobs/${job.slug}`}>
      <div
        className={`group card p-3 sm:p-4 hover:shadow-soft-lg hover:border-gray-300 transition-all cursor-pointer active:scale-[0.98] relative ${
          job.featured
            ? "ring-1 ring-primary/20 shadow-soft-lg"
            : ""
        }`}
      >
        {/* Featured accent bar */}
        {job.featured && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary-dark rounded-l-lg" />
        )}

        <div className={job.featured ? "pl-3" : ""}>
          {/* Featured badge */}
          {job.featured && (
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
              <h3 className="font-display text-base sm:text-lg text-forest mb-0.5 line-clamp-2 group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-forest-light font-medium truncate">{job.company}</p>
            </div>
            <div className="text-xl sm:text-2xl flex-shrink-0">{categoryEmojis}</div>
          </div>

          {/* Details row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 text-xs sm:text-sm text-forest-light">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{formatDate(job.createdAt)}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {job.jobType.slice(0, 2).map((type) => (
              <span
                key={type}
                className="px-2 py-0.5 sm:py-1 bg-gray-100 text-forest-light text-xs font-medium rounded capitalize"
              >
                {type.replace("-", " ")}
              </span>
            ))}
            {job.categories.slice(0, 2).map((cat) => {
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
    </Link>
  );
}
