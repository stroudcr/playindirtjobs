import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { US_STATES_WITHOUT_DC, getStateSlug } from '@/lib/constants'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://playindirtjobs.com'

  // Get all active jobs
  let jobUrls: MetadataRoute.Sitemap = []

  try {
    const jobs = await db.job.findMany({
      where: {
        active: true,
        expiresAt: {
          gte: new Date()
        }
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    jobUrls = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching jobs for sitemap:', error)
    // If database is not available, just return static pages
  }

  // State pages (50 states)
  const statePages: MetadataRoute.Sitemap = US_STATES_WITHOUT_DC.map((state) => ({
    url: `${baseUrl}/${getStateSlug(state.code)}-jobs`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/post-job`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/farming-jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gardening-jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ranch-jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/organic-farm-jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/farm-apprenticeships`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  return [...staticPages, ...statePages, ...jobUrls]
}
