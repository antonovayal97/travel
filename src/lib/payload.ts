import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

export async function getPayloadClient() {
  return getPayload({ config })
}

export const getSiteSettings = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'site-settings', depth: 2 })
  },
  ['site-settings'],
  { tags: ['site-settings'], revalidate: 60 },
)

export const getHeader = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'header', depth: 2 })
  },
  ['header'],
  { tags: ['header'], revalidate: 60 },
)

export const getFooter = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'footer', depth: 1 })
  },
  ['footer'],
  { tags: ['footer'], revalidate: 60 },
)

export const getHomepage = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'homepage', depth: 3 })
  },
  ['homepage'],
  { tags: ['homepage'], revalidate: 60 },
)

export async function getDestinations(options?: {
  featured?: boolean
  limit?: number
}) {
  const payload = await getPayloadClient()
  const where: Where = {}
  if (options?.featured) {
    where.featured = { equals: true }
  }

  return payload.find({
    collection: 'destinations',
    where,
    limit: options?.limit ?? 12,
    depth: 2,
    sort: 'title',
  })
}

export async function getDestinationBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function getTours(options?: {
  featured?: boolean
  destination?: string
  tourType?: string
  difficulty?: string
  minPrice?: number
  maxPrice?: number
  minDuration?: number
  maxDuration?: number
  limit?: number
  page?: number
}) {
  const payload = await getPayloadClient()
  const and: Where[] = [{ published: { equals: true } }]

  if (options?.featured) {
    and.push({ featured: { equals: true } })
  }
  if (options?.destination) {
    const destination = await payload.find({
      collection: 'destinations',
      where: { slug: { equals: options.destination } },
      limit: 1,
      depth: 0,
    })
    const destinationId = destination.docs[0]?.id
    if (destinationId) {
      and.push({ destination: { equals: destinationId } })
    } else {
      and.push({ id: { equals: 'none' } })
    }
  }
  if (options?.tourType) {
    and.push({ tourType: { equals: options.tourType } })
  }
  if (options?.difficulty) {
    and.push({ difficulty: { equals: options.difficulty } })
  }
  if (options?.minPrice !== undefined) {
    and.push({ price: { greater_than_equal: options.minPrice } })
  }
  if (options?.maxPrice !== undefined) {
    and.push({ price: { less_than_equal: options.maxPrice } })
  }
  if (options?.minDuration !== undefined) {
    and.push({ duration: { greater_than_equal: options.minDuration } })
  }
  if (options?.maxDuration !== undefined) {
    and.push({ duration: { less_than_equal: options.maxDuration } })
  }

  return payload.find({
    collection: 'tours',
    where: { and },
    limit: options?.limit ?? 12,
    page: options?.page ?? 1,
    depth: 2,
    sort: '-featured',
  })
}

export async function getTourBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'tours',
    where: {
      and: [{ slug: { equals: slug } }, { published: { equals: true } }],
    },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function getTestimonials(options?: {
  featured?: boolean
  tour?: string
  destination?: string
  limit?: number
}) {
  const payload = await getPayloadClient()
  const where: Where = {}
  if (options?.featured) where.featured = { equals: true }
  if (options?.tour) where.tour = { equals: options.tour }
  if (options?.destination) where.destination = { equals: options.destination }

  return payload.find({
    collection: 'testimonials',
    where,
    limit: options?.limit ?? 6,
    depth: 1,
    sort: '-date',
  })
}

export async function getFaqs(limit = 10) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'faqs',
    where: { published: { equals: true } },
    limit,
    sort: 'order',
  })
}

export async function getTeam() {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'team',
    limit: 20,
    depth: 1,
    sort: 'order',
  })
}
