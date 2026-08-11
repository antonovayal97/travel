'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, Plane, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type NavItem = { label: string; href: string }

export function SiteHeader({
  companyName,
  navigation,
  ctaText,
  ctaLink,
}: {
  companyName: string
  navigation: NavItem[]
  ctaText: string
  ctaLink: string
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open
          ? 'border-b border-[var(--color-border)] bg-white/92 shadow-[var(--shadow-soft)] backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-3.5 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-white shadow-[0_8px_20px_rgba(255,149,0,0.35)]">
            <Plane className="size-4" aria-hidden />
          </span>
          <span className="font-display text-xl text-[var(--color-charcoal)]">
            <span className="text-[var(--color-accent)]">{companyName.split(' ')[0]}</span>
            {companyName.includes(' ') ? ` ${companyName.split(' ').slice(1).join(' ')}` : ''}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Основная навигация">
          {navigation.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className="text-sm font-semibold text-[var(--color-charcoal)]/80 transition-colors hover:text-[var(--color-accent)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href={ctaLink} className="py-2.5 px-5 text-sm">
            {ctaText}
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-[var(--color-charcoal)]"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--color-border)] bg-white lg:hidden">
          <nav className="flex flex-col gap-4 px-5 py-6" aria-label="Мобильная навигация">
            {navigation.map((item) => (
              <Link
                key={`mobile-${item.label}-${item.href}`}
                href={item.href}
                className="text-lg font-semibold text-[var(--color-charcoal)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={ctaLink}
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex w-full items-center justify-center rounded-[1.25rem] bg-[var(--color-accent)] px-6 py-3.5 text-sm font-bold text-white"
            >
              {ctaText}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
