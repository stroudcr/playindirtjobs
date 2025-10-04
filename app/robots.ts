import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/post-job/preview',
        ],
      },
    ],
    sitemap: 'https://playindirtjobs.com/sitemap.xml',
  }
}
