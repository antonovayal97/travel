import Link from 'next/link'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { DestinationCard, TourCard } from '@/components/tours/Cards'
import { FadeUp, Stagger, StaggerItem } from '@/components/motion/FadeUp'
import { MediaImage } from '@/components/ui/MediaImage'
import { Button } from '@/components/ui/Button'
import { GallerySwiper } from '@/components/blocks/GallerySwiper'

export function DestinationsBlockView({
  eyebrow,
  title,
  description,
  destinations,
}: {
  eyebrow?: string | null
  title: string
  description?: string | null
  destinations: Array<{
    id: string
    title: string
    slug: string
    country: string
    shortDescription: string
    heroImage?: unknown
  }>
}) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            <Button href="/destinations" variant="outline">
              Все направления
            </Button>
          </div>
        </FadeUp>
        <Stagger className="grid gap-4 md:grid-cols-12 md:gap-5">
          {destinations.map((destination, index) => (
            <StaggerItem
              key={destination.id}
              className={
                index === 0
                  ? 'md:col-span-7'
                  : index === 1
                    ? 'md:col-span-5'
                    : index === 2
                      ? 'md:col-span-5'
                      : 'md:col-span-7'
              }
            >
              <DestinationCard destination={destination} large={index === 0 || index === 3} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export function FeaturedToursBlockView({
  eyebrow,
  title,
  description,
  tours,
}: {
  eyebrow?: string | null
  title: string
  description?: string | null
  tours: Array<{
    id: string
    title: string
    slug: string
    duration: number
    price: number
    currency?: string | null
    rating?: number | null
    reviewsCount?: number | null
    heroImage?: unknown
    destination?: { title?: string } | string | null
  }>
}) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            <Button href="/tours" variant="outline">
              Смотреть все туры
            </Button>
          </div>
        </FadeUp>
        <Stagger className="grid gap-5 md:grid-cols-3">
          {tours.map((tour) => (
            <StaggerItem key={tour.id}>
              <TourCard tour={tour} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export function StoryBlockView({
  eyebrow,
  title,
  description,
  image,
  cta,
}: {
  eyebrow?: string | null
  title: string
  description: string
  image?: unknown
  cta?: { label?: string | null; href?: string | null } | null
}) {
  return (
    <section className="section-pad">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <FadeUp>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
            <MediaImage media={image as never} fill sizeHint="tablet" sizes="50vw" />
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          {cta?.href && cta.label ? (
            <div className="mt-8">
              <Button href={cta.href} variant="outline">
                {cta.label}
              </Button>
            </div>
          ) : null}
        </FadeUp>
      </div>
    </section>
  )
}

export function BenefitsBlockView({
  title,
  items,
}: {
  title?: string | null
  items?: { title: string; description: string; id?: string | null }[] | null
}) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <FadeUp>
          <SectionHeading title={title || 'Почему путешествуют с нами'} className="mb-12" />
        </FadeUp>
        <Stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items?.map((item, index) => (
            <StaggerItem
              key={item.id || item.title}
              className="rounded-[1.5rem] bg-white p-6 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1 md:p-7"
            >
              <div
                className={`mb-5 flex size-12 items-center justify-center rounded-2xl font-display text-lg text-white shadow-[0_8px_20px_rgba(255,90,31,0.28)] ${
                  index % 2 === 0
                    ? 'bg-[linear-gradient(135deg,#ff5a1f,#ff8a3d)]'
                    : 'bg-[linear-gradient(135deg,#ff8a3d,#ffb347)]'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="font-display text-xl text-[var(--color-charcoal)]">{item.title}</h3>
              <p className="mt-3 text-[var(--color-muted)] leading-relaxed">{item.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export function TestimonialsBlockView({
  eyebrow,
  title,
  testimonials,
}: {
  eyebrow?: string | null
  title: string
  testimonials: Array<{
    id: string
    name: string
    text: string
    rating: number
  }>
}) {
  return (
    <section id="testimonials" className="section-pad">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <FadeUp>
          <SectionHeading eyebrow={eyebrow} title={title} className="mb-12" />
        </FadeUp>
        <Stagger className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <StaggerItem
              key={item.id}
              className="rounded-[1.5rem] bg-white p-6 shadow-[var(--shadow-soft)] md:p-7"
            >
              <p className="text-sm font-bold text-[var(--color-accent)]">
                {'★'.repeat(item.rating)}
              </p>
              <p className="mt-4 text-lg font-semibold leading-snug text-[var(--color-charcoal)]">
                “{item.text}”
              </p>
              <p className="mt-5 text-sm font-bold text-[var(--color-muted)]">{item.name}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export function GalleryBlockView({
  title,
  images,
}: {
  title?: string | null
  images?: { image?: unknown; id?: string | null }[] | null
}) {
  return <GallerySwiper title={title} images={images} />
}

export function CTABlockView({
  title,
  description,
  primaryButton,
}: {
  title: string
  description?: string | null
  primaryButton?: { label?: string | null; href?: string | null } | null
  backgroundImage?: unknown
}) {
  return (
    <section className="section-pad px-5 md:px-8">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#1a1d26_0%,#2a303c_55%,#3a4250_100%)] px-6 py-14 text-white shadow-[var(--shadow-lift)] md:px-12 md:py-16">
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 left-10 size-56 rounded-full bg-[rgba(255,149,0,0.15)] blur-2xl" />
        <FadeUp>
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05]">
              {title}
            </h2>
            {description ? <p className="mt-4 text-lg text-white/90">{description}</p> : null}
            {primaryButton?.href && primaryButton.label ? (
              <div className="mt-8">
                <Button href={primaryButton.href}>{primaryButton.label}</Button>
              </div>
            ) : null}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

export function RenderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href}>{children}</Link>
}
