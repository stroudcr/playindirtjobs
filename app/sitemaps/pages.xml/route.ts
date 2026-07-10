import { db } from "@/lib/db";
import { almanacArticles } from "@/lib/almanac-content";
import { getStateCode, getStateSlug, US_STATES_WITHOUT_DC } from "@/lib/constants";
import { getBaseUrl } from "@/lib/metadata";
import { pressReleases } from "@/lib/press-releases";
import { createSitemapXml, type SitemapEntry, xmlResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "",
  "/post-job",
  "/farming-jobs",
  "/gardening-jobs",
  "/ranch-jobs",
  "/organic-farm-jobs",
  "/farm-apprenticeships",
  "/faq",
  "/job-alerts",
  "/about",
  "/pricing",
  "/contact",
  "/press",
  "/press/releases",
  "/terms",
  "/privacy",
  "/almanac",
];

async function getStateModificationDates() {
  const jobs = await db.job.findMany({
    where: {
      active: true,
      expiresAt: { gte: new Date() },
    },
    select: {
      state: true,
      updatedAt: true,
    },
  });

  const dates = new Map<string, Date>();

  for (const job of jobs) {
    const stateCode = getStateCode(job.state).toUpperCase();
    const current = dates.get(stateCode);

    if (!current || job.updatedAt > current) {
      dates.set(stateCode, job.updatedAt);
    }
  }

  return dates;
}

export async function GET() {
  const baseUrl = getBaseUrl();
  let stateModificationDates = new Map<string, Date>();

  try {
    stateModificationDates = await getStateModificationDates();
  } catch (error) {
    console.error("Failed to load state sitemap modification dates:", error);
  }

  const entries: SitemapEntry[] = [
    ...STATIC_PATHS.map((path) => ({ url: `${baseUrl}${path}` })),
    ...US_STATES_WITHOUT_DC.map((state) => ({
      url: `${baseUrl}/${getStateSlug(state.code)}-jobs`,
      lastModified: stateModificationDates.get(state.code),
    })),
    ...almanacArticles.map((article) => ({
      url: `${baseUrl}/almanac/${article.slug}`,
      lastModified: article.date,
    })),
    ...pressReleases.map((release) => ({
      url: `${baseUrl}/press/releases/${release.slug}`,
      lastModified: release.date,
    })),
  ];

  return xmlResponse(createSitemapXml(entries));
}
