import "server-only";

import { lookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";

const MAX_RESPONSE_BYTES = 1_000_000;
const MAX_REDIRECTS = 3;
const REQUEST_TIMEOUT_MS = 5_000;

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
  applyUrl?: string;
}

interface SafeResponse {
  body: string;
  finalUrl: URL;
  contentType: string;
}

function isPrivateIpv4(address: string) {
  const octets = address.split(".").map(Number);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part))) return true;

  const [a, b] = octets;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 0 || b === 168)) ||
    (a === 198 && (b === 18 || b === 19 || b === 51)) ||
    (a === 203 && b === 0) ||
    a >= 224
  );
}

function isPrivateIpv6(address: string) {
  const normalized = address.toLowerCase();
  if (normalized === "::" || normalized === "::1") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (/^fe[89ab]/.test(normalized)) return true;
  if (normalized.startsWith("ff")) return true;
  if (normalized.startsWith("2001:db8")) return true;

  const mapped = normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  return mapped ? isPrivateIpv4(mapped) : false;
}

export function isPublicNetworkAddress(address: string) {
  const family = isIP(address);
  if (family === 4) return !isPrivateIpv4(address);
  if (family === 6) return !isPrivateIpv6(address);
  return false;
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
  if (isIP(hostname)) {
    if (!isPublicNetworkAddress(hostname)) throw new Error("Private network addresses are not supported.");
    return hostname;
  }

  const addresses = await lookup(hostname, { all: true, verbatim: true });
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
          response.resume();
          resolve({
            body: "",
            contentType: "",
            finalUrl: url,
            redirect: new URL(location, url),
          });
          return;
        }

        if (status < 200 || status >= 300) {
          response.resume();
          reject(new Error(`The job page returned HTTP ${status}.`));
          return;
        }

        const contentType = String(response.headers["content-type"] ?? "").toLowerCase();
        if (!contentType.includes("text/html") && !contentType.includes("text/plain") && !contentType.includes("application/xhtml+xml")) {
          response.resume();
          reject(new Error("The link did not return a supported job page."));
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
        response.on("end", () => {
          resolve({
            body: Buffer.concat(chunks).toString("utf8"),
            finalUrl: url,
            contentType,
          });
        });
      }
    );

    request.setTimeout(REQUEST_TIMEOUT_MS, () => request.destroy(new Error("The job page took too long to respond.")));
    request.on("error", reject);
    request.end();
  });
}

async function safeFetch(initialUrl: string) {
  let current = new URL(initialUrl);
  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetchOnce(current);
    if (!response.redirect) return response;
    if (redirectCount === MAX_REDIRECTS) throw new Error("The job link redirected too many times.");
    current = response.redirect;
  }
  throw new Error("Unable to import this job link.");
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return undefined;
  const cleaned = decodeEntities(value)
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

function findJobPosting(value: unknown): Record<string, unknown> | undefined {
  if (Array.isArray(value)) {
    for (const entry of value) {
      const match = findJobPosting(entry);
      if (match) return match;
    }
    return undefined;
  }
  if (!value || typeof value !== "object") return undefined;

  const object = value as Record<string, unknown>;
  const types = Array.isArray(object["@type"]) ? object["@type"] : [object["@type"]];
  if (types.some((type) => String(type).toLowerCase() === "jobposting")) return object;

  return findJobPosting(object["@graph"]);
}

function objectValue(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
}

function extractStructuredJob(html: string, finalUrl: URL): ImportedJobFields | undefined {
  const scripts = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of scripts) {
    try {
      const posting = findJobPosting(JSON.parse(match[1]));
      if (!posting) continue;

      const organization = objectValue(posting.hiringOrganization);
      const address = objectValue(objectValue(posting.jobLocation)?.address);
      const baseSalary = objectValue(posting.baseSalary);
      const salaryValue = objectValue(baseSalary?.value);
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

      return {
        title: cleanText(posting.title, 100),
        company: cleanText(organization?.name, 100),
        description: cleanText(posting.description, 5_000),
        city: cleanText(address?.addressLocality, 100),
        state: cleanText(address?.addressRegion, 2)?.toUpperCase(),
        postalCode: cleanText(address?.postalCode, 10),
        remote: String(posting.jobLocationType ?? "").toUpperCase() === "TELECOMMUTE",
        salaryMin: Number.isFinite(Number(salaryValue?.minValue)) ? Number(salaryValue?.minValue) : undefined,
        salaryMax: Number.isFinite(Number(salaryValue?.maxValue)) ? Number(salaryValue?.maxValue) : undefined,
        salaryType: unit.includes("HOUR") ? "hourly" : "annual",
        jobType: employmentTypes
          .map((type) => jobTypeMap[String(type).toLowerCase()])
          .filter((type): type is string => Boolean(type)),
        companyWebsite: organization?.sameAs ? String(organization.sameAs) : undefined,
        applyUrl: finalUrl.toString(),
      };
    } catch {
      // Continue to the next structured-data block.
    }
  }
  return undefined;
}

function extractMeta(html: string, name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const value = html.match(pattern)?.[1];
    if (value) return cleanText(value, 5_000);
  }
  return undefined;
}

export async function importJobFromUrl(url: string): Promise<{ fields: ImportedJobFields; sourceUrl: string }> {
  const response = await safeFetch(url);
  const structured = extractStructuredJob(response.body, response.finalUrl);
  if (structured) return { fields: structured, sourceUrl: response.finalUrl.toString() };

  const title = extractMeta(response.body, "og:title") ?? cleanText(response.body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1], 100);
  const description = extractMeta(response.body, "og:description") ?? extractMeta(response.body, "description");

  if (!title && !description) throw new Error("No recognizable job details were found on that page.");

  return {
    fields: {
      title,
      description,
      applyUrl: response.finalUrl.toString(),
    },
    sourceUrl: response.finalUrl.toString(),
  };
}
