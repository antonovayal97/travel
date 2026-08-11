import Link from 'next/link'
import { ArrowUpRight, Star } from 'lucide-react'
import { MediaImage } from '@/components/ui/MediaImage'
import { formatPrice } from '@/lib/utils'

type DestinationCardProps = {
  destination: {
    title: string
    slug: string
    country: string
    shortDescription: string
    heroImage?: unknown
  }
  large?: boolean
}

export function DestinationCard({ destination, large }: DestinationCardProps) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={`group relative block overflow-hidden rounded-[1.5rem] shadow-[var(--shadow-soft)] ${
        large ? 'min-h-[24rem] md:min-h-[30rem]' : 'min-h-[20rem] md:min-h-[24rem]'
      }`}
    >
      <div className="absolute inset-0">
        <MediaImage
          media={destination.heroImage as never}
          fill
          sizeHint="card"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d26]/80 via-[#1a1d26]/25 to-transparent" />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-6 text-white">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.08em] text-white/75">
          {destination.country}
        </p>
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-display text-2xl md:text-3xl leading-none">{destination.title}</h3>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-white transition-transform group-hover:rotate-12">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80 line-clamp-2">
          {destination.shortDescription}
        </p>
      </div>
    </Link>
  )
}

type TourCardProps = {
  tour: {
    title: string
    slug: string
    duration: number
    price: number
    currency?: string | null
    rating?: number | null
    reviewsCount?: number | null
    heroImage?: unknown
    destination?: { title?: string } | string | null
  }
}

export function TourCard({ tour }: TourCardProps) {
  const destinationTitle =
    typeof tour.destination === 'object' && tour.destination
      ? tour.destination.title
      : null

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group block overflow-hidden rounded-[1.5rem] bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <MediaImage
          media={tour.heroImage as never}
          fill
          sizeHint="card"
          sizes="(max-width: 768px) 90vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {tour.rating ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-2xl bg-white px-2.5 py-1 text-xs font-bold text-[var(--color-charcoal)] shadow-sm">
            <Star className="size-3.5 fill-[var(--color-accent)] text-[var(--color-accent)]" />
            {tour.rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-4 md:p-5">
        {destinationTitle ? (
          <p className="text-xs font-bold uppercase tracking-[0.06em] text-[var(--color-forest)]">
            {destinationTitle}
          </p>
        ) : null}
        <h3 className="font-display text-xl leading-tight text-[var(--color-charcoal)] group-hover:text-[var(--color-accent)]">
          {tour.title}
        </h3>
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-sm font-medium text-[var(--color-muted)]">{tour.duration} дней</span>
          <span className="text-base font-extrabold text-[var(--color-accent)]">
            от {formatPrice(tour.price, tour.currency || 'RUB')}
          </span>
        </div>
      </div>
    </Link>
  )
}
