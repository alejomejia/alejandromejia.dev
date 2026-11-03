import { describe, expect, it } from 'vitest'

import type { CommandItem } from './command-menu.types'
import { filterCommands, withSearchItems } from './command-menu.utils'

const item = (group: CommandItem['group'], label: string, extra: Partial<CommandItem> = {}): CommandItem => ({
  id: `${group}-${label}`,
  group,
  label,
  ...extra,
})

const labels = (items: CommandItem[]) => items.map((entry) => entry.label)

describe('filterCommands', () => {
  it('keeps every item, in group order, for an empty query', () => {
    const items = [item('links', 'GitHub'), item('pages', 'Home'), item('actions', 'Copy email')]
    expect(labels(filterCommands(items, '  '))).toEqual(['Home', 'Copy email', 'GitHub'])
  })

  it('ranks a label start over a word start over a substring', () => {
    const items = [item('pages', 'Background'), item('pages', 'My work'), item('pages', 'Workshop')]
    expect(labels(filterCommands(items, 'work'))).toEqual(['Workshop', 'My work'])
    expect(labels(filterCommands(items, 'ground'))).toEqual(['Background'])
  })

  it('finds an item by its keywords', () => {
    const items = [item('actions', 'Copy email', { keywords: ['contact', 'mail'] })]
    expect(labels(filterCommands(items, 'contact'))).toEqual(['Copy email'])
  })

  it("matches the query's letters in order", () => {
    expect(labels(filterCommands([item('pages', 'Writing')], 'wrt'))).toEqual(['Writing'])
    expect(labels(filterCommands([item('pages', 'Writing')], 'twr'))).toEqual([])
  })

  it('is case- and space-insensitive', () => {
    expect(labels(filterCommands([item('pages', 'Writing')], '  WRI '))).toEqual(['Writing'])
  })

  it('keeps groups in screen order, whatever the score', () => {
    const items = [item('links', 'Writing on Medium'), item('pages', 'My writing')]
    expect(labels(filterCommands(items, 'writing'))).toEqual(['My writing', 'Writing on Medium'])
  })

  it('caps content results per group, so actions stay visible', () => {
    const articles = Array.from({ length: 8 }, (_, index) => item('writing', `Design note ${index}`))
    const results = filterCommands([...articles, item('actions', 'Design mode')], 'design')
    expect(results.filter((entry) => entry.group === 'writing')).toHaveLength(5)
    expect(labels(results)).toContain('Design mode')
  })
})

describe('withSearchItems', () => {
  it('skips search rows for pages the menu already lists', () => {
    const items = [item('pages', 'Home', { href: '/' })]
    const search = [item('writing', 'Home again', { href: '/' }), item('writing', 'Article', { href: '/writing/a' })]
    expect(labels(withSearchItems(items, search))).toEqual(['Home', 'Article'])
  })
})
