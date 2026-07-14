import { ArrowRight, BriefcaseBusiness } from "lucide-react";

import { TrackedLink } from "@/components/TrackedLink";

export function EmployerCTA({ source = "jobs_browse", compact = false }: { source?: string; compact?: boolean }) {
  return (
    <aside className={`border-y border-primary/20 bg-primary/5 ${compact ? "p-5" : "py-8"}`} aria-label="Employer job posting">
      <div className={compact ? "" : "container mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 px-4 sm:flex-row sm:items-center"}>
        <div className="flex items-start gap-4">
          <span className="rounded-lg bg-white p-3 text-primary shadow-soft"><BriefcaseBusiness className="h-6 w-6" /></span>
          <div>
            <h2 className={`${compact ? "text-lg" : "text-2xl"} font-display text-forest`}>Hiring for work like this?</h2>
            <p className="mt-1 text-sm text-forest-light">Post one nationwide agricultural listing for 60 days, starting at $15.</p>
          </div>
        </div>
        <TrackedLink
          href={`/post-job?plan=basic&source=${encodeURIComponent(source)}`}
          eventName="employer_cta_click"
          eventParams={{ source, placement: compact ? "empty_state" : "jobs_browse" }}
          className="btn btn-primary shrink-0 justify-center"
        >
          Post a job <ArrowRight className="h-4 w-4" />
        </TrackedLink>
      </div>
    </aside>
  );
}
