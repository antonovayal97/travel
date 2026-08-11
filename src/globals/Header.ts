import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Логотип',
    },
    {
      name: 'navigation',
      type: 'array',
      label: 'Навигация',
      labels: {
        singular: 'Пункт',
        plural: 'Пункты',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
      defaultValue: [
        { label: 'Направления', href: '/destinations' },
        { label: 'Туры', href: '/tours' },
        { label: 'О компании', href: '/about' },
        { label: 'Отзывы', href: '/#testimonials' },
        { label: 'Контакты', href: '/contacts' },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Текст CTA',
      defaultValue: 'Подобрать тур',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Ссылка CTA',
      defaultValue: '/contacts',
    },
  ],
}
