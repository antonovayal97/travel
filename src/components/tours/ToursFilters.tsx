'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { CustomSelect } from '@/components/ui/CustomSelect'

type DestinationOption = { label: string; value: string }

const tourTypeOptions = [
  { label: 'Все типы', value: '' },
  { label: 'Приключение', value: 'adventure' },
  { label: 'Культура', value: 'culture' },
  { label: 'Релакс', value: 'relax' },
  { label: 'Гастрономия', value: 'gastronomy' },
  { label: 'Природа', value: 'nature' },
  { label: 'Романтика', value: 'romance' },
  { label: 'Семейный', value: 'family' },
]

const difficultyOptions = [
  { label: 'Любая сложность', value: '' },
  { label: 'Лёгкая', value: 'easy' },
  { label: 'Средняя', value: 'medium' },
  { label: 'Сложная', value: 'hard' },
]

export function ToursFilters({
  destinations,
}: {
  destinations: DestinationOption[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    startTransition(() => {
      router.push(`/tours?${params.toString()}`)
    })
  }

  return (
    <div
      className={`relative z-20 grid gap-4 md:grid-cols-2 xl:grid-cols-5 ${pending ? 'opacity-70' : ''}`}
    >
      <label className="space-y-2">
        <span className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-muted)]">
          Направление
        </span>
        <CustomSelect
          aria-label="Фильтр по направлению"
          value={searchParams.get('destination') || ''}
          onChange={(value) => update('destination', value)}
          options={[{ label: 'Все направления', value: '' }, ...destinations]}
        />
      </label>
      <label className="space-y-2">
        <span className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-muted)]">
          Тип
        </span>
        <CustomSelect
          aria-label="Фильтр по типу"
          value={searchParams.get('tourType') || ''}
          onChange={(value) => update('tourType', value)}
          options={tourTypeOptions}
        />
      </label>
      <label className="space-y-2">
        <span className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-muted)]">
          Сложность
        </span>
        <CustomSelect
          aria-label="Фильтр по сложности"
          value={searchParams.get('difficulty') || ''}
          onChange={(value) => update('difficulty', value)}
          options={difficultyOptions}
        />
      </label>
      <label className="space-y-2">
        <span className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-muted)]">
          Цена до
        </span>
        <input
          type="number"
          className="field-input"
          defaultValue={searchParams.get('maxPrice') || ''}
          placeholder="500000"
          onBlur={(e) => update('maxPrice', e.target.value)}
        />
      </label>
      <label className="space-y-2">
        <span className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-muted)]">
          Дней до
        </span>
        <input
          type="number"
          className="field-input"
          defaultValue={searchParams.get('maxDuration') || ''}
          placeholder="14"
          onBlur={(e) => update('maxDuration', e.target.value)}
        />
      </label>
    </div>
  )
}
