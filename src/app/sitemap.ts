import type { MetadataRoute } from 'next'
import { getDestinations, getTours } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const [tours, destinations] = await Promise.all([
    getTours({ limit: 200 }),
    getDestinations({ limit: 200 }),
  ])

  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/tours`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/destinations`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contacts`, changeFrequency: 'monthly', priority: 0.7 },
    ...tours.docs.map((tour) => ({
      url: `${base}/tours/${tour.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...destinations.docs.map((destination) => ({
      url: `${base}/destinations/${destination.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
