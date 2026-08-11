import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { revalidateCollection } from '../hooks/revalidate'

export const Tours: CollectionConfig = {
  slug: 'tours',
  labels: {
    singular: 'Тур',
    plural: 'Туры',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'destination', 'price', 'featured', 'published', 'updatedAt'],
    group: 'Контент',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateCollection],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Название',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              label: 'Slug',
              required: true,
              unique: true,
              index: true,
              admin: {
                description: 'URL: /tours/slug',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Краткое описание',
              required: true,
              maxLength: 240,
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Полное описание',
              required: true,
            },
            {
              name: 'destination',
              type: 'relationship',
              relationTo: 'destinations',
              label: 'Направление',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'duration',
                  type: 'number',
                  label: 'Длительность (дни)',
                  required: true,
                  min: 1,
                  admin: { width: '33%' },
                },
                {
                  name: 'price',
                  type: 'number',
                  label: 'Цена',
                  required: true,
                  min: 0,
                  admin: { width: '33%' },
                },
                {
                  name: 'oldPrice',
                  type: 'number',
                  label: 'Старая цена',
                  min: 0,
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'currency',
                  type: 'select',
                  label: 'Валюта',
                  defaultValue: 'RUB',
                  options: [
                    { label: 'RUB', value: 'RUB' },
                    { label: 'USD', value: 'USD' },
                    { label: 'EUR', value: 'EUR' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Рейтинг',
                  min: 0,
                  max: 5,
                  admin: { width: '33%', step: 0.1 },
                },
                {
                  name: 'reviewsCount',
                  type: 'number',
                  label: 'Количество отзывов',
                  min: 0,
                  defaultValue: 0,
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'tourType',
                  type: 'select',
                  label: 'Тип путешествия',
                  required: true,
                  options: [
                    { label: 'Приключение', value: 'adventure' },
                    { label: 'Культура', value: 'culture' },
                    { label: 'Релакс', value: 'relax' },
                    { label: 'Гастрономия', value: 'gastronomy' },
                    { label: 'Природа', value: 'nature' },
                    { label: 'Романтика', value: 'romance' },
                    { label: 'Семейный', value: 'family' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'difficulty',
                  type: 'select',
                  label: 'Сложность',
                  defaultValue: 'easy',
                  options: [
                    { label: 'Лёгкая', value: 'easy' },
                    { label: 'Средняя', value: 'medium' },
                    { label: 'Сложная', value: 'hard' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'maxPeople',
                  type: 'number',
                  label: 'Макс. человек',
                  min: 1,
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'featured',
                  type: 'checkbox',
                  label: 'Избранный тур',
                  defaultValue: false,
                  admin: { width: '50%' },
                },
                {
                  name: 'published',
                  type: 'checkbox',
                  label: 'Опубликован',
                  defaultValue: true,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Медиа',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero-изображение',
              required: true,
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Галерея',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Программа',
          fields: [
            {
              name: 'itinerary',
              type: 'array',
              label: 'Маршрут по дням',
              labels: {
                singular: 'День',
                plural: 'Дни',
              },
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'day',
                  type: 'number',
                  label: 'День',
                  required: true,
                  min: 1,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Заголовок',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Описание',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Изображение дня',
                },
                {
                  name: 'locations',
                  type: 'array',
                  label: 'Локации',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'meals',
                  type: 'select',
                  label: 'Питание',
                  hasMany: true,
                  options: [
                    { label: 'Завтрак', value: 'breakfast' },
                    { label: 'Обед', value: 'lunch' },
                    { label: 'Ужин', value: 'dinner' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Включено',
          fields: [
            {
              name: 'included',
              type: 'array',
              label: 'Что включено',
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'notIncluded',
              type: 'array',
              label: 'Что не включено',
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'accommodation',
              type: 'textarea',
              label: 'Проживание',
            },
            {
              name: 'transport',
              type: 'textarea',
              label: 'Транспорт',
            },
            {
              name: 'guide',
              type: 'textarea',
              label: 'Гид',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [seoFields],
        },
      ],
    },
  ],
}
