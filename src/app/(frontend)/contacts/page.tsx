import type { Metadata } from 'next'
import { BookingForm } from '@/components/forms/BookingForm'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getSiteSettings } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с нами, чтобы подобрать путешествие.',
  alternates: { canonical: '/contacts' },
}

export default async function ContactsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:grid-cols-2 md:gap-20 md:px-8">
        <div>
          <SectionHeading
            eyebrow="CONTACT"
            title="Подобрать путешествие"
            description="Расскажите, куда хотите отправиться — мы соберём маршрут под ваш стиль."
          />
          <div className="mt-10 space-y-4 text-[var(--color-muted)]">
            {settings.phone ? (
              <p>
                Телефон:{' '}
                <a href={`tel:${settings.phone}`} className="text-[var(--color-charcoal)]">
                  {settings.phone}
                </a>
              </p>
            ) : null}
            {settings.email ? (
              <p>
                Email:{' '}
                <a href={`mailto:${settings.email}`} className="text-[var(--color-charcoal)]">
                  {settings.email}
                </a>
              </p>
            ) : null}
            {settings.address ? <p>Адрес: {settings.address}</p> : null}
            {settings.workingHours ? <p>Часы работы: {settings.workingHours}</p> : null}
          </div>
        </div>
        <BookingForm />
      </div>
    </div>
  )
}
