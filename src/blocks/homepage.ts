import type { Block } from 'payload'

const buttonFields = [
  {
    name: 'label',
    type: 'text' as const,
    required: true,
    label: 'Текст',
  },
  {
    name: 'href',
    type: 'text' as const,
    required: true,
    label: 'Ссылка',
  },
]

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Hero',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      defaultValue: 'TRAVEL DIFFERENTLY',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
      defaultValue: 'Путешествия, которые остаются с вами навсегда.',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Фоновое изображение',
      required: true,
    },
    {
      name: 'primaryButton',
      type: 'group',
      label: 'Основная кнопка',
      fields: buttonFields,
    },
    {
      name: 'secondaryButton',
      type: 'group',
      label: 'Вторичная кнопка',
      fields: buttonFields,
    },
    {
      name: 'statistics',
      type: 'array',
      label: 'Статистика',
      maxRows: 4,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Значение',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Подпись',
        },
      ],
    },
  ],
}

export const TourSearchBlock: Block = {
  slug: 'tourSearch',
  labels: {
    singular: 'Поиск туров',
    plural: 'Поиск туров',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Найдите своё путешествие',
    },
  ],
}

export const DestinationsBlock: Block = {
  slug: 'destinations',
  labels: {
    singular: 'Направления',
    plural: 'Направления',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'DESTINATIONS',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Куда отправимся?',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Количество',
      defaultValue: 6,
      min: 1,
      max: 12,
    },
    {
      name: 'showFeaturedOnly',
      type: 'checkbox',
      label: 'Только избранные',
      defaultValue: true,
    },
  ],
}

export const FeaturedToursBlock: Block = {
  slug: 'featuredTours',
  labels: {
    singular: 'Избранные туры',
    plural: 'Избранные туры',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'FEATURED JOURNEYS',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Авторские маршруты',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 9,
    },
  ],
}

export const StoryBlock: Block = {
  slug: 'story',
  labels: {
    singular: 'История',
    plural: 'Истории',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'OUR STORY',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'cta',
      type: 'group',
      fields: buttonFields,
    },
  ],
}

export const BenefitsBlock: Block = {
  slug: 'benefits',
  labels: {
    singular: 'Преимущества',
    plural: 'Преимущества',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Почему путешествуют с нами',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Пункты',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Отзывы',
    plural: 'Отзывы',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'STORIES',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Что говорят путешественники',
      required: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
    },
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Галерея',
    plural: 'Галереи',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Моменты путешествий',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Изображения',
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
}

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'CTA',
    plural: 'CTA',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок',
      defaultValue: 'Готовы к следующему путешествию?',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'primaryButton',
      type: 'group',
      fields: buttonFields,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

export const homepageBlocks = [
  HeroBlock,
  TourSearchBlock,
  DestinationsBlock,
  FeaturedToursBlock,
  StoryBlock,
  BenefitsBlock,
  TestimonialsBlock,
  GalleryBlock,
  CTABlock,
]
