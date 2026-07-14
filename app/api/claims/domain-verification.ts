import { getDomain } from "tldts";

const PUBLIC_EMAIL_DOMAINS = new Set([
  "aol.com",
  "fastmail.com",
  "gmail.com",
  "gmx.com",
  "googlemail.com",
  "hey.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "mac.com",
  "mail.com",
  "me.com",
  "msn.com",
  "outlook.com",
  "proton.me",
  "protonmail.com",
  "yahoo.ca",
  "yahoo.co.uk",
  "yahoo.com",
  "ymail.com",
  "zoho.com",
]);

// Keep automatic ownership conservative across country-specific provider domains
// such as yahoo.fr and hotmail.co.uk. False positives stay in manual review.
const PUBLIC_EMAIL_BRANDS = new Set([
  "aol",
  "fastmail",
  "gmail",
  "gmx",
  "googlemail",
  "hey",
  "hotmail",
  "icloud",
  "live",
  "mail",
  "msn",
  "outlook",
  "proton",
  "protonmail",
  "rocketmail",
  "yahoo",
  "ymail",
  "zoho",
]);

function isPublicEmailProvider(domain: string | null) {
  if (!domain) return false;
  const brand = domain.split(".")[0];
  return PUBLIC_EMAIL_DOMAINS.has(domain) || PUBLIC_EMAIL_BRANDS.has(brand);
}

function registrableDomain(hostname: string) {
  return getDomain(hostname.trim().toLowerCase(), {
    allowPrivateDomains: true,
  });
}

function domainFromUrl(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return registrableDomain(url.hostname);
  } catch {
    return null;
  }
}

export type ClaimDomainEvidence = {
  workEmailDomain: string | null;
  candidateDomains: Array<{
    source: "companyWebsite" | "applyUrl";
    domain: string;
  }>;
  matchedSource: "companyWebsite" | "applyUrl" | null;
  matchedDomain: string | null;
  publicEmailProvider: boolean;
};

export function verifyClaimDomain({
  workEmail,
  companyWebsite,
  applyUrl,
}: {
  workEmail: string;
  companyWebsite: string | null;
  applyUrl: string | null;
}): { autoApprove: boolean; evidence: ClaimDomainEvidence } {
  const emailSeparator = workEmail.lastIndexOf("@");
  const workEmailDomain =
    emailSeparator > 0
      ? registrableDomain(workEmail.slice(emailSeparator + 1))
      : null;
  const candidates = [
    { source: "companyWebsite" as const, domain: domainFromUrl(companyWebsite) },
    { source: "applyUrl" as const, domain: domainFromUrl(applyUrl) },
  ].flatMap((candidate) =>
    candidate.domain ? [{ source: candidate.source, domain: candidate.domain }] : []
  );
  const publicEmailProvider = isPublicEmailProvider(workEmailDomain);
  const match = publicEmailProvider
    ? undefined
    : candidates.find((candidate) => candidate.domain === workEmailDomain);

  return {
    autoApprove: Boolean(workEmailDomain && match),
    evidence: {
      workEmailDomain,
      candidateDomains: candidates,
      matchedSource: match?.source ?? null,
      matchedDomain: match?.domain ?? null,
      publicEmailProvider,
    },
  };
}
