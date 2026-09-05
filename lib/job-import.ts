import "server-only";

import { lookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import ipaddr from "ipaddr.js";

import { getStateCode, US_STATES } from "@/lib/constants";

const MAX_RESPONSE_BYTES = 1_000_000;
const MAX_REDIRECTS = 3;
const REQUEST_TIMEOUT_MS = 5_000;
const DNS_TIMEOUT_MS = 3_000;

export interface ImportedJobFields {
  title?: string;
  company?: string;
  description?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: "annual" | "hourly";
  jobType?: string[];
  companyWebsite?: string;
}

export type ImportedJobResult = {
  fields: ImportedJobFields;
  sourceUrl: string;
  extraction: "structured" | "metadata";
  warnings: string[];
};

interface SafeResponse {
  body: string;
  finalUrl: URL;
  contentType: string;
}

export function isPublicNetworkAddress(address: string) {
  const normalized = address.startsWith("[") && address.endsWith("]")
    ? address.slice(1, -1)
    : address;
  if (!isIP(normalized)) return false;

  try {
    const original = ipaddr.parse(normalized);
    if (
      original.kind() === "ipv6" &&
      original.toByteArray().slice(0, 12).every((byte) => byte === 0)
    ) {
      return false;
    }
    // process() converts every IPv4-mapped IPv6 representation, including
    // hexadecimal forms such as ::ffff:7f00:1, before range classification.
    const parsed = ipaddr.process(normalized);
    return parsed.range() === "unicast";
  } catch {
    return false;
  }
}

function validateUrl(url: URL) {
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS job links are supported.");
  }
  if (url.username || url.password) {
    throw new Error("Job links cannot contain credentials.");
  }
  const expectedPort = url.protocol === "https:" ? "443" : "80";
  if (url.port && url.port !== expectedPort) {
    throw new Error("Job links must use a standard web port.");
  }
  if (url.hostname === "localhost" || url.hostname.endsWith(".localhost")) {
    throw new Error("Local network addresses are not supported.");
  }
}

async function resolvePublicAddress(hostname: string) {
  const normalizedHostname = hostname.startsWith("[") && hostname.endsWith("]")
    ? hostname.slice(1, -1)
    : hostname;
  if (isIP(normalizedHostname)) {
    if (!isPublicNetworkAddress(normalizedHostname)) throw new Error("Private network addresses are not supported.");
    return normalizedHostname;
  }

  let dnsTimer: ReturnType<typeof setTimeout> | undefined;
  const addresses = await Promise.race([
    lookup(normalizedHostname, { all: true, verbatim: true }),
    new Promise<never>((_, reject) => {
      dnsTimer = setTimeout(
        () => reject(new Error("The job-page address lookup took too long.")),
        DNS_TIMEOUT_MS
      );
    }),
  ]).finally(() => {
    if (dnsTimer) clearTimeout(dnsTimer);
  });
  if (addresses.length === 0 || addresses.some(({ address }) => !isPublicNetworkAddress(address))) {
    throw new Error("The job link resolved to a private or unavailable address.");
  }
  return addresses[0].address;
}

