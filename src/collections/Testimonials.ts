import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Отзыв',
    plural: 'Отзывы',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rating', 'featured', 'date'],
    group: 'Контент',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Аватар',
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Текст отзыва',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Оценка',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'tour',
      type: 'relationship',
      relationTo: 'tours',
      label: 'Тур',
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      label: 'Направление',
    },
    {
      name: 'date',
      type: 'date',
      label: 'Дата',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Показывать на главной',
      defaultValue: false,
    },
  ],
}
