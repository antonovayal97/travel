import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function RichTextContent({ data }: { data: SerializedEditorState | null | undefined }) {
  if (!data) return null
  return (
    <div className="prose-travel space-y-4 text-[var(--color-muted)] leading-relaxed [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-[var(--color-charcoal)] [&_h3]:font-display [&_h3]:text-2xl [&_h3]:text-[var(--color-charcoal)] [&_p]:text-base md:[&_p]:text-lg [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-[var(--color-forest)]">
      <RichText data={data} />
    </div>
  )
}
