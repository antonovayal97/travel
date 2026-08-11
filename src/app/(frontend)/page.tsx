import type { Metadata } from 'next'
import { RenderHomepageBlocks } from '@/components/blocks/RenderHomepageBlocks'
import { getHomepage, getSiteSettings } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: settings.companyName || 'AURA Travel',
    description:
      'Путешествия, которые остаются с вами навсегда. Авторские маршруты и премиальный travel-сервис.',
    alternates: {
      canonical: '/',
    },
  }
}

export default async function HomePage() {
  const homepage = await getHomepage()

  return <RenderHomepageBlocks blocks={homepage.layout as never} />
}
