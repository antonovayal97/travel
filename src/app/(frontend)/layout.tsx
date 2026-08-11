import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { Toaster } from 'sonner'
import { SiteHeader } from '@/components/navigation/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { getFooter, getHeader, getSiteSettings } from '@/lib/payload'
import './styles.css'

const sans = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
})

const display = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  weight: ['700', '800'],
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const company = settings.companyName || 'AURA Travel'
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: {
      default: company,
      template: `%s — ${company}`,
    },
    description:
      'Премиальные авторские путешествия: уникальные маршруты, cinematic experiences и сервис уровня luxury travel.',
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      siteName: company,
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [settings, header, footer] = await Promise.all([
    getSiteSettings(),
    getHeader(),
    getFooter(),
  ])

  const companyName = settings.companyName || 'AURA Travel'
  const navigation =
    header.navigation?.map((item) => ({
      label: item.label,
      href: item.href,
    })) || [
      { label: 'Направления', href: '/destinations' },
      { label: 'Туры', href: '/tours' },
      { label: 'О компании', href: '/about' },
      { label: 'Отзывы', href: '/#testimonials' },
      { label: 'Контакты', href: '/contacts' },
    ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: companyName,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: settings.address || undefined,
    url: process.env.NEXT_PUBLIC_SERVER_URL,
  }

  return (
    <html lang="ru" className={`${sans.variable} ${display.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader
          companyName={companyName}
          navigation={navigation}
          ctaText={header.ctaText || 'Подобрать тур'}
          ctaLink={header.ctaLink || '/contacts'}
        />
        <main>{children}</main>
        <SiteFooter
          companyName={companyName}
          columns={footer.columns as never}
          socialLinks={footer.socialLinks as never}
          copyright={footer.copyright}
          legalLinks={footer.legalLinks as never}
        />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
