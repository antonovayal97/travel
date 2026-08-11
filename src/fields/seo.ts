import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Метаданные для поисковых систем и соцсетей',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Meta Title',
      admin: {
        description: 'Если пусто — используется заголовок страницы',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Meta Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'OG Image',
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'Скрыть от индексации',
      defaultValue: false,
    },
  ],
}
