import type { Metadata } from 'next'
import { DestinationCard } from '@/components/tours/Cards'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getDestinations, getSiteSettings } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: 'Направления',
    description: `Направления путешествий ${settings.companyName || 'AURA Travel'}`,
    alternates: { canonical: '/destinations' },
  }
}

export default async function DestinationsPage() {
  const destinations = await getDestinations({ limit: 50 })

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <SectionHeading
          eyebrow="DESTINATIONS"
          title="Куда отправимся?"
          description="Страны и регионы, в которых мы создаём авторские маршруты."
          className="mb-12"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {destinations.docs.map((destination) => (
            <DestinationCard key={destination.id} destination={destination as never} />
          ))}
        </div>
      </div>
    </div>
  )
}
