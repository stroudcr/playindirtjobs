import { db } from "@/lib/db";
import { getBaseUrl } from "@/lib/metadata";
import { createSitemapXml, xmlResponse } from "@/lib/sitemap-xml";
import { unstable_cache } from "next/cache";
import { GOOGLE_JOB_POSTING_ELIGIBILITY_WHERE } from "@/lib/google-job-posting";

export const revalidate = 300;

const getJobs = unstable_cache(async () => {
  return db.job.findMany({
    where: {
      active: true,
      expiresAt: { gte: new Date() },
      ...GOOGLE_JOB_POSTING_ELIGIBILITY_WHERE,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}, ["sitemap-jobs"], {
  revalidate: 300,
  tags: ["public-jobs"],
});

export async function GET() {
  const baseUrl = getBaseUrl();

  try {
    const jobs = await getJobs();

    return xmlResponse(
      createSitemapXml(
        jobs.map((job) => ({
          url: `${baseUrl}/jobs/${job.slug}`,
          lastModified: job.updatedAt,
        }))
      ),
      300
    );
  } catch (error) {
    console.error("Failed to generate jobs sitemap:", error);
    return new Response("Unable to generate jobs sitemap", { status: 503 });
  }
}
