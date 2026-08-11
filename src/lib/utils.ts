import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = 'RUB'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

function normalizeMediaPath(url: string): string {
  if (url.startsWith('/')) return url
  try {
    const parsed = new URL(url)
    if (
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname.startsWith('192.168.')
    ) {
      return parsed.pathname
    }
  } catch {
    return url
  }
  return url
}

export function getMediaUrl(
  media: { url?: string | null; filename?: string | null } | string | null | undefined,
): string | null {
  if (!media) return null
  if (typeof media === 'string') return normalizeMediaPath(media)
  if (media.url) return normalizeMediaPath(media.url)
  return null
}

export function getMediaAlt(
  media: { alt?: string | null } | string | null | undefined,
  fallback = '',
): string {
  if (!media || typeof media === 'string') return fallback
  return media.alt || fallback
}
