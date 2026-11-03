import { afterEach, describe, expect, it, vi } from 'vitest'

import { formatLength, measureDistances } from './inspect-mode.utils'

/** Fakes the root font size the visitor's browser uses. */
function stubRootFontSize(px: number) {
  vi.stubGlobal('document', { documentElement: {} })
  vi.stubGlobal('getComputedStyle', () => ({ fontSize: `${px}px` }))
}

const rect = (left: number, top: number, width: number, height: number) =>
  ({ left, top, width, height, right: left + width, bottom: top + height }) as DOMRect

afterEach(() => vi.unstubAllGlobals())

describe('formatLength', () => {
  it('names a spacing token when the length is exactly one', () => {
    stubRootFontSize(16)
    expect(formatLength(24)).toBe('24 · pad-m')
  })

  it('falls back to rem off the token scale', () => {
    stubRootFontSize(16)
    expect(formatLength(20)).toBe('20 · 1.25rem')
  })

  it('reads in design px at a larger default font size', () => {
    stubRootFontSize(20)
    expect(formatLength(30)).toBe('24 · pad-m')
  })
})

describe('measureDistances', () => {
  it('measures the gap between boxes side by side', () => {
    expect(measureDistances(rect(0, 0, 100, 40), rect(124, 0, 100, 40))).toEqual([
      { axis: 'x', x: 100, y: 20, length: 24 },
    ])
  })

  it('measures all four insets of a box inside another', () => {
    const lengths = measureDistances(rect(16, 8, 68, 24), rect(0, 0, 100, 40)).map((line) => line.length)
    expect(lengths).toEqual([8, 8, 16, 16])
  })

  it('drops sides that touch', () => {
    expect(measureDistances(rect(0, 0, 100, 40), rect(0, 0, 100, 40))).toEqual([])
  })
})
