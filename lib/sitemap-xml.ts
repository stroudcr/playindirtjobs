export type SitemapEntry = {
  url: string;
  lastModified?: Date | string;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function createSitemapXml(entries: SitemapEntry[]) {
  const urls = entries.map(({ url, lastModified }) => {
    const lastmod = lastModified
      ? `\n    <lastmod>${escapeXml(new Date(lastModified).toISOString())}</lastmod>`
      : "";

    return `  <url>\n    <loc>${escapeXml(url)}</loc>${lastmod}\n  </url>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function createSitemapIndexXml(urls: string[]) {
  const sitemaps = urls.map(
    (url) => `  <sitemap>\n    <loc>${escapeXml(url)}</loc>\n  </sitemap>`
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemaps,
    "</sitemapindex>",
    "",
  ].join("\n");
}

export function xmlResponse(xml: string, maxAgeSeconds = 3600) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, max-age=0, s-maxage=${maxAgeSeconds}, stale-while-revalidate=86400`,
    },
  });
}
