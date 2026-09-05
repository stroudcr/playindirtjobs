import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { relatedWorkshops } from "@/lib/workshops";
import { WorkshopCard } from "@/components/WorkshopCard";

export async function RelatedWorkshops({
  state,
  topics,
  source = "jobs",
  compact = false,
}: {
  state?: string;
  topics?: string[];
  source?: string;
  compact?: boolean;
}) {
  const workshops = await relatedWorkshops({ state, topics });
  if (!workshops.length) return null;
  return (
    <section
      aria-label="Related workshops and training"
      className="my-6 rounded-2xl border border-[#dddccc] bg-[#f5f4e9] p-4 sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.17em] text-secondary-dark">
            Grow your skills
          </p>
          <h2
            className={`font-display text-forest ${compact ? "text-2xl" : "text-3xl"}`}
          >
            Learning you can put to work.
          </h2>
        </div>
        <Link
          href="/workshops"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
        >
          All workshops <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        {workshops.map((workshop) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            compact
            source={source}
          />
        ))}
      </div>
    </section>
  );
}
