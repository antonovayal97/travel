import 'dotenv/config'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../payload.config'
import {
  countryImagePools,
  destinationHeroes,
  pickTravelImage,
  regionImagePools,
  siteImages,
  unsplashUrl,
  type TravelImage,
} from '../lib/travel-images'

const execFileAsync = promisify(execFile)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tmpDir = path.resolve(__dirname, '../../.seed-tmp')

async function downloadImage(url: string, filename: string) {
  await fs.mkdir(tmpDir, { recursive: true })
  const filePath = path.join(tmpDir, filename)
  await execFileAsync(
    'curl',
    [
      '-fsSL',
      '--max-time',
      '60',
      '-A',
      'Mozilla/5.0 (compatible; MYTOUR-image-refresh/1.0)',
      '-o',
      filePath,
      url,
    ],
    { maxBuffer: 20 * 1024 * 1024 },
  )
  const stat = await fs.stat(filePath)
  if (stat.size < 5000) throw new Error(`Image too small: ${url}`)
  return filePath
}

async function createMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  image: TravelImage,
  filename: string,
) {
  const url = unsplashUrl(image.id, image.w || 1920)
  const filePath = await downloadImage(url, filename)
  const data = await fs.readFile(filePath)
  return payload.create({
    collection: 'media',
    data: { alt: image.alt, caption: image.alt },
    file: {
      data,
      mimetype: 'image/jpeg',
      name: filename,
      size: data.length,
    },
  })
}

async function refresh() {
  const payload = await getPayload({ config })
  console.log('Refreshing travel photos…')

  const cache = new Map<string, string>()

  async function ensureImage(image: TravelImage, filename: string) {
    const key = `${image.id}:${filename}`
    if (cache.has(key)) return cache.get(key)!
    const media = await createMedia(payload, image, filename)
    cache.set(key, media.id)
    console.log(`  + media ${filename}`)
    return media.id
  }

  // Destinations
  const destinations = await payload.find({
    collection: 'destinations',
    limit: 50,
    depth: 0,
  })

  for (const destination of destinations.docs) {
    const slug = destination.slug
    const hero =
      destinationHeroes[slug] ||
      (destination.country && countryImagePools[destination.country]?.[0]) ||
      siteImages.hero

    const mediaId = await ensureImage(hero, `dest-${slug}.jpg`)
    await payload.update({
      collection: 'destinations',
      id: destination.id,
      data: { heroImage: mediaId },
    })
    console.log(`Destination ${destination.title} → ${hero.alt}`)
  }

  // Tours
  const tours = await payload.find({
    collection: 'tours',
    limit: 200,
    depth: 1,
    where: { published: { equals: true } },
  })

  for (const tour of tours.docs) {
    const destination =
      typeof tour.destination === 'object' && tour.destination
        ? tour.destination
        : null
    const country = destination?.country || destination?.title || 'Вьетнам'
    const haystack = `${tour.title} ${tour.shortDescription || ''} ${tour.accommodation || ''} ${destination?.title || ''}`
    const region =
      Object.keys(regionImagePools).find((name) => haystack.includes(name)) || ''

    const image = pickTravelImage(country, region, tour.slug)
    const mediaId = await ensureImage(image, `tour-${tour.slug.slice(0, 60)}.jpg`)
    await payload.update({
      collection: 'tours',
      id: tour.id,
      data: { heroImage: mediaId },
    })
    console.log(`Tour ${tour.title} → ${image.alt}`)
  }

  // Team photos
  const team = await payload.find({ collection: 'team', limit: 20, depth: 0 })
  const teamPhotoId = await ensureImage(siteImages.team, 'team-portrait.jpg')
  for (const member of team.docs) {
    await payload.update({
      collection: 'team',
      id: member.id,
      data: { photo: teamPhotoId },
    })
  }
  if (team.docs.length) console.log(`Updated ${team.docs.length} team photos`)

  // Homepage blocks
  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 0 })
  const layout = Array.isArray(homepage.layout) ? [...homepage.layout] : []

  const heroId = await ensureImage(siteImages.hero, 'homepage-hero.jpg')
  const storyId = await ensureImage(siteImages.story, 'homepage-story.jpg')
  const galleryIds = []
  for (const [index, image] of siteImages.gallery.entries()) {
    galleryIds.push(await ensureImage(image, `gallery-${index + 1}.jpg`))
  }

  const nextLayout = layout.map((block) => {
    if (!block || typeof block !== 'object') return block
    const type = 'blockType' in block ? block.blockType : null

    if (type === 'hero') {
      return { ...block, backgroundImage: heroId }
    }
    if (type === 'story') {
      return { ...block, image: storyId }
    }
    if (type === 'gallery') {
      return {
        ...block,
        images: galleryIds.map((image) => ({ image })),
      }
    }
    if (type === 'cta') {
      return { ...block, backgroundImage: galleryIds[0] || heroId }
    }
    return block
  })

  await payload.updateGlobal({
    slug: 'homepage',
    data: { layout: nextLayout as never },
  })
  console.log('Homepage images updated')

  await fs.rm(tmpDir, { recursive: true, force: true })
  console.log('Done.')
  process.exit(0)
}

refresh().catch((error) => {
  console.error(error)
  process.exit(1)
})
