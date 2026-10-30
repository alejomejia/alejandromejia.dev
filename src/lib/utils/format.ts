// The site is English only. A fixed tag (not the runtime default) makes the
// server and the browser render the same string.
const FORMAT_LOCALE = 'en-US'

/**
 * Formats an ISO date as a long, human date.
 * @example formatDate('2026-10-07') // 'October 7, 2026'
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(FORMAT_LOCALE, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

/**
 * Formats an ISO date as a short month and year, for lists.
 * @example formatMonth('2026-10-07') // 'Oct 2026'
 */
export function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString(FORMAT_LOCALE, { year: 'numeric', month: 'short', timeZone: 'UTC' })
}

/**
 * The years a project ran, compact: one year when it started and ended in
 * it, an open dash while it runs, the end year's last two digits otherwise.
 * @example formatYears('2021-03-01', '2023-06-01') // '2021–23'
 * @example formatYears('2024-04-01') // '2024–'
 */
export function formatYears(start: string, end?: string | null): string {
  const from = new Date(start).getUTCFullYear()
  if (!end) return `${from}–`
  const to = new Date(end).getUTCFullYear()
  if (to === from) return String(from)
  return Math.floor(to / 100) === Math.floor(from / 100) ? `${from}–${String(to).slice(-2)}` : `${from}–${to}`
}

/**
 * Turns a heading into a URL fragment: lowercase ASCII words joined by dashes.
 * @example slugify('Your rights & choices') // 'your-rights-choices'
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Fills the `{name}` placeholders of a message. Unknown placeholders are left
 * as they are, so a typo shows up on the page.
 * @example formatMessage(COPY.pagination.status, { page: 2, total: 5 }) // 'Page 2 of 5'
 */
export function formatMessage(message: string, values: Record<string, string | number>): string {
  return message.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))
}

/**
 * A unit as the suffix after a number: words get a space ("24 h", "60 min"),
 * signs don't ("40%", "10+"). Empty for no unit.
 */
export function unitSuffix(unit: string | null | undefined): string {
  const trimmed = unit?.trim()
  if (!trimmed) return ''
  return /^[%+]/.test(trimmed) ? trimmed : ` ${trimmed}`
}
