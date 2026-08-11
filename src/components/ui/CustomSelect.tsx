'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SelectOption = {
  label: string
  value: string
  description?: string
}

type CustomSelectProps = {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  name?: string
  id?: string
  'aria-label'?: string
}

export function CustomSelect({
  options,
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Выберите',
  className,
  disabled,
  name,
  id,
  'aria-label': ariaLabel,
}: CustomSelectProps) {
  const generatedId = useId()
  const selectId = id || generatedId
  const listboxId = `${selectId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const selectedValue = isControlled ? value : internalValue
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const selectedOption = options.find((option) => option.value === selectedValue)
  const displayLabel = selectedOption?.label || placeholder

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const index = Math.max(
      0,
      options.findIndex((option) => option.value === selectedValue),
    )
    setActiveIndex(index)
    requestAnimationFrame(() => {
      const item = listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      item?.scrollIntoView({ block: 'nearest' })
    })
  }, [open, options, selectedValue])

  const commit = (next: string) => {
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
    setOpen(false)
  }

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (!options.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % options.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? options.length - 1 : prev - 1))
    }
    if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(options.length - 1)
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const option = options[activeIndex]
      if (option) commit(option.value)
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn('relative w-full', open && 'z-50', className)}
    >
      {name ? <input type="hidden" name={name} value={selectedValue} /> : null}

      <button
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'custom-select-trigger group flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border-[1.5px] border-[var(--color-border)] bg-[#f8fafc] px-4 py-[0.95rem] text-left text-[0.95rem] font-semibold text-[var(--color-charcoal)] outline-none transition-all duration-200',
          'hover:border-[rgba(26,29,38,0.18)] hover:bg-white',
          'focus-visible:border-[var(--color-accent)] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(255,149,0,0.18)]',
          open &&
            'border-[var(--color-accent)] bg-white shadow-[0_0_0_4px_rgba(255,149,0,0.18)]',
          disabled && 'cursor-not-allowed opacity-50',
          !selectedOption && 'text-[var(--color-muted)]',
        )}
      >
        <span className="truncate">{displayLabel}</span>
        <span
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--color-muted)] shadow-[var(--shadow-soft)] transition-transform duration-200',
            open && 'rotate-180 bg-[rgba(255,149,0,0.1)] text-[var(--color-accent)]',
          )}
        >
          <ChevronDown className="size-4" aria-hidden />
        </span>
      </button>

      <div
        className={cn(
          'absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 origin-top transition-all duration-200',
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-[0.98] opacity-0',
        )}
      >
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={selectId}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${selectId}-option-${activeIndex}` : undefined
          }
          onKeyDown={onListKeyDown}
          className="custom-select-menu max-h-64 overflow-auto rounded-[1.15rem] border border-[var(--color-border)] bg-white p-1.5 shadow-[var(--shadow-lift)]"
        >
          {options.map((option, index) => {
            const selected = option.value === selectedValue
            const active = index === activeIndex

            return (
              <li
                key={`${option.value}-${option.label}`}
                id={`${selectId}-option-${index}`}
                role="option"
                aria-selected={selected}
                data-index={index}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commit(option.value)}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-[0.85rem] px-3 py-2.5 transition-colors',
                  active && 'bg-[rgba(255,149,0,0.08)]',
                  selected && 'bg-[rgba(255,149,0,0.12)]',
                  !active && !selected && 'hover:bg-[var(--color-sand)]',
                )}
              >
                <div className="min-w-0">
                  <p
                    className={cn(
                      'truncate text-sm font-semibold',
                      selected ? 'text-[var(--color-accent)]' : 'text-[var(--color-charcoal)]',
                    )}
                  >
                    {option.label}
                  </p>
                  {option.description ? (
                    <p className="truncate text-xs text-[var(--color-muted)]">{option.description}</p>
                  ) : null}
                </div>
                {selected ? (
                  <Check className="size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