async function fetchOnce(url: URL): Promise<SafeResponse & { redirect?: URL }> {
  validateUrl(url);
  const address = await resolvePublicAddress(url.hostname);
  const requester = url.protocol === "https:" ? httpsRequest : httpRequest;

  return new Promise((resolve, reject) => {
    let absoluteTimer: ReturnType<typeof setTimeout> | undefined;
    const succeed = (value: SafeResponse & { redirect?: URL }) => {
      if (absoluteTimer) clearTimeout(absoluteTimer);
      resolve(value);
    };
    const fail = (error: Error) => {
      if (absoluteTimer) clearTimeout(absoluteTimer);
      reject(error);
    };
    const request = requester(
      {
        protocol: url.protocol,
        hostname: address,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: "GET",
        servername: url.hostname,
        headers: {
          Host: url.host,
          Accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.7",
          "User-Agent": "PlayInDirtJobs-Importer/1.0 (+https://playindirtjobs.com/employers)",
        },
      },
      (response) => {
        const status = response.statusCode ?? 0;
        const location = response.headers.location;

        if (status >= 300 && status < 400 && location) {
          response.destroy();
          succeed({
            body: "",
            contentType: "",
            finalUrl: url,
            redirect: new URL(location, url),
          });
          return;
        }

        if (status < 200 || status >= 300) {
          response.destroy();
          fail(new Error(`The job page returned HTTP ${status}.`));
          return;
        }

        const contentType = String(response.headers["content-type"] ?? "").toLowerCase();
        if (!contentType.includes("text/html") && !contentType.includes("text/plain") && !contentType.includes("application/xhtml+xml")) {
          response.destroy();
          fail(new Error("The link did not return a supported job page."));
          return;
        }

        const contentLength = Number(response.headers["content-length"] ?? 0);
        if (Number.isFinite(contentLength) && contentLength > MAX_RESPONSE_BYTES) {
          response.destroy();
          fail(new Error("The job page is too large to import."));
          return;
        }

        const chunks: Buffer[] = [];
        let received = 0;
        response.on("data", (chunk: Buffer) => {
          received += chunk.length;
          if (received > MAX_RESPONSE_BYTES) {
            request.destroy(new Error("The job page is too large to import."));
            return;
          }
          chunks.push(chunk);
        });
        response.on("aborted", () => fail(new Error("The job page ended before the import finished.")));
        response.on("error", fail);
        response.on("end", () => {
          succeed({
            body: Buffer.concat(chunks).toString("utf8"),
            finalUrl: url,
            contentType,
          });
        });
      }
    );

    absoluteTimer = setTimeout(
      () => request.destroy(new Error("The job page took too long to import.")),
      REQUEST_TIMEOUT_MS
    );
    request.setTimeout(REQUEST_TIMEOUT_MS, () => request.destroy(new Error("The job page stopped responding.")));
    request.on("error", fail);
    request.end();
  });
}

export async function safeFetchPublicPage(initialUrl: string) {
  let current = new URL(initialUrl);
  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetchOnce(current);
    if (!response.redirect) return response;
    if (redirectCount === MAX_REDIRECTS) throw new Error("The job link redirected too many times.");
    if (current.protocol === "https:" && response.redirect.protocol !== "https:") {
      throw new Error("Secure job links cannot redirect to an insecure page.");
    }
    current = response.redirect;
  }
  throw new Error("Unable to import this job link.");
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&hellip;/gi, "…")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(x[0-9a-f]+|\d+);?/gi, (entity, code: string) => {
      const numeric = code.toLowerCase().startsWith("x")
        ? Number.parseInt(code.slice(1), 16)
        : Number.parseInt(code, 10);
      try {
        return Number.isFinite(numeric) ? String.fromCodePoint(numeric) : entity;
      } catch {
        return entity;
      }
    });
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return undefined;
  const cleaned = decodeEntities(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>|<\/li>|<\/div>|<\/h\d>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
  return cleaned ? cleaned.slice(0, maxLength) : undefined;
}

function findJobPostings(value: unknown, matches: Record<string, unknown>[] = []) {
  if (Array.isArray(value)) {
    for (const entry of value) {
      findJobPostings(entry, matches);
    }
    return matches;
  }
  if (!value || typeof value !== "object") return matches;

  const object = value as Record<string, unknown>;
  const types = Array.isArray(object["@type"]) ? object["@type"] : [object["@type"]];
  if (types.some((type) => String(type).toLowerCase() === "jobposting")) matches.push(object);

  if (object["@graph"]) findJobPostings(object["@graph"], matches);
  return matches;
}

function objectValue(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
}

function firstObject(value: unknown) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const object = objectValue(item);
      if (object) return object;
    }
    return undefined;
  }
  return objectValue(value);
}

function normalizedState(value: unknown) {
  const state = cleanText(value, 100)?.replace(/^US[-\s]/i, "");
  if (!state) return undefined;
  const code = getStateCode(state).toUpperCase();
  return US_STATES.some((candidate) => candidate.code === code) ? code : undefined;
}

function finiteInteger(value: unknown) {
  if (value === null || value === "" || typeof value === "boolean") return undefined;
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : undefined;
}

