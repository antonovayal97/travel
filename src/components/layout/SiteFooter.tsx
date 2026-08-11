import Link from 'next/link'
import { Plane } from 'lucide-react'
import { DeveloperCredit } from '@/components/layout/DeveloperCredit'

type FooterLink = { label: string; href: string }
type FooterColumn = { title: string; links?: FooterLink[] | null }
type SocialLink = { platform: string; url: string }

export function SiteFooter({
  companyName,
  columns,
  socialLinks,
  copyright,
  legalLinks,
}: {
  companyName: string
  columns?: FooterColumn[] | null
  socialLinks?: SocialLink[] | null
  copyright?: string | null
  legalLinks?: FooterLink[] | null
}) {
  return (
    <footer className="mt-8 border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <p className="flex items-center gap-2 font-display text-2xl text-[var(--color-charcoal)]">
              <span className="flex size-8 items-center justify-center rounded-xl bg-[var(--color-accent)] text-white shadow-[0_8px_18px_rgba(255,149,0,0.35)]">
                <Plane className="size-3.5" aria-hidden />
              </span>
              <span>
                <span className="text-[var(--color-accent)]">{companyName.split(' ')[0]}</span>
                {companyName.includes(' ') ? ` ${companyName.split(' ').slice(1).join(' ')}` : ''}
              </span>
            </p>
            <p className="mt-4 max-w-sm text-[var(--color-muted)] leading-relaxed">
              Находим яркие маршруты и честные цены — путешествовать просто и с удовольствием.
            </p>
            {socialLinks?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl bg-[var(--color-sand)] px-3 py-1.5 text-sm font-bold capitalize text-[var(--color-charcoal)] hover:bg-[rgba(255,149,0,0.12)] hover:text-[var(--color-accent)]"
                  >
                    {item.platform}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {columns?.map((column) => (
            <div key={column.title}>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {column.title}
              </p>
              <ul className="space-y-2.5">
                {column.links?.map((link) => (
                  <li key={`${column.title}-${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="font-medium text-[var(--color-charcoal)] hover:text-[var(--color-accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-[var(--color-border)] pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[var(--color-muted)]">{copyright}</p>
            <div className="flex flex-wrap gap-4">
              {legalLinks?.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="text-sm text-[var(--color-muted)] hover:text-[var(--color-charcoal)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex justify-start md:justify-end">
            <DeveloperCredit />
          </div>
        </div>
      </div>
    </footer>
  )
}
