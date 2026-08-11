/** Извлекает только цифры из строки. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Нормализует российский номер до 11 цифр (7XXXXXXXXXX).
 * 8… → 7…, номер с 9… без кода страны → 79…
 */
export function normalizeRuPhoneDigits(input: string): string {
  let digits = digitsOnly(input)

  if (!digits) return ''

  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  } else if (digits.startsWith('9')) {
    digits = `7${digits}`
  } else if (!digits.startsWith('7')) {
    digits = `7${digits}`
  }

  return digits.slice(0, 11)
}

/** Маска: +7 (999) 999-99-99 */
export function formatRuPhone(input: string): string {
  const digits = normalizeRuPhoneDigits(input)
  if (!digits) return ''

  const local = digits.slice(1)
  let result = '+7'

  if (local.length === 0) return result

  result += ` (${local.slice(0, Math.min(3, local.length))}`
  if (local.length < 3) return result

  result += ')'
  if (local.length === 3) return result

  result += ` ${local.slice(3, Math.min(6, local.length))}`
  if (local.length <= 6) return result

  result += `-${local.slice(6, Math.min(8, local.length))}`
  if (local.length <= 8) return result

  result += `-${local.slice(8, 10)}`
  return result
}

export function isCompleteRuPhone(value: string): boolean {
  const digits = normalizeRuPhoneDigits(value)
  return digits.length === 11 && digits.startsWith('7')
}