function supportedWebsite(value: unknown) {
  const candidates = Array.isArray(value) ? value : [value];
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    try {
      const url = new URL(candidate);
      if (
        candidate.length <= 2_000 &&
        (url.protocol === "http:" || url.protocol === "https:") &&
        !url.username &&
        !url.password
      ) {
        return url.toString();
      }
    } catch {
      // Try the next candidate.
    }
  }
  return undefined;
}

function fieldsFromPosting(posting: Record<string, unknown>) {
  const organization = firstObject(posting.hiringOrganization);
  const location = firstObject(posting.jobLocation);
  const address = firstObject(location?.address);
  const baseSalary = firstObject(posting.baseSalary);
  const salaryValue = firstObject(baseSalary?.value);
  const employmentTypes = Array.isArray(posting.employmentType)
    ? posting.employmentType
    : [posting.employmentType].filter(Boolean);
  const jobTypeMap: Record<string, string> = {
    full_time: "full-time",
    part_time: "part-time",
    temporary: "temporary",
    contractor: "contract",
    intern: "internship",
    volunteer: "temporary",
  };
  const unit = String(baseSalary?.unitText ?? salaryValue?.unitText ?? "").toUpperCase();
  const exactSalary = finiteInteger(
    typeof baseSalary?.value === "number" || typeof baseSalary?.value === "string"
      ? baseSalary.value
      : salaryValue?.value
  );
  const salaryMin = finiteInteger(salaryValue?.minValue) ?? exactSalary;
  const salaryMax = finiteInteger(salaryValue?.maxValue) ?? exactSalary;
  const normalizedJobTypes = employmentTypes
    .map((type) => jobTypeMap[String(type).toLowerCase().trim().replace(/[\s-]+/g, "_")])
    .filter((type): type is string => Boolean(type));
  const remote = String(posting.jobLocationType ?? "").toUpperCase().includes("TELECOMMUTE")
    ? true
    : undefined;
  const salaryType = unit.includes("HOUR")
    ? "hourly" as const
    : unit.includes("YEAR")
      ? "annual" as const
      : undefined;
  const companyWebsite = supportedWebsite(organization?.sameAs ?? organization?.url);
  const sourceDescription = cleanText(posting.description, 5_001);
  const descriptionTooLong = Boolean(sourceDescription && sourceDescription.length > 5_000);

  return {
    fields: {
      title: cleanText(posting.title, 100),
      company: cleanText(organization?.name, 100),
      ...(sourceDescription && !descriptionTooLong ? { description: sourceDescription } : {}),
      city: cleanText(address?.addressLocality, 100),
      state: normalizedState(address?.addressRegion),
      postalCode: cleanText(address?.postalCode, 10),
      ...(remote === undefined ? {} : { remote }),
      ...(salaryMin === undefined ? {} : { salaryMin }),
      ...(salaryMax === undefined ? {} : { salaryMax }),
      ...(salaryType === undefined ? {} : { salaryType }),
      ...(normalizedJobTypes.length === 0 ? {} : { jobType: normalizedJobTypes }),
      ...(companyWebsite ? { companyWebsite } : {}),
    } satisfies ImportedJobFields,
    descriptionTooLong,
  };
}

function structuredFieldScore(fields: ImportedJobFields) {
  return (
    (fields.title ? 3 : 0) +
    (fields.description ? 5 : 0) +
    (fields.company ? 2 : 0) +
    (fields.city || fields.state ? 1 : 0) +
    (fields.salaryMin !== undefined || fields.salaryMax !== undefined ? 1 : 0)
  );
}

function comparableJobUrl(value: unknown, sourceUrl: URL) {
  const candidate = typeof value === "string"
    ? value
    : objectValue(value)?.url ?? objectValue(value)?.["@id"];
  if (typeof candidate !== "string") return undefined;
  try {
    const url = new URL(candidate, sourceUrl);
    return `${url.origin}${url.pathname.replace(/\/$/, "") || "/"}`;
  } catch {
    return undefined;
  }
}

function postingMatchesSource(posting: Record<string, unknown>, sourceUrl: URL) {
  const source = `${sourceUrl.origin}${sourceUrl.pathname.replace(/\/$/, "") || "/"}`;
  return [posting.url, posting.mainEntityOfPage]
    .map((value) => comparableJobUrl(value, sourceUrl))
    .some((value) => value === source);
}

