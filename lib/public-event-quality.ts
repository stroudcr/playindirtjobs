const AUTOMATION_USER_AGENT =
  /bot|crawler|spider|crawling|headless|preview|slurp|facebookexternalhit|googleother|lighthouse|pagespeed|monitor|uptime|statuscake|pingdom|curl|wget|python-requests|python-urllib|httpclient|axios|node-fetch|undici|scrapy|phantomjs|selenium|playwright|puppeteer|slackbot|twitterbot|linkedinbot|discordbot|whatsapp/i;

const PREFETCH_HEADERS = ["purpose", "sec-purpose", "x-purpose", "x-moz"] as const;

type PublicEmployerEventProperties =
  | Record<string, string | number | boolean | null>
  | undefined;

export function employerEventDedupeDimensions(
  properties: PublicEmployerEventProperties
) {
  const source = properties?.source;
  const placement = properties?.placement;

  return {
    source: typeof source === "string" && source ? source : undefined,
    placement:
      typeof placement === "string" && placement ? placement : undefined,
  };
}

export function isLikelyAutomatedEmployerEvent(headers: Pick<Headers, "get">) {
  const userAgent = headers.get("user-agent")?.trim() ?? "";
  if (!userAgent || AUTOMATION_USER_AGENT.test(userAgent)) return true;

  if (
    headers.get("next-router-prefetch") !== null ||
    headers.get("x-middleware-prefetch") !== null
  ) {
    return true;
  }

  return PREFETCH_HEADERS.some((header) =>
    /prefetch|prerender/i.test(headers.get(header) ?? "")
  );
}

export function vercelCountryCode(headers: Pick<Headers, "get">) {
  const country = headers.get("x-vercel-ip-country")?.trim().toUpperCase();
  if (!country || !/^[A-Z]{2}$/.test(country) || country === "XX" || country === "ZZ") {
    return "unknown";
  }
  return country;
}
