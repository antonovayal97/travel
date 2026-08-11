import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { revalidateCollection } from '../hooks/revalidate'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  labels: {
    singular: 'Направление',
    plural: 'Направления',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'country', 'featured', 'updatedAt'],
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
                description: 'URL: /destinations/slug',
              },
            },
            {
              name: 'country',
              type: 'text',
              label: 'Страна',
              required: true,
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Краткое описание',
              required: true,
              maxLength: 220,
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Описание',
              required: true,
            },
            {
              name: 'bestTimeToVisit',
              type: 'text',
              label: 'Лучшее время для посещения',
            },
            {
              name: 'averagePrice',
              type: 'number',
              label: 'Средняя цена от',
              min: 0,
            },
            {
              name: 'featured',
              type: 'checkbox',
              label: 'Показывать на главной',
              defaultValue: false,
            },
            {
              name: 'coordinates',
              type: 'group',
              label: 'Координаты',
              fields: [
                {
                  name: 'lat',
                  type: 'number',
                  label: 'Широта',
                },
                {
                  name: 'lng',
                  type: 'number',
                  label: 'Долгота',
                },
              ],
            },
            {
              name: 'highlights',
              type: 'array',
              label: 'Популярные места',
              labels: {
                singular: 'Место',
                plural: 'Места',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
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
          label: 'SEO',
          fields: [seoFields],
        },
      ],
    },
  ],
}
