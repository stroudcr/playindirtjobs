/**
 * Get the base URL for the application based on environment
 * Uses NEXT_PUBLIC_APP_URL if available, otherwise falls back to production URL
 */
export function getBaseUrl(): string {
  // In browser, use NEXT_PUBLIC_APP_URL if available
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_APP_URL || 'https://playindirtjobs.com';
  }

  // In server-side rendering
  return process.env.NEXT_PUBLIC_APP_URL || 'https://playindirtjobs.com';
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
