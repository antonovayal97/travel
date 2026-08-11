import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonProps = {
  href?: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  className?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
}

export function Button({
  href,
  children,
  variant = 'primary',
  className,
  type = 'button',
  onClick,
  disabled,
}: ButtonProps) {
  const styles = cn(
    'inline-flex items-center justify-center gap-2 rounded-[1.25rem] px-6 py-3.5 text-[0.95rem] font-bold tracking-[-0.01em] transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ivory)] disabled:opacity-50 active:scale-[0.98]',
    variant === 'primary' &&
      'bg-[var(--color-accent)] text-white shadow-[0_10px_28px_rgba(255,149,0,0.35)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(255,149,0,0.4)]',
    variant === 'secondary' &&
      'bg-white text-[var(--color-charcoal)] border border-white/80 shadow-[var(--shadow-soft)] hover:bg-[var(--color-sand)]',
    variant === 'outline' &&
      'border-2 border-[var(--color-accent)]/25 bg-white text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[rgba(255,149,0,0.08)]',
    variant === 'ghost' &&
      'text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] px-0 rounded-none',
    className,
  )

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={styles} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
