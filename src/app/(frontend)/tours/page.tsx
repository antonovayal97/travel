import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TourCard } from '@/components/tours/Cards'
import { ToursFilters } from '@/components/tours/ToursFilters'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getDestinations, getSiteSettings, getTours } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: 'Туры',
    description: `Каталог авторских туров ${settings.companyName || 'AURA Travel'}`,
    alternates: { canonical: '/tours' },
  }
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function ToursPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const destination = typeof params.destination === 'string' ? params.destination : undefined
  const tourType = typeof params.tourType === 'string' ? params.tourType : undefined
  const difficulty = typeof params.difficulty === 'string' ? params.difficulty : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
  const maxDuration = params.maxDuration ? Number(params.maxDuration) : undefined

  const [tours, destinations] = await Promise.all([
    getTours({
      destination,
      tourType,
      difficulty,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
      maxDuration: Number.isFinite(maxDuration) ? maxDuration : undefined,
      limit: 24,
    }),
    getDestinations({ limit: 50 }),
  ])

  return (
    <div className="pt-28 md:pt-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <SectionHeading
          eyebrow="JOURNEYS"
          title="Каталог путешествий"
          description="Подберите маршрут по направлению, стилю и бюджету."
        />
        <div className="mt-10 mb-12">
          <Suspense fallback={<div className="h-24 animate-pulse bg-[var(--color-sand)]/40" />}>
            <ToursFilters
              destinations={destinations.docs.map((d) => ({
                label: d.title,
                value: d.slug,
              }))}
            />
          </Suspense>
        </div>
        {tours.docs.length ? (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 pb-24">
            {tours.docs.map((tour) => (
              <TourCard key={tour.id} tour={tour as never} />
            ))}
          </div>
        ) : (
          <p className="pb-24 text-[var(--color-muted)]">По выбранным фильтрам туры не найдены.</p>
        )}
      </div>
    </div>
  )
}
