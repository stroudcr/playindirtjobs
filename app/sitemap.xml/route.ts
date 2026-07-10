import { getBaseUrl } from "@/lib/metadata";
import { createSitemapIndexXml, xmlResponse } from "@/lib/sitemap-xml";

export const revalidate = 3600;

export function GET() {
  const baseUrl = getBaseUrl();

  return xmlResponse(
    createSitemapIndexXml([
      `${baseUrl}/sitemaps/jobs.xml`,
      `${baseUrl}/sitemaps/pages.xml`,
    ])
  );
}
