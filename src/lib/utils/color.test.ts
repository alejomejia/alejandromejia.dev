import { describe, expect, it } from 'vitest'

import { contrastRatio, ensureContrast, mixColors } from './color'

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

describe('mixColors', () => {
  it('goes from one color to the other', () => {
    expect(mixColors('#000000', '#ffffff', 0)).toBe('#000000')
    expect(mixColors('#000000', '#ffffff', 0.5)).toBe('#808080')
    expect(mixColors('#000', '#fff', 1)).toBe('#ffffff')
  })
})

describe('ensureContrast', () => {
  it('leaves a color that already passes alone', () => {
    expect(ensureContrast('#ededed', '#0f0f0f')).toBe('#ededed')
  })

  it('lightens a dim color on a dark background until it reads at 4.5:1', () => {
    const color = ensureContrast('#4d4d4d', '#202020')
    expect(contrastRatio(color, '#202020')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(color, '#ffffff')).toBeLessThan(contrastRatio('#4d4d4d', '#ffffff'))
  })

  it('darkens a pale color on a light background', () => {
    expect(contrastRatio(ensureContrast('#a0ada0', '#ececec'), '#ececec')).toBeGreaterThanOrEqual(4.5)
  })
})
