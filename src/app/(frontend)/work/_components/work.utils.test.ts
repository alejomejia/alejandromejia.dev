import { describe, expect, it } from 'vitest'

import { chapterNumber, chapterPages } from './work.utils'
import type { WorkEntry } from './work.types'

describe('chapterNumber', () => {
  it('pads both numbers to two digits', () => {
    expect(chapterNumber(2, 7)).toBe('02 / 07')
    expect(chapterNumber(10, 12)).toBe('10 / 12')
  })
})

describe('chapterPages', () => {
  it('starts with the overview, then each chapter under the case study', () => {
    const work = {
      slug: 'design-system',
      summary: 'Overview',
      chapters: [{ slug: 'tokens', title: 'Tokens', summary: 'How tokens work' }],
    } as unknown as WorkEntry
    expect(chapterPages(work, 'Overview title').map((page) => page.href)).toEqual([
      '/work/design-system',
      '/work/design-system/tokens',
    ])
  })
})
