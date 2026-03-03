import { MetadataRoute } from 'next'
import { getBaseUrl } from '@/lib/metadata'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()

  return {
    rules: [
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: [
          '/api/',
          '/post-job/preview',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: [
          '/api/',
          '/post-job/preview',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/post-job/preview',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/post-job/preview',
        ],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/post-job/preview',
          '/manage/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
