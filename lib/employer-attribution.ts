export const EMPLOYER_ATTRIBUTION_STORAGE_KEY =
  "pidj:employer-attribution:v1";

export const EMPLOYER_ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "msclkid",
] as const;

export type EmployerAttribution = Partial<
  Record<(typeof EMPLOYER_ATTRIBUTION_KEYS)[number], string>
>;

let sessionAttributionCache: EmployerAttribution = {};
let sessionAttributionCacheLoaded = false;

function sanitizeAttribution(value: unknown): EmployerAttribution {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const candidate = value as Record<string, unknown>;
  const attribution: EmployerAttribution = {};
  for (const key of EMPLOYER_ATTRIBUTION_KEYS) {
    const item = candidate[key];
    if (typeof item === "string" && item) {
      attribution[key] = item.slice(0, 300);
    }
  }
  return attribution;
}

export function employerAttributionFromSearch(
  currentSearch: string
): EmployerAttribution {
  const searchParams = new URLSearchParams(currentSearch);
  const attribution: EmployerAttribution = {};

  for (const key of EMPLOYER_ATTRIBUTION_KEYS) {
    const value = searchParams.get(key);
    if (value) attribution[key] = value.slice(0, 300);
  }

  return attribution;
}

function hasAttribution(attribution: EmployerAttribution) {
  return EMPLOYER_ATTRIBUTION_KEYS.some((key) => Boolean(attribution[key]));
}

function attributionMatches(
  left: EmployerAttribution,
  right: EmployerAttribution
) {
  return EMPLOYER_ATTRIBUTION_KEYS.every((key) => left[key] === right[key]);
}

function readSessionAttribution(): EmployerAttribution {
  if (typeof window === "undefined") return {};
  if (sessionAttributionCacheLoaded) return sessionAttributionCache;

  try {
    const stored = window.sessionStorage.getItem(
      EMPLOYER_ATTRIBUTION_STORAGE_KEY
    );
    sessionAttributionCache = stored
      ? sanitizeAttribution(JSON.parse(stored))
      : {};
  } catch {
    sessionAttributionCache = {};
  }
  sessionAttributionCacheLoaded = true;
  return sessionAttributionCache;
}

/**
 * Keeps only allowlisted acquisition data for the current browser tab. A new
 * tagged page becomes the latest non-direct touch; untagged navigation retains
 * the prior session value.
 */
export function resolveSessionEmployerAttribution(
  currentSearch: string
): EmployerAttribution {
  const current = employerAttributionFromSearch(currentSearch);
  if (!hasAttribution(current)) return readSessionAttribution();
  if (typeof window === "undefined") return current;
  if (
    sessionAttributionCacheLoaded &&
    attributionMatches(sessionAttributionCache, current)
  ) {
    return sessionAttributionCache;
  }

  sessionAttributionCache = current;
  sessionAttributionCacheLoaded = true;
  try {
    window.sessionStorage.setItem(
      EMPLOYER_ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(current)
    );
  } catch {
    // Current-page attribution still works when browser storage is unavailable.
  }
  return current;
}

export function resetSessionEmployerAttributionCacheForTests() {
  sessionAttributionCache = {};
  sessionAttributionCacheLoaded = false;
}
