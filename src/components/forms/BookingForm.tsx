'use client'

import { Controller, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'
import { formatRuPhone } from '@/lib/phone'
import {
  applicationSchema,
  type ApplicationFormValues,
} from '@/lib/validations/application'
import { cn } from '@/lib/utils'

export function BookingForm({
  tourId,
  destinationId,
  tourTitle,
}: {
  tourId?: string
  destinationId?: string
  tourTitle?: string
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema) as Resolver<ApplicationFormValues>,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      travelDate: '',
      travelersCount: 2,
      budget: '',
      comment: '',
      tour: tourId,
      destination: destinationId,
    },
  })

  const onSubmit = async (values: ApplicationFormValues) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          phone: formatRuPhone(values.phone),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Не удалось отправить заявку')
      }
      toast.success('Заявка отправлена. Мы свяжемся с вами в ближайшее время.')
      reset({
        name: '',
        phone: '',
        email: '',
        travelDate: '',
        travelersCount: 2,
        budget: '',
        comment: '',
        tour: tourId,
        destination: destinationId,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка отправки')
    }
  }

  const onInvalid = () => {
    toast.error('Проверьте поля формы')
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="space-y-5 rounded-[1.5rem] border border-[var(--color-border)] bg-white p-6 md:p-8"
      noValidate
    >
      {tourTitle ? (
        <p className="text-sm text-[var(--color-muted)]">
          Заявка на тур: <span className="text-[var(--color-charcoal)]">{tourTitle}</span>
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Имя" required error={errors.name?.message}>
          <input
            {...register('name')}
            className={fieldClass(errors.name)}
            autoComplete="name"
            placeholder="Как к вам обращаться"
            aria-invalid={Boolean(errors.name)}
          />
        </Field>

        <Field label="Телефон" required error={errors.phone?.message}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                name={field.name}
                ref={field.ref}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(formatRuPhone(event.target.value))}
                className={fieldClass(errors.phone)}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+7 (999) 999-99-99"
                maxLength={18}
                aria-invalid={Boolean(errors.phone)}
              />
            )}
          />
        </Field>

        <Field label="Email" required error={errors.email?.message}>
          <input
            {...register('email')}
            type="email"
            className={fieldClass(errors.email)}
            autoComplete="email"
            placeholder="name@example.com"
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field label="Дата путешествия" error={errors.travelDate?.message}>
          <Controller
            name="travelDate"
            control={control}
            render={({ field }) => (
              <CustomDatePicker
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                min={new Date().toISOString().slice(0, 10)}
                hasError={Boolean(errors.travelDate)}
                placeholder="Выберите дату"
                aria-label="Дата путешествия"
              />
            )}
          />
        </Field>

        <Field label="Количество человек" required error={errors.travelersCount?.message}>
          <input
            {...register('travelersCount', { valueAsNumber: true })}
            type="number"
            min={1}
            max={50}
            className={fieldClass(errors.travelersCount)}
            aria-invalid={Boolean(errors.travelersCount)}
          />
        </Field>

        <Field label="Бюджет" error={errors.budget?.message}>
          <input
            {...register('budget')}
            className={fieldClass(errors.budget)}
            placeholder="например, 300 000 ₽"
            aria-invalid={Boolean(errors.budget)}
          />
        </Field>
      </div>

      <Field label="Комментарий" error={errors.comment?.message}>
        <textarea
          {...register('comment')}
          rows={4}
          className={cn(fieldClass(errors.comment), 'resize-y')}
          placeholder="Пожелания по отелю, перелёту, датам…"
          maxLength={2000}
          aria-invalid={Boolean(errors.comment)}
        />
      </Field>

      <input type="hidden" {...register('tour')} />
      <input type="hidden" {...register('destination')} />

      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? 'Отправляем…' : 'Отправить заявку'}
      </Button>

      {isSubmitted && Object.keys(errors).length > 0 ? (
        <p className="text-sm font-medium text-[var(--color-accent-deep)]" role="alert">
          Заполните обязательные поля корректно
        </p>
      ) : null}
    </form>
  )
}

function fieldClass(error?: { message?: string }) {
  return cn('field-input', error && 'field-input-error')
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-muted)]">
        {label}
        {required ? <span className="text-[var(--color-accent)]"> *</span> : null}
      </span>
      {children}
      {error ? (
        <span className="block text-sm font-medium text-[var(--color-accent-deep)]" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}
