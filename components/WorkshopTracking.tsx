"use client";
import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export function recordWorkshopEvent(
  workshopId: string,
  eventName: string,
  source: string,
) {
  let visitor: string;
  try {
    visitor =
      sessionStorage.getItem("pidj:workshop-visitor") || crypto.randomUUID();
    sessionStorage.setItem("pidj:workshop-visitor", visitor);
  } catch {
    return;
  }
  const body = JSON.stringify({ workshopId, eventName, source, visitor });
  void fetch("/api/workshops/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
  trackAnalyticsEvent(eventName, { workshop_id: workshopId, source });
}
export function WorkshopImpression({
  id,
  source,
  detail = false,
  children,
}: {
  id: string;
  source: string;
  detail?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          recordWorkshopEvent(
            id,
            detail ? "workshop_detail_view" : "workshop_placement_view",
            source,
          );
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [id, source, detail]);
  return (
    <div ref={ref} className={children ? "h-full" : "h-px"}>
      {children}
    </div>
  );
}
export function WorkshopRegistration({
  id,
  url,
  gifted,
  children = "Register with organizer",
}: {
  id: string;
  url: string;
  gifted: boolean;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={url}
      rel={gifted ? "noopener" : "sponsored noopener"}
      className="btn btn-primary min-h-12 w-full text-center"
      onClick={() =>
        recordWorkshopEvent(id, "workshop_registration_click", "detail")
      }
    >
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}
