import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string | null
  title: string
  description?: string | null
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 inline-flex items-center gap-2 rounded-2xl bg-[var(--color-sand)] px-3 py-1 text-[0.75rem] font-bold tracking-[0.04em] text-[var(--color-accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.05] text-[var(--color-charcoal)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-[var(--color-muted)]">
          {description}
        </p>
      ) : null}
    </div>
  )
}
