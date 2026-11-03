import { describe, expect, it } from 'vitest'

import {
  formatDate,
  formatMessage,
  formatMonth,
  formatMonthDay,
  formatYears,
  monthSpan,
  slugify,
  unitSuffix,
} from './format'

describe('date formats', () => {
  it('formats in UTC, so a midnight date never slips to the day before', () => {
    expect(formatDate('2026-10-07')).toBe('October 7, 2026')
    expect(formatDate('2026-01-01T00:00:00.000Z')).toBe('January 1, 2026')
    expect(formatMonth('2026-10-07')).toBe('Oct 2026')
    expect(formatMonthDay('2026-10-07')).toBe('Oct 7')
  })
})

describe('formatYears', () => {
  it('shows one year when a project starts and ends in it', () => {
    expect(formatYears('2024-02-01', '2024-11-01')).toBe('2024')
  })

  it('shortens the end year within a century', () => {
    expect(formatYears('2021-03-01', '2023-06-01')).toBe('2021–23')
  })

  it('keeps both years in full across a century', () => {
    expect(formatYears('1998-01-01', '2002-01-01')).toBe('1998–2002')
  })

  it('leaves an open dash while it runs', () => {
    expect(formatYears('2024-04-01')).toBe('2024–')
    expect(formatYears('2024-04-01', null)).toBe('2024–')
  })
})

describe('monthSpan', () => {
  it('counts both the first and the last month, like a CV', () => {
    expect(monthSpan('2024-04-01', '2025-09-01')).toBe(18)
    expect(monthSpan('2024-04-01', '2024-04-01')).toBe(1)
  })

  it('runs to now without an end', () => {
    expect(monthSpan('2026-01-01', null, new Date('2026-03-15'))).toBe(3)
  })
})

describe('slugify', () => {
  it('makes lowercase ASCII words joined by dashes', () => {
    expect(slugify('Your rights & choices')).toBe('your-rights-choices')
  })

  it('drops accents instead of the letters', () => {
    expect(slugify('Alejandro Mejía')).toBe('alejandro-mejia')
  })

  it('trims dashes at both ends', () => {
    expect(slugify('  ¿Why? ')).toBe('why')
  })
})

describe('formatMessage', () => {
  it('fills placeholders', () => {
    expect(formatMessage('Page {page} of {total}', { page: 2, total: 5 })).toBe('Page 2 of 5')
  })

  it('leaves unknown placeholders visible', () => {
    expect(formatMessage('Hi {name}', {})).toBe('Hi {name}')
  })
})

describe('unitSuffix', () => {
  it('spaces words and attaches signs', () => {
    expect(unitSuffix('h')).toBe(' h')
    expect(unitSuffix('%')).toBe('%')
    expect(unitSuffix('+')).toBe('+')
  })

  it('is empty without a unit', () => {
    expect(unitSuffix(undefined)).toBe('')
    expect(unitSuffix('  ')).toBe('')
  })
})
