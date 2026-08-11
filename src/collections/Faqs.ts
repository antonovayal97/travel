import type { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'Вопрос',
    plural: 'Часто задаваемые вопросы',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'published'],
    group: 'Контент',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      label: 'Вопрос',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      label: 'Ответ',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Категория',
      defaultValue: 'general',
      options: [
        { label: 'Общее', value: 'general' },
        { label: 'Бронирование', value: 'booking' },
        { label: 'Оплата', value: 'payment' },
        { label: 'Туры', value: 'tours' },
        { label: 'Визы', value: 'visa' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок',
      defaultValue: 0,
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Опубликован',
      defaultValue: true,
    },
  ],
}
