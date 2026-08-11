import { z } from 'zod'
import { isCompleteRuPhone } from '@/lib/phone'

const namePattern = /^[\p{L}\s'.-]+$/u

export const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Укажите имя (минимум 2 символа)')
    .max(80, 'Слишком длинное имя')
    .refine((value) => namePattern.test(value), 'Имя может содержать только буквы'),
  phone: z
    .string()
    .trim()
    .min(1, 'Укажите телефон')
    .refine(isCompleteRuPhone, 'Введите телефон полностью: +7 (999) 999-99-99'),
  email: z
    .string()
    .trim()
    .min(1, 'Укажите email')
    .email('Некорректный email')
    .max(120, 'Слишком длинный email'),
  tour: z.string().optional(),
  destination: z.string().optional(),
  travelDate: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), 'Некорректная дата'),
  travelersCount: z.coerce
    .number({ error: 'Укажите количество человек' })
    .int('Укажите целое число')
    .min(1, 'Минимум 1 человек')
    .max(50, 'Максимум 50 человек'),
  budget: z.string().trim().max(80, 'Слишком длинное значение').optional(),
  comment: z.string().trim().max(2000, 'Комментарий слишком длинный').optional(),
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>
