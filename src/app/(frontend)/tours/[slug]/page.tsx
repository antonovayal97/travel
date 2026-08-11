import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { MediaImage } from '@/components/ui/MediaImage'
import { Button } from '@/components/ui/Button'
import { BookingForm } from '@/components/forms/BookingForm'
import { RichTextContent } from '@/components/ui/RichTextContent'
import { FaqAccordion } from '@/components/ui/FaqAccordion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  getFaqs,
  getSiteSettings,
  getTestimonials,
  getTourBySlug,
  getTours,
} from '@/lib/payload'
import { formatPrice, getMediaUrl } from '@/lib/utils'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const tours = await getTours({ limit: 100 })
  return tours.docs.map((tour) => ({ slug: tour.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const [tour, settings] = await Promise.all([getTourBySlug(slug), getSiteSettings()])
  if (!tour) return { title: 'Тур не найден' }

  const company = settings.companyName || 'AURA Travel'
  const title = tour.seo?.title || `${tour.title} — ${company}`
  const description = tour.seo?.description || tour.shortDescription
  const image = getMediaUrl(tour.seo?.image as never) || getMediaUrl(tour.heroImage as never)

  return {
    title: tour.seo?.title || tour.title,
    description,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: tour.seo?.noIndex ? { index: false, follow: false } : undefined,
  }
}

export default async function TourPage({ params }: { params: Params }) {
  const { slug } = await params
  const tour = await getTourBySlug(slug)
  if (!tour) notFound()

  const destination =
    typeof tour.destination === 'object' && tour.destination ? tour.destination : null

  const [testimonials, faqs] = await Promise.all([
    getTestimonials({ tour: tour.id, limit: 4 }),
    getFaqs(6),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.shortDescription,
    touristType: tour.tourType,
    offers: {
      '@type': 'Offer',
      price: tour.price,
      priceCurrency: tour.currency || 'RUB',
    },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Туры', item: '/tours' },
      { '@type': 'ListItem', position: 3, name: tour.title, item: `/tours/${tour.slug}` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.docs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="relative min-h-[70svh] overflow-hidden">
        <div className="absolute inset-0">
          <MediaImage
            media={tour.heroImage as never}
            fill
            priority
            sizeHint="hero"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-28 md:px-8">
          <p className="mb-3 text-xs tracking-[0.24em] uppercase text-white/70">
            {destination?.title} · {tour.duration} дней
          </p>
          <h1 className="max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white">
            {tour.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-white/85">
            <span className="text-xl">от {formatPrice(tour.price, tour.currency || 'RUB')}</span>
            {tour.rating ? (
              <span>
                ★ {tour.rating.toFixed(1)}
                {tour.reviewsCount ? ` · ${tour.reviewsCount} отзывов` : ''}
              </span>
            ) : null}
            <Button href="#booking">Забронировать</Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-16 md:grid-cols-[1.4fr_0.8fr] md:gap-20 md:px-8 md:py-24">
        <div className="space-y-14">
          <section>
            <SectionHeading title="О путешествии" className="mb-6" />
            <p className="mb-6 text-lg text-[var(--color-muted)]">{tour.shortDescription}</p>
            <RichTextContent data={tour.description as never} />
          </section>

          {tour.itinerary?.length ? (
            <section>
              <SectionHeading title="Программа" className="mb-8" />
              <div className="space-y-6">
                {tour.itinerary.map((day) => (
                  <div
                    key={day.id || day.day}
                    className="grid gap-4 border-t border-[var(--color-border)] pt-6 md:grid-cols-[5rem_1fr]"
                  >
                    <p className="text-xs tracking-[0.18em] uppercase text-[var(--color-muted)]">
                      День {day.day}
                    </p>
                    <div>
                      <h3 className="font-display text-2xl text-[var(--color-charcoal)]">
                        {day.title}
                      </h3>
                      <p className="mt-3 text-[var(--color-muted)] leading-relaxed">
                        {day.description}
                      </p>
                      {day.locations?.length ? (
                        <p className="mt-3 text-sm text-[var(--color-forest)]">
                          {day.locations.map((l) => l.name).join(' · ')}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 font-display text-2xl">Что включено</h3>
              <ul className="space-y-3">
                {tour.included?.map((item) => (
                  <li key={item.id || item.item} className="flex gap-3 text-[var(--color-muted)]">
                    <Check className="mt-0.5 size-4 text-[var(--color-forest)]" />
                    <span>{item.item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-display text-2xl">Что не включено</h3>
              <ul className="space-y-3">
                {tour.notIncluded?.map((item) => (
                  <li key={item.id || item.item} className="flex gap-3 text-[var(--color-muted)]">
                    <X className="mt-0.5 size-4 text-[var(--color-muted)]" />
                    <span>{item.item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {tour.accommodation ? (
              <div className="border-t border-[var(--color-border)] pt-5">
                <h3 className="font-display text-xl">Проживание</h3>
                <p className="mt-3 text-[var(--color-muted)]">{tour.accommodation}</p>
              </div>
            ) : null}
            {tour.transport ? (
              <div className="border-t border-[var(--color-border)] pt-5">
                <h3 className="font-display text-xl">Транспорт</h3>
                <p className="mt-3 text-[var(--color-muted)]">{tour.transport}</p>
              </div>
            ) : null}
            {tour.guide ? (
              <div className="border-t border-[var(--color-border)] pt-5">
                <h3 className="font-display text-xl">Гид</h3>
                <p className="mt-3 text-[var(--color-muted)]">{tour.guide}</p>
              </div>
            ) : null}
          </section>

          {testimonials.docs.length ? (
            <section>
              <SectionHeading title="Отзывы" className="mb-6" />
              <div className="space-y-4">
                {testimonials.docs.map((item) => (
                  <blockquote
                    key={item.id}
                    className="border border-[var(--color-border)] p-5 md:p-6"
                  >
                    <p className="font-display text-xl leading-snug">“{item.text}”</p>
                    <footer className="mt-4 text-sm text-[var(--color-muted)]">{item.name}</footer>
                  </blockquote>
                ))}
              </div>
            </section>
          ) : null}

          {faqs.docs.length ? (
            <FaqAccordion
              items={faqs.docs.map((faq) => ({
                id: faq.id,
                question: faq.question,
                answer: faq.answer,
              }))}
            />
          ) : null}
        </div>

        <aside id="booking" className="md:sticky md:top-28 md:self-start">
          <BookingForm
            tourId={tour.id}
            destinationId={destination?.id}
            tourTitle={tour.title}
          />
        </aside>
      </div>
    </article>
  )
}
