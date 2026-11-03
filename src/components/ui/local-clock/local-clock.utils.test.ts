import { describe, expect, it } from 'vitest'

import { formatClock } from './local-clock.utils'

describe('formatClock', () => {
  it('shows 24-hour time and the zone name, winter and summer', () => {
    expect(formatClock(Date.parse('2026-01-15T21:15:00Z'), 'Europe/Madrid')).toEqual({ time: '22:15', zone: 'CET' })
    expect(formatClock(Date.parse('2026-07-15T21:15:00Z'), 'Europe/Madrid')).toEqual({ time: '23:15', zone: 'CEST' })
  })

  it('writes midnight as 00, not 24', () => {
    expect(formatClock(Date.parse('2026-01-15T23:05:00Z'), 'Europe/Madrid')?.time).toBe('00:05')
  })

  it('adds seconds when asked', () => {
    expect(formatClock(Date.parse('2026-01-15T21:15:07Z'), 'Europe/Madrid', true)).toEqual({
      time: '22:15:07',
      zone: 'CET',
    })
  })

  it('is null for an unknown zone', () => {
    expect(formatClock(0, 'Mars/Olympus_Mons')).toBeNull()
  })
})
