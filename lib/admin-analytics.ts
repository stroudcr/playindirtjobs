export const EMPLOYER_ACTIVITY_EVENTS = [
  "employer_landing_view",
  "employer_cta_click",
] as const;

export type EmployerActivityEventName = (typeof EMPLOYER_ACTIVITY_EVENTS)[number];
export type EmployerCountryBucket = "us" | "nonUs" | "unknown";

export type EmployerActivitySummary = {
  eventName: EmployerActivityEventName;
  us: number;
  nonUs: number;
  unknown: number;
  total: number;
};

type EmployerActivityEvent = {
  eventName: string;
  anonymousId: string | null;
  properties: unknown;
};

const BUCKET_PRIORITY: Record<EmployerCountryBucket, number> = {
  unknown: 0,
  nonUs: 1,
  us: 2,
};

function countryBucket(properties: unknown): EmployerCountryBucket {
  if (!properties || typeof properties !== "object" || Array.isArray(properties)) {
    return "unknown";
  }
  const country = (properties as Record<string, unknown>).country;
  if (typeof country !== "string") return "unknown";
  const normalized = country.trim().toUpperCase();
  if (normalized === "US") return "us";
  if (/^[A-Z]{2}$/.test(normalized) && normalized !== "XX" && normalized !== "ZZ") {
    return "nonUs";
  }
  return "unknown";
}

export function summarizeEmployerActivity(
  events: EmployerActivityEvent[]
): EmployerActivitySummary[] {
  const visitors = new Map<
    EmployerActivityEventName,
    Map<string, EmployerCountryBucket>
  >(
    EMPLOYER_ACTIVITY_EVENTS.map((eventName) => [eventName, new Map()])
  );

  for (const event of events) {
    if (!EMPLOYER_ACTIVITY_EVENTS.includes(event.eventName as EmployerActivityEventName)) {
      continue;
    }
    const anonymousId = event.anonymousId?.trim();
    if (!anonymousId) continue;

    const eventName = event.eventName as EmployerActivityEventName;
    const bucket = countryBucket(event.properties);
    const previous = visitors.get(eventName)?.get(anonymousId);
    if (!previous || BUCKET_PRIORITY[bucket] > BUCKET_PRIORITY[previous]) {
      visitors.get(eventName)?.set(anonymousId, bucket);
    }
  }

  return EMPLOYER_ACTIVITY_EVENTS.map((eventName) => {
    const counts = { us: 0, nonUs: 0, unknown: 0 };
    for (const bucket of visitors.get(eventName)?.values() ?? []) counts[bucket] += 1;
    return {
      eventName,
      ...counts,
      total: counts.us + counts.nonUs + counts.unknown,
    };
  });
}
