import { z } from "zod";

const draftId = z.string().cuid();
export const POSTING_ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "msclkid",
  "source",
] as const;

type PostingAttributionKey = (typeof POSTING_ATTRIBUTION_KEYS)[number];
type PostingAttribution = Partial<Record<PostingAttributionKey, unknown>>;

function nonEmptyAttributionString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 300) : undefined;
}

export function sanitizePostingLandingPath(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/")) return undefined;

  try {
    const url = new URL(value, "https://playindirtjobs.com");
    const safeQuery = new URLSearchParams();
    for (const key of POSTING_ATTRIBUTION_KEYS) {
      const entry = nonEmptyAttributionString(url.searchParams.get(key));
      if (entry) safeQuery.set(key, entry);
    }
    const query = safeQuery.toString();
    return `${url.pathname}${query ? `?${query}` : ""}`.slice(0, 1_000);
  } catch {
    return undefined;
  }
}

export function postingAttributionDimensions(attribution: PostingAttribution) {
  return {
    acquisitionSource: nonEmptyAttributionString(attribution.utm_source),
    internalCtaSource: nonEmptyAttributionString(attribution.source),
  };
}

const postingStage = z.enum([
  "role_basics",
  "role_classification",
  "job_details",
  "employer_details",
  "preview",
]);

export const postingFunnelEventSchema = z.discriminatedUnion("eventName", [
  z.object({
    draftId,
    eventName: z.literal("posting_started"),
    properties: z.object({
      interaction: z.enum(["form_input", "import"]),
      stage: postingStage,
    }).strict(),
  }),
  z.object({
    draftId,
    eventName: z.literal("posting_role_basics_completed"),
    properties: z.object({ method: z.enum(["manual", "import"]) }).strict(),
  }),
  z.object({
    draftId,
    eventName: z.literal("posting_classification_completed"),
    properties: z.object({
      categoryCount: z.number().int().min(1).max(3),
      jobTypeCount: z.number().int().min(1).max(20),
      operationTypeCount: z.number().int().min(1).max(20),
    }).strict(),
  }),
  z.object({
    draftId,
    eventName: z.literal("job_import_attempted"),
    properties: z.object({ stage: z.literal("role_basics") }).strict(),
  }),
  z.object({
    draftId,
    eventName: z.literal("job_import_succeeded"),
    properties: z.object({
      extraction: z.enum(["structured", "metadata"]).optional(),
      populatedFieldCount: z.number().int().min(0).max(50),
      warningCount: z.number().int().min(0).max(50),
    }).strict(),
  }),
  z.object({
    draftId,
    eventName: z.literal("job_import_failed"),
    properties: z.object({ statusCode: z.number().int().min(0).max(599) }).strict(),
  }),
  z.object({
    draftId,
    eventName: z.literal("preview_viewed"),
    properties: z.object({}).strict().optional(),
  }),
  z.object({
    draftId,
    eventName: z.literal("plan_selected"),
    properties: z.object({ plan: z.enum(["basic", "featured"]) }).strict(),
  }),
  z.object({
    draftId,
    eventName: z.literal("checkout_cancelled"),
    properties: z.object({ stage: z.literal("preview") }).strict(),
  }),
]);

export type PostingFunnelEvent = z.infer<typeof postingFunnelEventSchema>;

export const DEDUPED_POSTING_FUNNEL_EVENTS = new Set<PostingFunnelEvent["eventName"]>([
  "posting_started",
  "posting_role_basics_completed",
  "posting_classification_completed",
  "checkout_cancelled",
]);

export function dedupedPostingFunnelEventId(
  eventDraftId: string,
  eventName: PostingFunnelEvent["eventName"]
) {
  return `posting-funnel:${eventDraftId}:${eventName}`;
}
