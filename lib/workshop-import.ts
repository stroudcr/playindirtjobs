import "server-only";
import { safeFetchPublicPage } from "@/lib/job-import";
import { getStateCode } from "@/lib/constants";
import { publicWebUrl } from "@/lib/workshop-validation";

function clean(value: unknown, max = 8000) {
  if (typeof value !== "string") return undefined;
  return (
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max) || undefined
  );
}
function object(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
export function extractWorkshop(html: string, sourceUrl: string) {
  let event: Record<string, unknown> | undefined;
  function visit(value: unknown, depth = 0) {
    if (depth > 15 || event) return;
    if (Array.isArray(value)) {
      value.slice(0, 100).forEach((item) => visit(item, depth + 1));
      return;
    }
    const node = object(value);
    if (!node) return;
    const types = Array.isArray(node["@type"])
      ? node["@type"]
      : [node["@type"]];
    if (
      types.some((type) =>
        ["Event", "EducationEvent", "Course"].includes(String(type)),
      )
    )
      event = node;
    else Object.values(node).forEach((item) => visit(item, depth + 1));
  }
  for (const match of html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      visit(JSON.parse(match[1]));
    } catch {
      /* Other structured data is not a course. */
    }
  }
  const fields: Record<string, unknown> = {};
  if (event) {
    fields.title = clean(event.name, 140);
    fields.description = clean(event.description);
    fields.summary = clean(event.description, 240);
    const organizer = object(event.organizer) ?? object(event.provider);
    fields.organization = clean(organizer?.name, 140);
    if (publicWebUrl.safeParse(organizer?.url).success)
      fields.organizerWebsite = organizer?.url;
    const offer = object(
      Array.isArray(event.offers) ? event.offers[0] : event.offers,
    );
    if (
      offer?.price != null &&
      String(offer.price).trim() &&
      Number.isFinite(Number(offer.price)) &&
      (!offer.priceCurrency || offer.priceCurrency === "USD")
    )
      fields.tuitionCents = Math.round(Number(offer.price) * 100);
    const location = object(event.location);
    const address = object(location?.address);
    fields.venue = clean(location?.name, 160);
    fields.city = clean(address?.addressLocality, 100);
    const region = clean(address?.addressRegion, 100);
    if (region) fields.state = getStateCode(region).toUpperCase();
    fields.address = clean(address?.streetAddress, 200);
    fields.postalCode = clean(address?.postalCode, 12);
    // Dates and registration destination require explicit confirmation, never guesses.
    for (const key of ["startDate", "endDate"]) {
      const date = event[key];
      if (
        typeof date === "string" &&
        /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(date) &&
        Number.isFinite(Date.parse(date))
      )
        fields[key === "startDate" ? "startAt" : "endAt"] = new Date(
          date,
        ).toISOString();
    }
  } else {
    fields.title = clean(
      html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1],
      140,
    );
    const meta = html.match(
      /<meta[^>]*(?:name|property)=["'](?:og:description|description)["'][^>]*content=["']([^"']*)["'][^>]*>/i,
    )?.[1];
    fields.description = clean(meta);
    fields.summary = clean(meta, 240);
  }
  for (const key of Object.keys(fields))
    if (fields[key] === undefined) delete fields[key];
  return {
    fields,
    sourceUrl,
    warnings: [
      "Review all imported text. Confirm the format, local time zone, dates, attendee price and the organizer’s registration link before payment.",
    ],
  };
}
export async function importWorkshop(url: string) {
  const page = await safeFetchPublicPage(publicWebUrl.parse(url));
  return extractWorkshop(page.body, page.finalUrl.toString());
}
