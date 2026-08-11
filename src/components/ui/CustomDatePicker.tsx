'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function toIso(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseIso(value: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDisplay(value: string) {
  const date = parseIso(value)
  if (!date) return null
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7
  const days: (Date | null)[] = Array.from({ length: startOffset }, () => null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day))
  }

  return days
}

type CustomDatePickerProps = {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  min?: string
  max?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  name?: string
  id?: string
  clearable?: boolean
  'aria-label'?: string
  hasError?: boolean
}

export function CustomDatePicker({
  value,
  defaultValue = '',
  onChange,
  onBlur,
  min,
  max,
  placeholder = 'Выберите дату',
  className,
  disabled,
  name,
  id,
  clearable = true,
  'aria-label': ariaLabel,
  hasError,
}: CustomDatePickerProps) {
  const generatedId = useId()
  const pickerId = id || generatedId
  const popoverId = `${pickerId}-popover`
  const rootRef = useRef<HTMLDivElement>(null)
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const selectedValue = isControlled ? value : internalValue

  const today = useMemo(() => startOfDay(new Date()), [])
  const minDate = useMemo(() => (min ? parseIso(min) : today) ?? today, [min, today])
  const maxDate = useMemo(() => (max ? parseIso(max) : null), [max])
  const selectedDate = useMemo(() => parseIso(selectedValue || ''), [selectedValue])

  const initialView = selectedDate ?? today
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(initialView.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialView.getMonth())

  const displayLabel = selectedValue ? formatDisplay(selectedValue) : null
  const calendarDays = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  )

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        onBlur?.()
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        onBlur?.()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onBlur])

  useEffect(() => {
    if (!open) return
    const nextView = selectedDate ?? today
    setViewYear(nextView.getFullYear())
    setViewMonth(nextView.getMonth())
  }, [open, selectedDate, today])

  const commit = (next: string) => {
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
    setOpen(false)
    onBlur?.()
  }

  const clear = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!isControlled) setInternalValue('')
    onChange?.('')
    onBlur?.()
  }

  const isDisabled = (date: Date) => {
    const day = startOfDay(date)
    if (day < minDate) return true
    if (maxDate && day > maxDate) return true
    return false
  }

  const goMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  return (
    <div ref={rootRef} className={cn('relative w-full', open && 'z-50', className)}>
      {name ? <input type="hidden" name={name} value={selectedValue} readOnly /> : null}

      <div className="flex items-stretch gap-1.5">
        <button
          id={pickerId}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={popoverId}
          aria-label={ariaLabel}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={cn(
            'custom-date-trigger group flex min-w-0 flex-1 items-center justify-between gap-3 rounded-[var(--radius-md)] border-[1.5px] border-[var(--color-border)] bg-[#f8fafc] px-4 py-[0.95rem] text-left text-[0.95rem] font-semibold text-[var(--color-charcoal)] outline-none transition-all duration-200',
            'hover:border-[rgba(26,29,38,0.18)] hover:bg-white',
            'focus-visible:border-[var(--color-accent)] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(255,149,0,0.18)]',
            open &&
              'border-[var(--color-accent)] bg-white shadow-[0_0_0_4px_rgba(255,149,0,0.18)]',
            hasError && 'field-input-error',
            disabled && 'cursor-not-allowed opacity-50',
            !displayLabel && 'text-[var(--color-muted)]',
          )}
        >
          <span className="flex min-w-0 items-center gap-2.5 truncate">
            <CalendarDays
              className={cn(
                'size-4 shrink-0',
                displayLabel ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]',
              )}
              aria-hidden
            />
            <span className="truncate">{displayLabel || placeholder}</span>
          </span>

          <span
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--color-muted)] shadow-[var(--shadow-soft)] transition-colors',
              open && 'bg-[rgba(255,149,0,0.1)] text-[var(--color-accent)]',
            )}
          >
            <ChevronLeft
              className={cn('size-4 rotate-[-90deg] transition-transform', open && 'rotate-90')}
              aria-hidden
            />
          </span>
        </button>

        {clearable && displayLabel && !disabled ? (
          <button
            type="button"
            aria-label="Очистить дату"
            onClick={clear}
            className="flex size-[3.25rem] shrink-0 items-center justify-center rounded-[var(--radius-md)] border-[1.5px] border-[var(--color-border)] bg-[#f8fafc] text-[var(--color-muted)] transition-colors hover:border-[rgba(26,29,38,0.18)] hover:bg-white hover:text-[var(--color-charcoal)]"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <div
        id={popoverId}
        role="dialog"
        aria-modal="false"
        aria-label="Выбор даты"
        className={cn(
          'absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 origin-top transition-all duration-200',
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-[0.98] opacity-0',
        )}
      >
        <div className="rounded-[1.15rem] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-lift)]">
          <div className="mb-4 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Предыдущий месяц"
              onClick={() => goMonth(-1)}
              className="flex size-9 items-center justify-center rounded-xl text-[var(--color-muted)] transition-colors hover:bg-[var(--color-sand)] hover:text-[var(--color-charcoal)]"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <p className="font-display text-base text-[var(--color-charcoal)]">
              {MONTHS[viewMonth]} {viewYear}
            </p>
            <button
              type="button"
              aria-label="Следующий месяц"
              onClick={() => goMonth(1)}
              className="flex size-9 items-center justify-center rounded-xl text-[var(--color-muted)] transition-colors hover:bg-[var(--color-sand)] hover:text-[var(--color-charcoal)]"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="py-1 text-center text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--color-muted)]"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <span key={`empty-${index}`} aria-hidden />
              }

              const iso = toIso(date)
              const selected = selectedValue === iso
              const isToday = toIso(date) === toIso(today)
              const disabledDay = isDisabled(date)

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => commit(iso)}
                  className={cn(
                    'flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition-colors',
                    selected &&
                      'bg-[var(--color-accent)] text-white shadow-[0_8px_18px_rgba(255,149,0,0.28)]',
                    !selected &&
                      !disabledDay &&
                      'text-[var(--color-charcoal)] hover:bg-[rgba(255,149,0,0.1)] hover:text-[var(--color-accent-deep)]',
                    !selected &&
                      isToday &&
                      'ring-1 ring-[rgba(255,149,0,0.35)] ring-inset',
                    disabledDay && 'cursor-not-allowed text-[var(--color-muted)]/45',
                  )}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
