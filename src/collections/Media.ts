import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const mediaDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../media')

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Медиа',
    plural: 'Медиа',
  },
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  upload: {
    staticDir: mediaDir,
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1200,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt-текст',
      required: true,
      admin: {
        description: 'Описание изображения для доступности и SEO',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Подпись',
    },
  ],
}
