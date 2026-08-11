'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeading } from '@/components/ui/SectionHeading'

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export function FaqAccordion({
  items,
  title = 'Часто задаваемые вопросы',
  description = 'Ответы на то, что чаще всего спрашивают перед поездкой.',
  className,
}: {
  items: FaqItem[]
  title?: string
  description?: string
  className?: string
}) {
  const baseId = useId()
  const reduce = useReducedMotion()
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  if (!items.length) return null

  return (
    <section className={cn('max-w-3xl', className)}>
      <SectionHeading title={title} description={description} className="mb-8" />

      <div className="flex flex-col gap-3" role="list">
        {items.map((item, index) => {
          const isOpen = openId === item.id
          const panelId = `${baseId}-panel-${item.id}`
          const buttonId = `${baseId}-button-${item.id}`

          return (
            <div
              key={item.id}
              role="listitem"
              className={cn(
                'overflow-hidden rounded-[var(--radius-lg)] border transition-colors duration-300',
                isOpen
                  ? 'border-[rgba(var(--color-accent-rgb),0.35)] bg-[var(--color-white)] shadow-[var(--shadow-soft)]'
                  : 'border-[var(--color-border)] bg-[rgba(255,255,255,0.55)] hover:border-[rgba(26,29,38,0.16)] hover:bg-[var(--color-white)]',
              )}
            >
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-start gap-4 px-5 py-4 text-left md:px-6 md:py-5"
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-bold tabular-nums transition-colors duration-300',
                    isOpen
                      ? 'bg-[rgba(var(--color-accent-rgb),0.14)] text-[var(--color-accent-deep)]'
                      : 'bg-[var(--color-sand)] text-[var(--color-muted)]',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1 pt-0.5 font-display text-[1.05rem] leading-snug tracking-[-0.03em] text-[var(--color-charcoal)] md:text-[1.15rem]">
                  {item.question}
                </span>

                <span
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                    isOpen
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-sand)] text-[var(--color-muted)]',
                  )}
                >
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-300 ease-[var(--ease-out)]',
                      isOpen && 'rotate-180',
                    )}
                    aria-hidden
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[var(--color-border)] px-5 pb-5 pt-4 md:px-6 md:pb-6">
                      <div className="flex gap-4">
                        <span className="hidden h-8 w-8 shrink-0 sm:block" aria-hidden />
                        <p className="min-w-0 flex-1 text-[0.98rem] leading-relaxed text-[var(--color-muted)] md:text-base">
                          {item.answer}
                        </p>
                        <span className="hidden h-8 w-8 shrink-0 sm:block" aria-hidden />
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
