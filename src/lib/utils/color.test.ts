import { describe, expect, it } from 'vitest'

import { contrastRatio } from './color'

describe('contrastRatio', () => {
  it('spans 1 (same color) to 21 (black on white)', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBe(21)
    expect(contrastRatio('#777777', '#777777')).toBe(1)
  })

  it("doesn't depend on the order of the colors", () => {
    expect(contrastRatio('#111111', '#fcfcfc')).toBe(contrastRatio('#fcfcfc', '#111111'))
  })

  it('reads three-digit hex like its six-digit form', () => {
    expect(contrastRatio('#fff', '#000')).toBe(21)
  })

  it('matches the WCAG AA boundary for #767676 on white', () => {
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2)
  })
})
