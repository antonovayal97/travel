import Image from 'next/image'
import { cn, getMediaAlt, getMediaUrl } from '@/lib/utils'

type MediaLike =
  | {
      url?: string | null
      alt?: string | null
      width?: number | null
      height?: number | null
      sizes?: Record<string, { url?: string | null } | undefined> | null
    }
  | string
  | null
  | undefined

type MediaImageProps = {
  media: MediaLike
  alt?: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
  sizeHint?: 'thumbnail' | 'card' | 'tablet' | 'hero' | 'og'
}

export function MediaImage({
  media,
  alt,
  fill,
  width,
  height,
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority,
  sizeHint,
}: MediaImageProps) {
  if (!media || typeof media === 'string') return null

  let src = getMediaUrl(media)
  if (sizeHint && media.sizes?.[sizeHint]?.url) {
    src = getMediaUrl({ url: media.sizes[sizeHint]?.url }) || src
  }

  if (!src) return null

  const imageAlt = alt || getMediaAlt(media, '')

  if (fill) {
    return (
      <Image
        src={src}
        alt={imageAlt}
        fill
        className={cn('object-cover', className)}
        sizes={sizes}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={imageAlt}
      width={width || media.width || 1200}
      height={height || media.height || 800}
      className={cn('object-cover', className)}
      sizes={sizes}
      priority={priority}
    />
  )
}
