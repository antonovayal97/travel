import type { Metadata } from 'next'
import { MediaImage } from '@/components/ui/MediaImage'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getSiteSettings, getTeam } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'О компании',
  description: 'История, философия и команда премиального travel-бренда.',
  alternates: { canonical: '/about' },
}

export default async function AboutPage() {
  const [settings, team] = await Promise.all([getSiteSettings(), getTeam()])

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 space-y-20">
        <SectionHeading
          eyebrow="ABOUT"
          title={`${settings.companyName || 'AURA Travel'} — путешествия как искусство`}
          description="Мы создаём маршруты, в которых важны не только места, но и ощущение времени, вкуса и смысла."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: 'Авторские маршруты',
              text: 'Каждое путешествие проектируется вручную: ритм дней, локации, проживание и скрытые места.',
            },
            {
              title: 'Премиальный сервис',
              text: 'Личный куратор, внимание к деталям и поддержка до, во время и после поездки.',
            },
            {
              title: 'Глубина впечатлений',
              text: 'Мы выбираем не самые очевидные точки, а те, что остаются с вами надолго.',
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-[var(--color-border)] pt-6">
              <h2 className="font-display text-2xl">{item.title}</h2>
              <p className="mt-3 text-[var(--color-muted)] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {team.docs.length ? (
          <section>
            <SectionHeading title="Команда" className="mb-10" />
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {team.docs.map((member) => (
                <article key={member.id}>
                  <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-sm">
                    <MediaImage media={member.photo as never} fill sizeHint="card" sizes="25vw" />
                  </div>
                  <h3 className="font-display text-2xl">{member.name}</h3>
                  <p className="mt-1 text-sm tracking-[0.12em] uppercase text-[var(--color-muted)]">
                    {member.position}
                  </p>
                  {member.bio ? (
                    <p className="mt-3 text-[var(--color-muted)]">{member.bio}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
