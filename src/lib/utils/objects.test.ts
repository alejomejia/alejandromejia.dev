import { describe, expect, it } from 'vitest'

import { deepMerge, groupBy, mapStrings } from './objects'

describe('deepMerge', () => {
  it('merges nested objects and lets arrays and primitives overwrite', () => {
    const target = { admin: { position: 'sidebar', hidden: false }, options: ['a', 'b'], label: 'Old' }
    const source = { admin: { hidden: true }, options: ['c'], label: 'New' }
    expect(deepMerge(target, source)).toEqual({
      admin: { position: 'sidebar', hidden: true },
      options: ['c'],
      label: 'New',
    })
  })

  it("doesn't mutate the target", () => {
    const target = { admin: { hidden: false } }
    deepMerge(target, { admin: { hidden: true } })
    expect(target.admin.hidden).toBe(false)
  })
})

describe('mapStrings', () => {
  it('maps every string, deep, with the key it sits under', () => {
    const value = { title: 'a', tags: ['b'], meta: { note: 'c', count: 1 } }
    const result = mapStrings(value, (text, key) => `${key ?? '-'}:${text}`)
    expect(result).toEqual({ title: 'title:a', tags: ['-:b'], meta: { note: 'note:c', count: 1 } })
  })
})

describe('groupBy', () => {
  it('keeps first-seen order, across and inside groups', () => {
    const posts = [
      { year: '2026', id: 1 },
      { year: '2025', id: 2 },
      { year: '2026', id: 3 },
    ]
    expect(groupBy(posts, (post) => post.year)).toEqual([
      ['2026', [posts[0], posts[2]]],
      ['2025', [posts[1]]],
    ])
  })
})
