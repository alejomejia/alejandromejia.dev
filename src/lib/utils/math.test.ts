import { describe, expect, it } from 'vitest'

import { clamp, frameLerp } from './math'

describe('frameLerp', () => {
  it('returns the 60 fps factor for a 60 fps frame', () => {
    expect(frameLerp(0.15, 1000 / 60)).toBeCloseTo(0.15)
  })

  it('eases the same distance per second at 120 Hz as at 60 Hz', () => {
    const remainingAt60 = 1 - frameLerp(0.15, 1000 / 60)
    const remainingAt120 = (1 - frameLerp(0.15, 1000 / 120)) ** 2
    expect(remainingAt120).toBeCloseTo(remainingAt60)
  })
})

describe('clamp', () => {
  it('limits a value to the range', () => {
    expect(clamp(-1, 0, 1)).toBe(0)
    expect(clamp(0.5, 0, 1)).toBe(0.5)
    expect(clamp(2, 0, 1)).toBe(1)
  })
})
