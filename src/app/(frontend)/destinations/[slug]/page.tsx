import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MediaImage } from '@/components/ui/MediaImage'
import { Button } from '@/components/ui/Button'
import { TourCard } from '@/components/tours/Cards'
import { BookingForm } from '@/components/forms/BookingForm'
import { RichTextContent } from '@/components/ui/RichTextContent'
import { FaqAccordion } from '@/components/ui/FaqAccordion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  getDestinationBySlug,
  getDestinations,
  getFaqs,
  getSiteSettings,
  getTestimonials,
  getTours,
} from '@/lib/payload'
import { formatPrice, getMediaUrl } from '@/lib/utils'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const destinations = await getDestinations({ limit: 100 })
  return destinations.docs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const [destination, settings] = await Promise.all([
    getDestinationBySlug(slug),
    getSiteSettings(),
  ])
  if (!destination) return { title: 'Направление не найдено' }

  const company = settings.companyName || 'AURA Travel'
  const title = destination.seo?.title || `Путешествие в ${destination.title} — ${company}`
  const description = destination.seo?.description || destination.shortDescription
  const image =
    getMediaUrl(destination.seo?.image as never) || getMediaUrl(destination.heroImage as never)

  return {
    title: destination.seo?.title || `Путешествие в ${destination.title}`,
    description,
    alternates: { canonical: `/destinations/${destination.slug}` },
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
  }
}

export default async function DestinationPage({ params }: { params: Params }) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  if (!destination) notFound()

  const [tours, testimonials, faqs] = await Promise.all([
    getTours({ destination: destination.slug, limit: 6 }),
    getTestimonials({ destination: destination.id, limit: 3 }),
    getFaqs(5),
  ])

  return (
    <article>
      <section className="relative min-h-[65svh] overflow-hidden">
        <div className="absolute inset-0">
          <MediaImage
            media={destination.heroImage as never}
            fill
            priority
            sizeHint="hero"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/15" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[65svh] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-28 md:px-8">
          <p className="mb-3 text-xs tracking-[0.24em] uppercase text-white/70">
            {destination.country}
          </p>
          <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-none text-white">
            {destination.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">{destination.shortDescription}</p>
          <div className="mt-8">
            <Button href="#cta">Подобрать тур</Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24 space-y-20">
        <section className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <RichTextContent data={destination.description as never} />
          <div className="space-y-6 border border-[var(--color-border)] p-6 md:p-8 h-fit">
            {destination.bestTimeToVisit ? (
              <div>
                <p className="text-xs tracking-[0.16em] uppercase text-[var(--color-muted)]">
                  Лучшее время
                </p>
                <p className="mt-2 text-lg">{destination.bestTimeToVisit}</p>
              </div>
            ) : null}
            {destination.averagePrice ? (
              <div>
                <p className="text-xs tracking-[0.16em] uppercase text-[var(--color-muted)]">
                  Средняя цена от
                </p>
                <p className="mt-2 text-lg">{formatPrice(destination.averagePrice)}</p>
              </div>
            ) : null}
          </div>
        </section>

        {destination.highlights?.length ? (
          <section>
            <SectionHeading title="Популярные места" className="mb-8" />
            <div className="grid gap-6 md:grid-cols-3">
              {destination.highlights.map((item) => (
                <div key={item.id || item.title}>
                  {item.image ? (
                    <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-sm">
                      <MediaImage media={item.image as never} fill sizeHint="card" sizes="33vw" />
                    </div>
                  ) : null}
                  <h3 className="font-display text-2xl">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-2 text-[var(--color-muted)]">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {destination.gallery?.length ? (
          <section>
            <SectionHeading title="Галерея" className="mb-8" />
            <div className="grid gap-3 md:grid-cols-3">
              {destination.gallery.map((item, index) => (
                <div
                  key={item.id || index}
                  className="relative aspect-[4/5] overflow-hidden rounded-sm"
                >
                  <MediaImage media={item.image as never} fill sizeHint="card" sizes="33vw" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {tours.docs.length ? (
          <section>
            <SectionHeading title="Связанные туры" className="mb-8" />
            <div className="grid gap-8 md:grid-cols-3">
              {tours.docs.map((tour) => (
                <TourCard key={tour.id} tour={tour as never} />
              ))}
            </div>
          </section>
        ) : null}

        {testimonials.docs.length ? (
          <section>
            <SectionHeading title="Отзывы" className="mb-8" />
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.docs.map((item) => (
                <blockquote key={item.id} className="border border-[var(--color-border)] p-6">
                  <p className="font-display text-xl">“{item.text}”</p>
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

        <section id="cta" className="grid gap-10 md:grid-cols-2 items-start">
          <SectionHeading
            title={`Готовы отправиться в ${destination.title}?`}
            description="Оставьте заявку — подберём маршрут под ваш ритм и интересы."
          />
          <BookingForm destinationId={destination.id} />
        </section>
      </div>
    </article>
  )
}
