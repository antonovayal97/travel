'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'

type DestinationOption = { label: string; value: string }

const tourTypeOptions = [
  { label: 'Любой', value: '' },
  { label: 'Приключение', value: 'adventure' },
  { label: 'Культура', value: 'culture' },
  { label: 'Релакс', value: 'relax' },
  { label: 'Гастрономия', value: 'gastronomy' },
  { label: 'Природа', value: 'nature' },
  { label: 'Романтика', value: 'romance' },
  { label: 'Семейный', value: 'family' },
]

export function TourSearchBlock({
  title,
  destinations,
}: {
  title?: string | null
  destinations: DestinationOption[]
}) {
  const router = useRouter()
  const [destination, setDestination] = useState('')
  const [tourType, setTourType] = useState('')
  const [travelers, setTravelers] = useState('2')
  const [budget, setBudget] = useState('')
  const [date, setDate] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (destination) params.set('destination', destination)
    if (tourType) params.set('tourType', tourType)
    if (budget) params.set('maxPrice', budget)
    if (travelers) params.set('travelers', travelers)
    if (date) params.set('date', date)
    router.push(`/tours?${params.toString()}`)
  }

  return (
    <section id="search" className="relative z-20 px-5 md:px-8">
      <form
        onSubmit={onSubmit}
        className="surface relative z-30 mx-auto max-w-[1440px] overflow-visible border border-[var(--color-border)] p-5 md:p-6"
      >
        {title ? (
          <p className="mb-4 flex items-center gap-2 font-display text-xl text-[var(--color-charcoal)] md:text-2xl">
            <Search className="size-5 text-[var(--color-accent)]" aria-hidden />
            {title}
          </p>
        ) : null}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="space-y-1.5 xl:col-span-1">
            <span className="text-xs font-bold text-[var(--color-muted)]">Куда?</span>
            <CustomSelect
              aria-label="Направление"
              value={destination}
              onChange={setDestination}
              options={[
                { label: 'Любое направление', value: '' },
                ...destinations,
              ]}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-[var(--color-muted)]">Дата</span>
            <CustomDatePicker
              aria-label="Дата поездки"
              value={date}
              onChange={setDate}
              min={new Date().toISOString().slice(0, 10)}
              placeholder="Когда"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-[var(--color-muted)]">Путешественники</span>
            <CustomSelect
              aria-label="Количество путешественников"
              value={travelers}
              onChange={setTravelers}
              options={[1, 2, 3, 4, 5, 6].map((n) => ({
                label: `${n}`,
                value: String(n),
                description: n === 1 ? 'человек' : n < 5 ? 'человека' : 'человек',
              }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-[var(--color-muted)]">Тип</span>
            <CustomSelect
              aria-label="Тип путешествия"
              value={tourType}
              onChange={setTourType}
              options={tourTypeOptions}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-[var(--color-muted)]">Бюджет до</span>
            <input
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="500000"
              className="field-input"
            />
          </label>
          <div className="flex items-end">
            <Button type="submit" className="w-full gap-2">
              <Search className="size-4" aria-hidden />
              Найти тур
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}
