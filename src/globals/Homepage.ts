import type { GlobalConfig } from 'payload'

import { homepageBlocks } from '../blocks/homepage'
import { revalidateGlobal } from '../hooks/revalidate'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Главная страница',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      label: 'Блоки страницы',
      blocks: homepageBlocks,
      required: true,
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
