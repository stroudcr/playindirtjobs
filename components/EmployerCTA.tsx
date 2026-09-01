import React from "react";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";

import { EmployerPostLink } from "@/components/EmployerPostLink";

export function EmployerCTA({
  source = "jobs_browse",
  compact = false,
  heading = "Hiring for work like this?",
  body = "Post one nationwide agricultural listing for 60 days, starting at $15.",
  buttonLabel = "Post a job",
  placement,
  headingLevel = 2,
}: {
  source?: string;
  compact?: boolean;
  heading?: string;
  body?: string;
  buttonLabel?: string;
  placement?: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <aside
      className={compact ? "overflow-hidden rounded-2xl border border-primary/20 bg-white shadow-soft-lg" : "border-y border-primary/20 bg-primary/5 py-8"}
      aria-label="Employer job posting"
    >
      <div
        className={compact
          ? "flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6"
          : "container mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 px-4 sm:flex-row sm:items-center"}
      >
        <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
          <span className={`flex shrink-0 items-center justify-center rounded-xl text-primary ${compact ? "h-11 w-11 bg-primary/10" : "bg-white p-3 shadow-soft"}`}>
            <BriefcaseBusiness className={compact ? "h-5 w-5" : "h-6 w-6"} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <Heading className={`${compact ? "text-xl leading-tight" : "text-2xl"} font-display text-forest`}>{heading}</Heading>
            <p className={`${compact ? "mt-1.5 max-w-xs leading-6" : "mt-1"} text-sm text-forest-light`}>
              {body}
            </p>
          </div>
        </div>
        <EmployerPostLink
          source={source}
          eventParams={{ placement: placement ?? (compact ? "empty_state" : "jobs_browse") }}
          className={`btn btn-primary shrink-0 justify-center ${compact ? "w-full sm:w-auto" : ""}`}
        >
          {buttonLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </EmployerPostLink>
      </div>
    </aside>
  );
}