function extractStructuredJob(html: string, sourceUrl: URL) {
  const scripts = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const candidates: Array<{
    fields: ImportedJobFields;
    descriptionTooLong: boolean;
    matchesSource: boolean;
  }> = [];

  for (const match of scripts) {
    try {
      for (const posting of findJobPostings(JSON.parse(match[1]))) {
        candidates.push({
          ...fieldsFromPosting(posting),
          matchesSource: postingMatchesSource(posting, sourceUrl),
        });
      }
    } catch {
      // Continue to the next structured-data block.
    }
  }

  const matchingCandidates = candidates.filter((candidate) => candidate.matchesSource);
  const eligibleCandidates = candidates.length <= 1
    ? candidates
    : matchingCandidates;
  const bestCandidate = eligibleCandidates.sort(
    (left, right) => structuredFieldScore(right.fields) - structuredFieldScore(left.fields)
  )[0];

  if (!bestCandidate) {
    return {
      warnings: candidates.length > 1
        ? ["This page described multiple jobs and did not identify which one matched the link, so structured details were not imported."]
        : [],
    };
  }

  return {
    fields: bestCandidate.fields,
    warnings: bestCandidate.descriptionTooLong
      ? ["The source description exceeded the 5,000-character listing limit, so it was left unchanged. Shorten and paste the complete description before payment."]
      : [],
  };
}

function safeSourceUrl(value: URL) {
  const url = new URL(value);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/(?:^|[_-])(?:token|secret|signature|sig|auth|password|pass|key|session|jwt)(?:$|[_-])/i.test(key)) {
      url.searchParams.delete(key);
    }
  }
  return url.toString();
}

function extractMeta(html: string, name: string, maxLength = 5_000) {
  const attributeValue = (tag: string, attribute: string) => {
    const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = tag.match(new RegExp(`\\b${escapedAttribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
    return match?.[1] ?? match?.[2];
  };
  const tags = html.match(/<meta\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi) ?? [];
  for (const tag of tags) {
    const metaName = attributeValue(tag, "property") ?? attributeValue(tag, "name");
    if (metaName?.toLowerCase() !== name.toLowerCase()) continue;
    const value = attributeValue(tag, "content");
    if (value) return cleanText(value, maxLength);
  }
  return undefined;
}

function stripSiteName(title: string | undefined, siteName: string | undefined) {
  if (!title || !siteName) return title;
  const escaped = siteName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return title.replace(new RegExp(`\\s+(?:\\||–|—|-)\\s+${escaped}$`, "i"), "").trim();
}

function descriptionLooksTruncated(description: string) {
  return /(?:\[?…\]?|\.\.\.|\b(?:read|learn) more)\s*$/i.test(description);
}

export async function importJobFromUrl(url: string): Promise<ImportedJobResult> {
  const response = await safeFetchPublicPage(url);
  // The source page is provenance, not an employer-chosen application destination.
  // Keep it outside fields so imports also preserve an existing application URL.
  const sourceUrl = safeSourceUrl(response.finalUrl);
  const structured = extractStructuredJob(response.body, response.finalUrl);
  if (structured.fields?.title || structured.fields?.description) {
    return {
      fields: structured.fields,
      sourceUrl,
      extraction: "structured",
      warnings: structured.warnings,
    };
  }

  const siteName = extractMeta(response.body, "og:site_name", 100);
  const title = stripSiteName(
    extractMeta(response.body, "og:title", 100) ?? cleanText(response.body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1], 100),
    siteName
  );
  const description = extractMeta(response.body, "og:description") ?? extractMeta(response.body, "description");

  if (!title) throw new Error("No recognizable job title was found on that page.");

  const truncated = Boolean(description && descriptionLooksTruncated(description));
  return {
    fields: {
      ...(title ? { title } : {}),
    },
    sourceUrl,
    extraction: "metadata",
    warnings: [
      ...structured.warnings,
      truncated
        ? "The source exposed only a truncated summary, so the description was left unchanged. Paste or write the complete description before payment."
        : "The source exposed page-summary metadata rather than a complete job feed, so the description was left unchanged. Paste or write the complete description before payment.",
    ],
  };
}
