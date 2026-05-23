/**
 * Get the base URL for the application based on environment
 * Uses NEXT_PUBLIC_APP_URL if available, otherwise falls back to production URL
 */
const PRODUCTION_URL = 'https://www.playindirtjobs.com';

export function getBaseUrl(): string {
  // In browser, use NEXT_PUBLIC_APP_URL if available
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_APP_URL || PRODUCTION_URL;
  }

  // In server-side rendering
  return process.env.NEXT_PUBLIC_APP_URL || PRODUCTION_URL;
}

/**
 * Get a full URL path for metadata
 */
export function getUrl(path: string = ''): string {
  const baseUrl = getBaseUrl();
  // Remove trailing slash from base and leading slash from path to avoid double slashes
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');

  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
}

export function normalizeMetaText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function truncateMetaText(text: string, maxLength: number): string {
  const normalized = normalizeMetaText(text);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const truncated = normalized.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  const cutPoint = lastSpace > 40 ? lastSpace : truncated.length;

  return `${truncated.slice(0, cutPoint).trim()}...`;
}
