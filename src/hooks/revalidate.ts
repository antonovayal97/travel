import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

function safeRevalidate(run: () => void) {
  try {
    run()
  } catch {
    // Outside Next.js request context (e.g. seed scripts)
  }
}

export const revalidateCollection: CollectionAfterChangeHook = ({ doc, collection }) => {
  const slug = collection.slug
  safeRevalidate(() => {
    revalidateTag(slug, 'max')
    revalidatePath('/')
    if (slug === 'tours') revalidatePath('/tours')
    if (slug === 'destinations') revalidatePath('/destinations')
  })
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global }) => {
  safeRevalidate(() => {
    revalidateTag(global.slug, 'max')
    revalidatePath('/')
  })
  return doc
}
