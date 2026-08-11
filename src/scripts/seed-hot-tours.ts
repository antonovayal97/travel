import 'dotenv/config'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../payload.config'
import {
  destinationHeroes,
  pickTravelImage,
  unsplashUrl,
} from '../lib/travel-images'

const execFileAsync = promisify(execFile)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tmpDir = path.resolve(__dirname, '../../.seed-tmp')

const TOURVISOR_HOT_URL =
  'https://tourvisor.ru/xml/modhot.php?format=json&city=23&currency=0&regular=1&sortby=1&theme=theme1&view=1&imgpos=1&rows=33&needFilters=false&mobile=false'

type HotTour = {
  price: string
  priceold?: string
  tourid: string
  tourid2?: string
  countryname: string
  departure: string
  departurefrom?: string
  hotelcode: string
  hotelname: string
  hotelstars?: string
  hotelregionname: string
  hotelrating?: string
  hotelpicture?: string
  flydate: string
  nights: string
  meal?: string
  currency?: string
}

const mealMap: Record<string, string> = {
  '1': 'Без питания',
  '2': 'Завтрак',
  '3': 'Полупансион',
  '4': 'Полный пансион',
  '5': 'Всё включено',
  '6': 'Ультра всё включено',
  '7': 'Завтрак + ужин',
}

const translitMap: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
}

const countrySlugMap: Record<string, string> = {
  'Вьетнам': 'vietnam',
  'Таиланд': 'thailand',
  'Китай': 'china',
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .split('')
    .map((ch) => translitMap[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function richText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          {
            type: 'text',
            format: 0,
            text,
            mode: 'normal' as const,
            style: '',
            version: 1,
          },
        ],
      })),
    },
  }
}

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
      'Mozilla/5.0 (compatible; MYTOUR-seed/1.0)',
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
  url: string,
  filename: string,
  alt: string,
) {
  const filePath = await downloadImage(url, filename)
  const data = await fs.readFile(filePath)
  return payload.create({
    collection: 'media',
    data: { alt, caption: alt },
    file: {
      data,
      mimetype: 'image/jpeg',
      name: filename,
      size: data.length,
    },
  })
}

function parseDate(flydate: string) {
  // 21.08.2026
  const [dd, mm, yyyy] = flydate.split('.')
  if (!dd || !mm || !yyyy) return undefined
  return `${yyyy}-${mm}-${dd}`
}

async function ensureDestination(
  payload: Awaited<ReturnType<typeof getPayload>>,
  country: string,
  region: string,
  heroImageId: string,
) {
  const slug = countrySlugMap[country] || slugify(country)
  const existing = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.docs[0]) {
    await payload.update({
      collection: 'destinations',
      id: existing.docs[0].id,
      data: { heroImage: heroImageId },
    })
    return { ...existing.docs[0], heroImage: heroImageId }
  }

  return payload.create({
    collection: 'destinations',
    data: {
      title: country,
      slug,
      country,
      shortDescription: `Горящие туры в ${country}: ${region} и другие курорты. Вылет из Владивостока.`,
      description: richText([
        `Подборка актуальных предложений в ${country} от MYTOUR AGENCY.`,
        'Цены и даты обновляются по горящим предложениям Tourvisor.',
      ]),
      bestTimeToVisit: 'Круглый год — зависит от курорта',
      featured: true,
      heroImage: heroImageId,
      averagePrice: 60000,
    },
  })
}

const destinationMediaCache: Record<string, string> = {}

async function ensureDestinationMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  country: string,
) {
  const slug = countrySlugMap[country] || slugify(country)
  if (destinationMediaCache[slug]) return destinationMediaCache[slug]

  const hero =
    destinationHeroes[slug] ||
    pickTravelImage(country, '', slug)

  const media = await createMedia(
    payload,
    unsplashUrl(hero.id, 1920),
    `dest-${slug}.jpg`,
    hero.alt,
  )
  destinationMediaCache[slug] = media.id
  return media.id
}

