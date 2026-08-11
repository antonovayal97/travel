import 'dotenv/config'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tmpDir = path.resolve(__dirname, '../../.seed-tmp')

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
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) {
    // fallback to picsum
    const fallback = await fetch(`https://picsum.photos/seed/${filename}/1600/1000`, {
      redirect: 'follow',
    })
    if (!fallback.ok) throw new Error(`Failed to download ${url}`)
    const buffer = Buffer.from(await fallback.arrayBuffer())
    await fs.writeFile(filePath, buffer)
    return filePath
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(filePath, buffer)
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

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding AURA Travel…')

  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (!existingUsers.docs.length) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@aura.travel',
        password: 'aura-admin-2026',
      },
    })
    console.log('Admin: admin@aura.travel / aura-admin-2026')
  }

  const images = {
    japan: await createMedia(
      payload,
      'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=1920&q=85',
      'japan-hero.jpg',
      'Гора Фудзи, Япония',
    ),
    iceland: await createMedia(
      payload,
      'https://images.unsplash.com/photo-1531168556467-80aace0d0144?auto=format&fit=crop&w=1920&q=85',
      'iceland-hero.jpg',
      'Исландские фьорды и зелёные холмы',
    ),
    norway: await createMedia(
      payload,
      'https://images.unsplash.com/photo-1663428520845-056989f8a664?auto=format&fit=crop&w=1920&q=85',
      'norway-hero.jpg',
      'Фьорды Норвегии',
    ),
    italy: await createMedia(
      payload,
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1920&q=85',
      'italy-hero.jpg',
      'Венеция, мост Риальто',
    ),
    georgia: await createMedia(
      payload,
      'https://images.unsplash.com/photo-1603350576276-24747f7bbf40?auto=format&fit=crop&w=1920&q=85',
      'georgia-hero.jpg',
      'Тбилиси с высоты',
    ),
    bali: await createMedia(
      payload,
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1920&q=85',
      'bali-hero.jpg',
      'Рисовые террасы Бали',
    ),
    hero: await createMedia(
      payload,
      'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=2400&q=85',
      'homepage-hero.jpg',
      'Тропический берег с пальмами',
    ),
    story: await createMedia(
      payload,
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=85',
      'story.jpg',
      'Горное озеро на рассвете',
    ),
    team: await createMedia(
      payload,
      'https://images.unsplash.com/photo-1783746893030-40e69586d559?auto=format&fit=crop&w=1000&q=85',
      'team.jpg',
      'Куратор путешествий у воды',
    ),
  }

  const destinationsData = [
    {
      title: 'Japan',
      slug: 'japan',
      country: 'Япония',
      shortDescription: 'Токио, Киото и тихие храмы за пределами туристических маршрутов.',
      bestTimeToVisit: 'Март–май, сентябрь–ноябрь',
      averagePrice: 420000,
      featured: true,
      heroImage: images.japan.id,
      coordinates: { lat: 35.6762, lng: 139.6503 },
      description: richText([
        'Япония для нас — это ритм мегаполиса и почти священная тишина садов.',
        'Мы соединяем современный Токио, классический Киото и локальные впечатления, которые редко попадают в стандартные туры.',
      ]),
      highlights: [
        {
          title: 'Токио',
          description: 'Современная архитектура, кухня и ночные районы.',
          image: images.japan.id,
        },
        {
          title: 'Киото',
          description: 'Храмы, чайные традиции и сады.',
          image: images.japan.id,
        },
      ],
    },
    {
      title: 'Iceland',
      slug: 'iceland',
      country: 'Исландия',
      shortDescription: 'Чёрные пляжи, геотермальные лагуны и северное сияние.',
      bestTimeToVisit: 'Июнь–август, сентябрь–март (aurora)',
      averagePrice: 380000,
      featured: true,
      heroImage: images.iceland.id,
      coordinates: { lat: 64.1466, lng: -21.9426 },
      description: richText([
        'Исландия — страна контрастов: огонь и лёд, тишина и ветер.',
        'Маршруты строим вокруг природы, которая выглядит как другой мир.',
      ]),
    },
    {
      title: 'Norway',
      slug: 'norway',
      country: 'Норвегия',
      shortDescription: 'Фьорды, горные дороги и скандинавская эстетика.',
      bestTimeToVisit: 'Май–сентябрь',
      averagePrice: 450000,
      featured: true,
      heroImage: images.norway.id,
      coordinates: { lat: 60.472, lng: 8.4689 },
      description: richText([
        'Норвегия — о медленном путешествии среди фьордов и северного света.',
      ]),
    },
    {
      title: 'Italy',
      slug: 'italy',
      country: 'Италия',
      shortDescription: 'Тоскана, Амальфи и искусство жить красиво.',
      bestTimeToVisit: 'Апрель–июнь, сентябрь–октябрь',
      averagePrice: 320000,
      featured: true,
      heroImage: images.italy.id,
      coordinates: { lat: 41.8719, lng: 12.5674 },
      description: richText(['Италия — гастрономия, архитектура и dolce vita.']),
    },
    {
      title: 'Georgia',
      slug: 'georgia',
      country: 'Грузия',
      shortDescription: 'Горы, вино и гостеприимство Кавказа.',
      bestTimeToVisit: 'Май–октябрь',
      averagePrice: 180000,
      featured: true,
      heroImage: images.georgia.id,
      coordinates: { lat: 41.7151, lng: 44.8271 },
      description: richText(['Грузия — близко по духу и богата вкусом, пейзажами и историей.']),
    },
    {
      title: 'Bali',
      slug: 'bali',
      country: 'Индонезия',
      shortDescription: 'Рисовые террасы, океаны и ритуалы острова богов.',
      bestTimeToVisit: 'Апрель–октябрь',
      averagePrice: 290000,
      featured: true,
      heroImage: images.bali.id,
      coordinates: { lat: -8.3405, lng: 115.092 },
      description: richText(['Бали — баланс природы, культуры и спокойного ритма.']),
    },
  ]

  const destinationIds: Record<string, string> = {}
  for (const item of destinationsData) {
    const existing = await payload.find({
      collection: 'destinations',
      where: { slug: { equals: item.slug } },
      limit: 1,
    })
    const doc =
      existing.docs[0] ||
      (await payload.create({
        collection: 'destinations',
        data: item,
      }))
    destinationIds[item.slug] = doc.id
    console.log('Destination:', item.title)
  }

  const toursData = [
    {
      title: 'Tokyo & Quiet Japan',
      slug: 'tokyo-quiet-japan',
      shortDescription: '8 дней между неоном Токио и тишиной Киото.',
      destination: destinationIds.japan,
      duration: 8,
      price: 459000,
      oldPrice: 520000,
      currency: 'RUB' as const,
      rating: 4.9,
      reviewsCount: 128,
      tourType: 'culture' as const,
      difficulty: 'easy' as const,
      maxPeople: 10,
      featured: true,
      published: true,
      heroImage: images.japan.id,
      description: richText([
        'Авторский маршрут по Японии с акцентом на атмосферу, кухню и локальные ритуалы.',
      ]),
      included: [
        { item: 'Проживание в boutique-отелях' },
        { item: 'Завтраки' },
        { item: 'Трансферы и JR Pass' },
        { item: 'Локальный гид' },
      ],
      notIncluded: [{ item: 'Международный перелёт' }, { item: 'Личные расходы' }],
      accommodation: 'Boutique hotels 4★ в Токио и Киото',
      transport: 'Поезда Shinkansen и частные трансферы',
      guide: 'Русскоязычный куратор и локальные гиды',
      itinerary: [
        {
          day: 1,
          title: 'Tokyo Arrival',
          description: 'Встреча в аэропорту, трансфер, вечерняя прогулка по Yanaka.',
          locations: [{ name: 'Токио' }],
          meals: ['dinner' as const],
        },
        {
          day: 2,
          title: 'Tokyo',
          description: 'Современная архитектура, рынки и частная чайная церемония.',
          locations: [{ name: 'Shibuya' }, { name: 'Omotesando' }],
          meals: ['breakfast' as const, 'lunch' as const],
        },
        {
          day: 3,
          title: 'Mount Fuji',
          description: 'День у подножия Фудзи и озера Кавагути.',
          locations: [{ name: 'Kawaguchiko' }],
          meals: ['breakfast' as const],
        },
      ],
    },
    {
      title: 'Iceland Wild North',
      slug: 'iceland-wild-north',
      shortDescription: '7 дней среди водопадов, лагун и чёрных пляжей.',
      destination: destinationIds.iceland,
      duration: 7,
      price: 398000,
      currency: 'RUB' as const,
      rating: 4.8,
      reviewsCount: 86,
      tourType: 'adventure' as const,
      difficulty: 'medium' as const,
      maxPeople: 8,
      featured: true,
      published: true,
      heroImage: images.iceland.id,
      description: richText(['Приключенческий маршрут по югу и западу Исландии.']),
      included: [{ item: 'Отели и гестхаусы' }, { item: 'Аренда авто / водитель' }],
      notIncluded: [{ item: 'Перелёт' }],
      accommodation: 'Дизайн-отели и lodges',
      transport: 'Внедорожник с водителем',
      guide: 'Локальный гид-натуралист',
      itinerary: [
        {
          day: 1,
          title: 'Reykjavik',
          description: 'Прибытие и знакомство с городом.',
          locations: [{ name: 'Reykjavik' }],
          meals: ['dinner' as const],
        },
        {
          day: 2,
          title: 'Golden Circle',
          description: 'Гейзеры, водопады и национальный парк.',
          locations: [{ name: 'Thingvellir' }],
          meals: ['breakfast' as const],
        },
      ],
    },
    {
      title: 'Norway Fjord Escape',
      slug: 'norway-fjord-escape',
      shortDescription: 'Спокойное путешествие по фьордам и горным дорогам.',
      destination: destinationIds.norway,
      duration: 9,
      price: 510000,
      currency: 'RUB' as const,
      rating: 4.9,
      reviewsCount: 64,
      tourType: 'nature' as const,
      difficulty: 'easy' as const,
      maxPeople: 8,
      featured: true,
      published: true,
      heroImage: images.norway.id,
      description: richText(['Скандинавский slow travel среди фьордов.']),
      included: [{ item: 'Проживание' }, { item: 'Завтраки' }],
      notIncluded: [{ item: 'Перелёт' }],
      accommodation: 'Boutique lodges у фьордов',
      transport: 'Поезда и паром',
      guide: 'Куратор путешествия',
      itinerary: [
        {
          day: 1,
          title: 'Bergen',
          description: 'Прибытие в Берген.',
          locations: [{ name: 'Bergen' }],
          meals: ['dinner' as const],
        },
      ],
    },
  ]

  const tourIds: Record<string, string> = {}
  for (const tour of toursData) {
    const existing = await payload.find({
      collection: 'tours',
      where: { slug: { equals: tour.slug } },
      limit: 1,
    })
    const doc =
      existing.docs[0] ||
      (await payload.create({
        collection: 'tours',
        data: tour,
      }))
    tourIds[tour.slug] = doc.id
    console.log('Tour:', tour.title)
  }

  const testimonials = [
    {
      name: 'Анна К.',
      text: 'Это было не просто путешествие, а история, в которую хочется возвращаться.',
      rating: 5,
      featured: true,
      tour: tourIds['tokyo-quiet-japan'],
      destination: destinationIds.japan,
      date: '2025-11-12',
    },
    {
      name: 'Игорь М.',
      text: 'Исландия выглядела как кино. Организация безупречная.',
      rating: 5,
      featured: true,
      tour: tourIds['iceland-wild-north'],
      destination: destinationIds.iceland,
      date: '2025-09-03',
    },
    {
      name: 'Мария С.',
      text: 'Норвегия в их исполнении — тишина, свет и идеальный ритм дней.',
      rating: 5,
      featured: true,
      tour: tourIds['norway-fjord-escape'],
      destination: destinationIds.norway,
      date: '2026-02-18',
    },
  ]

  for (const item of testimonials) {
    const existing = await payload.find({
      collection: 'testimonials',
      where: { name: { equals: item.name } },
      limit: 1,
    })
    if (!existing.docs.length) {
      await payload.create({ collection: 'testimonials', data: item })
    }
  }

  const faqs = [
    {
      question: 'Как проходит бронирование?',
      answer: 'Оставьте заявку — куратор свяжется с вами, уточнит детали и предложит маршрут.',
      category: 'booking' as const,
      order: 1,
      published: true,
    },
    {
      question: 'Можно ли изменить программу?',
      answer: 'Да, большинство туров адаптируются под ваш темп и интересы.',
      category: 'tours' as const,
      order: 2,
      published: true,
    },
    {
      question: 'Какие способы оплаты?',
      answer: 'Банковский перевод и онлайн-оплата. Возможна предоплата с последующим доплатой.',
      category: 'payment' as const,
      order: 3,
      published: true,
    },
  ]

  for (const faq of faqs) {
    const existing = await payload.find({
      collection: 'faqs',
      where: { question: { equals: faq.question } },
      limit: 1,
    })
    if (!existing.docs.length) {
      await payload.create({ collection: 'faqs', data: faq })
    }
  }

  const existingTeam = await payload.find({ collection: 'team', limit: 1 })
  if (!existingTeam.docs.length) {
    await payload.create({
      collection: 'team',
      data: {
        name: 'Елена Аура',
        position: 'Founder & Travel Curator',
        photo: images.team.id,
        bio: 'Создаёт маршруты, где важны атмосфера, вкус и смысл.',
        order: 1,
      },
    })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName: 'AURA Travel',
      phone: '+7 (495) 123-45-67',
      email: 'hello@aura.travel',
      address: 'Москва, Патриаршие пруды',
      telegram: 'https://t.me/auratravel',
      instagram: 'https://instagram.com/auratravel',
      vk: 'https://vk.com/auratravel',
      workingHours: 'Пн–Пт 10:00–19:00',
    },
  })

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navigation: [
        { label: 'Направления', href: '/destinations' },
        { label: 'Туры', href: '/tours' },
        { label: 'О компании', href: '/about' },
        { label: 'Отзывы', href: '/#testimonials' },
        { label: 'Контакты', href: '/contacts' },
      ],
      ctaText: 'Подобрать тур',
      ctaLink: '/contacts',
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          title: 'Путешествия',
          links: [
            { label: 'Туры', href: '/tours' },
            { label: 'Направления', href: '/destinations' },
          ],
        },
        {
          title: 'Компания',
          links: [
            { label: 'О нас', href: '/about' },
            { label: 'Контакты', href: '/contacts' },
          ],
        },
        {
          title: 'Поддержка',
          links: [
            { label: 'Часто задаваемые вопросы', href: '/contacts' },
            { label: 'Заявка', href: '/contacts' },
          ],
        },
      ],
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/auratravel' },
        { platform: 'telegram', url: 'https://t.me/auratravel' },
      ],
      copyright: '© AURA Travel. Все права защищены.',
      legalLinks: [
        { label: 'Политика конфиденциальности', href: '/contacts' },
        { label: 'Оферта', href: '/contacts' },
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'TRAVEL DIFFERENTLY',
          title: 'Путешествия, которые остаются с вами навсегда.',
          description:
            'Авторские маршруты, уникальные места и впечатления, которые невозможно получить в обычном туре.',
          backgroundImage: images.hero.id,
          primaryButton: { label: 'Найти путешествие', href: '/tours' },
          secondaryButton: { label: 'Исследовать направления', href: '/destinations' },
          statistics: [
            { value: '50+', label: 'направлений' },
            { value: '10', label: 'лет опыта' },
            { value: '5 000+', label: 'путешественников' },
          ],
        },
        {
          blockType: 'tourSearch',
          title: 'Найдите своё путешествие',
        },
        {
          blockType: 'destinations',
          eyebrow: 'DESTINATIONS',
          title: 'Куда отправимся?',
          description: 'Страны и регионы, где мы создаём незабываемые маршруты.',
          limit: 4,
          showFeaturedOnly: true,
        },
        {
          blockType: 'featuredTours',
          eyebrow: 'FEATURED JOURNEYS',
          title: 'Авторские маршруты',
          description: 'Тщательно собранные путешествия с сильным визуальным и эмоциональным сценарием.',
          limit: 3,
        },
        {
          blockType: 'story',
          eyebrow: 'OUR STORY',
          title: 'Мы продаём не туры. Мы создаём впечатления.',
          description:
            'AURA Travel — editorial approach к путешествиям: cinematic photography, slow itineraries и сервис без шума.',
          image: images.story.id,
          cta: { label: 'О компании', href: '/about' },
        },
        {
          blockType: 'benefits',
          title: 'Почему путешествуют с нами',
          items: [
            {
              title: 'Авторский подход',
              description: 'Каждый маршрут создаётся как история, а не как набор точек.',
            },
            {
              title: 'Личный куратор',
              description: 'Сопровождение на всех этапах — от идеи до возвращения домой.',
            },
            {
              title: 'Скрытые места',
              description: 'Локации за пределами массовых туристических сценариев.',
            },
            {
              title: 'Премиальный комфорт',
              description: 'Отели, трансферы и детали сервиса уровня luxury travel.',
            },
          ],
        },
        {
          blockType: 'testimonials',
          eyebrow: 'STORIES',
          title: 'Что говорят путешественники',
          limit: 3,
        },
        {
          blockType: 'gallery',
          title: 'Моменты путешествий',
          images: [
            { image: images.japan.id },
            { image: images.iceland.id },
            { image: images.norway.id },
            { image: images.bali.id },
          ],
        },
        {
          blockType: 'cta',
          title: 'Готовы к следующему путешествию?',
          description: 'Оставьте заявку — подберём маршрут под ваш ритм жизни.',
          primaryButton: { label: 'Подобрать тур', href: '/contacts' },
          backgroundImage: images.italy.id,
        },
      ],
    },
  })

  await fs.rm(tmpDir, { recursive: true, force: true })
  console.log('Seed completed.')
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
