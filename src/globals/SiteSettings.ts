import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      label: 'Название компании',
      required: true,
      defaultValue: 'AURA Travel',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Логотип',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'Телефон',
          admin: { width: '50%' },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Адрес',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'telegram',
          type: 'text',
          label: 'Telegram',
          admin: { width: '33%' },
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
          admin: { width: '33%' },
        },
        {
          name: 'vk',
          type: 'text',
          label: 'VK',
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'workingHours',
      type: 'text',
      label: 'Часы работы',
      defaultValue: 'Пн–Пт 10:00–19:00',
    },
  ],
}
