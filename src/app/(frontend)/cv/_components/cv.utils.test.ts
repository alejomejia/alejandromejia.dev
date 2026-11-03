import { describe, expect, it } from 'vitest'

import { cvDuration, skillKey } from './cv.utils'

describe('cvDuration', () => {
  it('writes years and months in CV shorthand', () => {
    expect(cvDuration(18)).toBe('1 yr 6 mos')
    expect(cvDuration(25)).toBe('2 yrs 1 mo')
  })

  it('drops a zero part', () => {
    expect(cvDuration(24)).toBe('2 yrs')
    expect(cvDuration(3)).toBe('3 mos')
  })
})

describe('skillKey', () => {
  it('matches a skill however it is written', () => {
    expect(skillKey(' Next.js ')).toBe(skillKey('next.js'))
  })
})