async function seed() {
  const payload = await getPayload({ config })
  console.log('Fetching hot tours from Tourvisor (mytour-agency.ru)…')

  const res = await fetch(TOURVISOR_HOT_URL, {
    headers: {
      Referer: 'https://mytour-agency.ru/goryashchie-tury',
      'User-Agent': 'Mozilla/5.0',
    },
  })
  if (!res.ok) throw new Error(`Tourvisor request failed: ${res.status}`)
  const json = (await res.json()) as { hot?: HotTour[]; hotcount?: string }
  const hot = json.hot || []
  console.log(`Loaded ${hot.length} hot tours`)

  // Unpublish old demo tours (keep history)
  const oldTours = await payload.find({
    collection: 'tours',
    where: {
      or: [
        { slug: { equals: 'tokyo-quiet-japan' } },
        { slug: { equals: 'iceland-wild-north' } },
        { slug: { equals: 'norway-fjord-escape' } },
      ],
    },
    limit: 20,
  })
  for (const tour of oldTours.docs) {
    await payload.update({
      collection: 'tours',
      id: tour.id,
      data: { published: false, featured: false },
    })
  }

  const destinationCache: Record<string, string> = {}
  let created = 0
  let updated = 0

  for (const [index, item] of hot.entries()) {
    const nights = Number(item.nights) || 7
    const price = Number(String(item.price).replace(/\s/g, '')) || 0
    const oldPrice = Number(String(item.priceold || '').replace(/\s/g, '')) || undefined
    const stars = Number(item.hotelstars) || 0
    const rating = Number(item.hotelrating) || (stars ? Math.min(5, stars + 0.5) : 4.5)
    const meal = mealMap[item.meal || ''] || 'Уточняется'
    const slugBase = slugify(`${item.hotelname}-${item.hotelregionname}-${item.nights}n`)
    const slug = `${slugBase}-${item.hotelcode}`
    const flyDate = parseDate(item.flydate)

    const travelImage = pickTravelImage(
      item.countryname,
      item.hotelregionname,
      item.hotelcode,
    )

    let mediaId: string
    try {
      const media = await createMedia(
        payload,
        unsplashUrl(travelImage.id, 1600),
        `tour-${item.hotelcode}.jpg`,
        `${travelImage.alt} — ${item.hotelname}`,
      )
      mediaId = media.id
    } catch (error) {
      console.warn('Image failed for', item.hotelname, error)
      continue
    }

    if (!destinationCache[item.countryname]) {
      const destinationHeroId = await ensureDestinationMedia(payload, item.countryname)
      const destination = await ensureDestination(
        payload,
        item.countryname,
        item.hotelregionname,
        destinationHeroId,
      )
      destinationCache[item.countryname] = destination.id
    }

    const discount =
      oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

    const title = `${item.hotelname} — ${item.hotelregionname}`
    const shortDescription = `Горящий тур: ${item.hotelregionname}, ${item.countryname}. Вылет из ${item.departure}, ${item.nights} ночей${flyDate ? `, вылет ${item.flydate}` : ''}.${discount ? ` Скидка ${discount}%.` : ''}`

    const tourData = {
      title,
      slug,
      shortDescription,
      description: richText([
        `Горящее предложение с сайта MYTOUR AGENCY.`,
        `Отель ${item.hotelname}${stars ? ` ${stars}★` : ''} в курорте ${item.hotelregionname}, ${item.countryname}.`,
        `Вылет из ${item.departure}${flyDate ? ` ${item.flydate}` : ''}, продолжительность ${nights} ночей.`,
        `Питание: ${meal}.`,
        discount ? `Старая цена ${oldPrice?.toLocaleString('ru-RU')} ₽, сейчас ${price.toLocaleString('ru-RU')} ₽.` : `Цена от ${price.toLocaleString('ru-RU')} ₽.`,
      ]),
      destination: destinationCache[item.countryname],
      duration: nights + 1,
      price,
      oldPrice: oldPrice && oldPrice > price ? oldPrice : undefined,
      currency: 'RUB' as const,
      rating,
      reviewsCount: Math.max(5, Math.round(rating * 20)),
      tourType: 'relax' as const,
      difficulty: 'easy' as const,
      maxPeople: 4,
      featured: index < 9,
      published: true,
      heroImage: mediaId,
      accommodation: `${item.hotelname}${stars ? `, ${stars}★` : ''}, ${item.hotelregionname}`,
      transport: `Авиаперелёт из ${item.departure}`,
      guide: 'Поддержка менеджера MYTOUR AGENCY',
      included: [
        { item: 'Авиаперелёт' },
        { item: 'Проживание в отеле' },
        { item: meal },
        { item: 'Трансфер (по условиям тура)' },
      ],
      notIncluded: [{ item: 'Виза (если требуется)' }, { item: 'Личные расходы' }],
      itinerary: [
        {
          day: 1,
          title: `Вылет из ${item.departure}`,
          description: `Старт тура ${item.flydate || ''}. Перелёт и трансфер в отель.`.trim(),
          locations: [{ name: item.departure }],
          meals: [] as ('breakfast' | 'lunch' | 'dinner')[],
        },
        {
          day: 2,
          title: item.hotelregionname,
          description: `Отдых в отеле ${item.hotelname}. Свободное время и пляжный отдых.`,
          locations: [{ name: item.hotelregionname }],
          meals: ['breakfast' as const],
        },
        {
          day: nights + 1,
          title: 'Возвращение',
          description: `Завершение тура и вылет обратно в ${item.departure}.`,
          locations: [{ name: item.departure }],
          meals: ['breakfast' as const],
        },
      ],
      seo: {
        title: `${title} — горящий тур`,
        description: shortDescription,
      },
    }

    const existing = await payload.find({
      collection: 'tours',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'tours',
        id: existing.docs[0].id,
        data: tourData,
      })
      updated += 1
    } else {
      await payload.create({
        collection: 'tours',
        data: tourData,
      })
      created += 1
    }

    console.log(`${existing.docs[0] ? 'Updated' : 'Created'}: ${title}`)
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName: 'MYTOUR AGENCY',
      phone: '+7 914 716 36 10',
      email: 'mytour.vvo@gmail.com',
      address: 'Владивосток / Якутск',
      telegram: 'https://t.me/mytouragency',
      instagram: 'https://www.instagram.com/mytour.agency',
      vk: 'https://vk.com/mytour_ykt',
      workingHours: 'Ежедневно',
    },
  })

  await fs.rm(tmpDir, { recursive: true, force: true })
  console.log(`Done. Created ${created}, updated ${updated}. Source: https://mytour-agency.ru/goryashchie-tury`)
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
