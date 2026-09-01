export const SENSITIVE_ANALYTICS_ROOTS = [
  "/admin",
  "/employer",
  "/manage",
  "/success",
  "/unsubscribe",
] as const;

export function isSensitiveAnalyticsPath(pathname: string) {
  return SENSITIVE_ANALYTICS_ROOTS.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`)
  );
}

export function excludeSensitiveAnalyticsEvent<T extends { url: string }>(event: T) {
  try {
    const pathname = new URL(event.url, "https://playindirtjobs.com").pathname;
    return isSensitiveAnalyticsPath(pathname) ? null : event;
  } catch {
    return null;
  }
}

export function sanitizeSuccessAnalyticsEvent<T extends { url: string }>(event: T) {
  try {
    const url = new URL(event.url, "https://playindirtjobs.com");
    if (url.pathname === "/success") {
      url.search = "";
      url.hash = "";
      return { ...event, url: url.toString() };
    }
    return isSensitiveAnalyticsPath(url.pathname) ? null : event;
  } catch {
    return null;
  }
}
