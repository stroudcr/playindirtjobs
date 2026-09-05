import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Sprout,
  Monitor,
} from "lucide-react";
import {
  type PublicWorkshop,
  workshopDate,
  workshopPrice,
  workshopTopic,
  workshopFormat,
} from "@/lib/workshop-types";
import { WorkshopImpression } from "@/components/WorkshopTracking";

export function WorkshopCard({
  workshop,
  compact = false,
  source = "directory",
}: {
  workshop: PublicWorkshop;
  compact?: boolean;
  source?: string;
}) {
  const topic = workshopTopic(workshop.topic);
  return (
    <WorkshopImpression id={workshop.id} source={source}>
      <article
        className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dedfd3] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-soft-lg ${compact ? "p-5" : "p-6 sm:p-7"}`}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf3e7] px-3 py-1 text-xs font-semibold text-forest">
            <Sprout className="h-3.5 w-3.5" />
            {topic.short}
          </span>
          <span className="text-[11px] font-medium text-earth-brown">
            {workshop.origin === "GIFTED"
              ? "Complimentary listing"
              : "Sponsored"}
          </span>
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.09em] text-earth-brown">
          {workshop.organization}
        </p>
        <h3
          className={`font-display leading-tight text-forest ${compact ? "text-xl" : "text-2xl"}`}
        >
          <Link
            href={`/workshops/${workshop.slug}`}
            className="decoration-primary/40 underline-offset-4 group-hover:underline"
          >
            {workshop.title}
          </Link>
        </h3>
        {!compact ? (
          <p className="mt-3 text-sm leading-relaxed text-forest-light">
            {workshop.summary}
          </p>
        ) : null}
        <div className="mt-5 space-y-2 text-sm text-forest-light">
          <p className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {workshopDate(workshop)}
          </p>
          <p className="flex items-start gap-2">
            {workshop.format === "in-person" ? (
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            ) : (
              <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            )}
            {workshop.format === "in-person"
              ? `${workshop.city}, ${workshop.state}`
              : workshopFormat(workshop.format)}
          </p>
        </div>
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-[#ecece3] pt-4">
            <div>
              <span className="font-bold text-forest">
                {workshopPrice(workshop)}
              </span>
              <span className="ml-2 text-xs text-earth-brown">
                {workshop.level}
              </span>
            </div>
            <Link
              href={`/workshops/${workshop.slug}`}
              aria-label={`View ${workshop.title}`}
              className="rounded-full bg-earth-sand p-2 text-primary transition group-hover:bg-primary group-hover:text-white"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>
    </WorkshopImpression>
  );
}
