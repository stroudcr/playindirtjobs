"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";

import { GoogleAnalytics } from "@/components/GoogleAnalytics";

function isSensitivePath(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/employer") ||
    pathname.startsWith("/manage/") ||
    pathname.startsWith("/success") ||
    pathname.startsWith("/unsubscribe")
  );
}

export function SiteAnalytics() {
  const pathname = usePathname();
  if (isSensitivePath(pathname)) return null;

  return (
    <>
      <GoogleAnalytics />
      <Analytics />
    </>
  );
}
