'use client'

import { Plane } from 'lucide-react'
import { MediaImage } from '@/components/ui/MediaImage'
import { Button } from '@/components/ui/Button'
import { FadeUp } from '@/components/motion/FadeUp'
import { AnimatedCounter } from '@/components/motion/FadeUp'
import { cn } from '@/lib/utils'

type HeroProps = {
  eyebrow?: string | null
  title: string
  description: string
  backgroundImage?: unknown
  primaryButton?: { label?: string | null; href?: string | null } | null
  secondaryButton?: { label?: string | null; href?: string | null } | null
  statistics?: { value: string; label: string; id?: string | null }[] | null
}

export function HeroBlock({
  eyebrow,
  title,
  description,
  backgroundImage,
  primaryButton,
  secondaryButton,
  statistics,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0 -z-10 bg-[var(--color-ivory)]" />

      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 pb-10 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:px-8 md:pb-6">
        <FadeUp>
          {eyebrow ? (
            <p className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-1.5 text-sm font-bold text-[var(--color-accent)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--color-border)]">
              <Plane className="size-4" aria-hidden />
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-xl font-display text-[clamp(2.5rem,6.5vw,4.75rem)] leading-[1.02] text-[var(--color-charcoal)]">
            {title}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--color-muted)]">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryButton?.href && primaryButton.label ? (
              <Button href={primaryButton.href}>{primaryButton.label}</Button>
            ) : null}
            {secondaryButton?.href && secondaryButton.label ? (
              <Button href={secondaryButton.href} variant="outline">
                {secondaryButton.label}
              </Button>
            ) : null}
          </div>

          {statistics?.length ? (
            <div className="mt-10 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
              {statistics.map((stat, index) => (
                <div
                  key={`${stat.value}-${stat.label}`}
                  className={cn(
                    'min-w-0 rounded-[1.25rem] bg-white px-3 py-3 shadow-[var(--shadow-soft)] sm:px-4',
                    index === statistics.length - 1 && statistics.length === 3 && 'col-span-2 sm:col-span-1',
                  )}
                >
                  <AnimatedCounter
                    value={stat.value}
                    className="font-display text-2xl text-[var(--color-charcoal)] md:text-3xl"
                  />
                  <p className="mt-0.5 text-[0.7rem] font-medium leading-snug text-[var(--color-muted)] sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-[var(--color-sand)] blur-sm" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-lift)] md:aspect-[5/6]">
              <MediaImage
                media={backgroundImage as never}
                fill
                priority
                sizeHint="hero"
                sizes="(max-width: 768px) 100vw, 45vw"
                className="animate-float"
              />
            </div>
            <div className="absolute -bottom-4 left-4 right-4 rounded-[1.25rem] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-lift)] md:left-auto md:right-[-0.5rem] md:w-56">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-accent)]">
                Лучшая цена
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-charcoal)]">
                Подберём тур за 5 минут
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
