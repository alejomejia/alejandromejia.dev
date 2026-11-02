import { SPACING_TOKENS } from './inspect-mode.const'
import type { InspectBox, InspectDetail, InspectDistance, InspectMeasure } from './inspect-mode.types'

/** Rounds to one decimal and drops a trailing `.0`: `24`, `12.5`. */
function round(value: number): string {
  return String(Math.round(value * 10) / 10)
}

/**
 * CSS px per design px. Every length is in rem, so a visitor's larger default
 * font (20px instead of 16px) scales the page; labels divide by this to keep
 * reading in the design's px (`24 · pad-m`). Overlay boxes stay in CSS px.
 */
function rootScale(): number {
  return (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) / 16
}

/** A rect as an overlay box, snapped to whole pixels so hairlines stay crisp. */
export function toBox(rect: DOMRect): InspectBox {
  return { x: Math.round(rect.left), y: Math.round(rect.top), w: Math.round(rect.width), h: Math.round(rect.height) }
}

/**
 * A length as the redline labels show it: px, then the spacing token when it
 * is exactly one (`24 · pad-m`), else rem (`20 · 1.25rem`).
 */
export function formatLength(length: number): string {
  const px = length / rootScale()
  const rounded = Math.round(px)
  const token = Math.abs(px - rounded) < 0.05 ? SPACING_TOKENS[rounded] : undefined
  return token ? `${round(px)} · ${token}` : `${round(px)} · ${round(px / 16)}rem`
}

/** Four sides as Figma lists them: one value when they match, two when opposite sides do, else all four. */
function formatSides([top, right, bottom, left]: number[]): string {
  if (top === right && right === bottom && bottom === left) return round(top)
  if (top === bottom && left === right) return `${round(top)} ${round(right)}`
  return [top, right, bottom, left].map(round).join(' ')
}

/** An element's box, its padding areas (empty sides skipped) and its `W × H` label. */
export function measureElement(element: Element): InspectMeasure {
  const rect = element.getBoundingClientRect()
  const box = toBox(rect)
  const style = getComputedStyle(element)
  const [top, right, bottom, left] = [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].map(
    (value) => Math.round(parseFloat(value) || 0),
  )
  const padding = [
    { x: box.x, y: box.y, w: box.w, h: top },
    { x: box.x, y: box.y + box.h - bottom, w: box.w, h: bottom },
    { x: box.x, y: box.y + top, w: left, h: box.h - top - bottom },
    { x: box.x + box.w - right, y: box.y + top, w: right, h: box.h - top - bottom },
  ].filter(({ w, h }) => w > 0 && h > 0)

  const scale = rootScale()
  return { box, padding, size: `${round(rect.width / scale)} × ${round(rect.height / scale)}` }
}

/**
 * The redlines between two elements, Figma style. Apart on an axis: the gap
 * between their facing edges, drawn through the middle of what they share on
 * the other axis (or through `from`'s center). Overlapping (one inside the
 * other): the inner box's distance to each edge of the outer one.
 */
export function measureDistances(from: DOMRect, to: DOMRect): InspectDistance[] {
  const overlapX = from.left < to.right && to.left < from.right
  const overlapY = from.top < to.bottom && to.top < from.bottom
  const midX = overlapX
    ? (Math.max(from.left, to.left) + Math.min(from.right, to.right)) / 2
    : from.left + from.width / 2
  const midY = overlapY
    ? (Math.max(from.top, to.top) + Math.min(from.bottom, to.bottom)) / 2
    : from.top + from.height / 2
  const lines: InspectDistance[] = []

  if (overlapX && overlapY) {
    const [inner, outer] = from.width * from.height <= to.width * to.height ? [from, to] : [to, from]
    lines.push(
      { axis: 'y', x: midX, y: outer.top, length: inner.top - outer.top },
      { axis: 'y', x: midX, y: inner.bottom, length: outer.bottom - inner.bottom },
      { axis: 'x', x: outer.left, y: midY, length: inner.left - outer.left },
      { axis: 'x', x: inner.right, y: midY, length: outer.right - inner.right },
    )
  } else {
    if (!overlapX) {
      const [left, right] = from.right <= to.left ? [from, to] : [to, from]
      lines.push({ axis: 'x', x: left.right, y: midY, length: right.left - left.right })
    }
    if (!overlapY) {
      const [top, bottom] = from.bottom <= to.top ? [from, to] : [to, from]
      lines.push({ axis: 'y', x: midX, y: top.bottom, length: bottom.top - top.bottom })
    }
  }

  return lines
    .filter(({ length }) => length >= 0.5)
    .map((line) => ({ ...line, x: Math.round(line.x), y: Math.round(line.y) }))
}

/** Whether an element has text of its own (not only through children), so its type is worth showing. */
function hasOwnText(element: Element): boolean {
  return [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
}

/** The selection panel's rows: size, then padding, gap, radius and type when they apply. */
export function describeElement(element: Element): InspectDetail[] {
  const rect = element.getBoundingClientRect()
  const style = getComputedStyle(element)
  const scale = rootScale()
  const px = (value: string) => (parseFloat(value) || 0) / scale
  const details: InspectDetail[] = [
    { label: 'size', value: `${round(rect.width / scale)} × ${round(rect.height / scale)}` },
  ]

  const padding = [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].map(px)
  if (padding.some(Boolean)) details.push({ label: 'padding', value: formatSides(padding) })

  if (/flex|grid/.test(style.display)) {
    const [row, column] = [px(style.rowGap), px(style.columnGap)]
    if (row || column)
      details.push({ label: 'gap', value: row === column ? round(row) : `${round(row)} ${round(column)}` })
  }

  const radius = px(style.borderTopLeftRadius)
  if (radius) details.push({ label: 'radius', value: radius > 999 ? 'full' : round(radius) })

  if (hasOwnText(element)) {
    const family = style.fontFamily.split(',')[0].replace(/['"]/g, '').trim()
    const lineHeight = style.lineHeight === 'normal' ? 'auto' : round(px(style.lineHeight))
    details.push({ label: 'type', value: `${family} ${round(px(style.fontSize))}/${lineHeight} · ${style.fontWeight}` })
  }

  return details
}

/** Tag and the first words of its text: `h1 "Alejandro Mejía"`. */
export function nameElement(element: Element): string {
  // `innerText` keeps the breaks between blocks (`textContent` would glue "Mejía" to "Senior").
  const text =
    (element instanceof HTMLElement ? element.innerText : element.textContent)?.trim().replace(/\s+/g, ' ') ?? ''
  const snippet = text.length > 24 ? `${text.slice(0, 24)}…` : text
  return snippet ? `${element.tagName.toLowerCase()} "${snippet}"` : element.tagName.toLowerCase()
}
