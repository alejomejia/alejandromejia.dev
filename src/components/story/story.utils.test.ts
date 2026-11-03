import { describe, expect, it } from 'vitest'

import type { StoryNode } from './story.types'
import { storyHeadings, storyReadingMinutes } from './story.utils'

describe('storyHeadings', () => {
  it('lists the headings with their URL fragments', () => {
    const nodes: StoryNode[] = [
      { type: 'heading', text: 'The problem' },
      { type: 'paragraph', text: 'Text' },
      { type: 'heading', text: 'What I built' },
    ]
    expect(storyHeadings(nodes)).toEqual([
      { id: 'the-problem', text: 'The problem' },
      { id: 'what-i-built', text: 'What I built' },
    ])
  })
})

describe('storyReadingMinutes', () => {
  it('reads prose at 220 words a minute', () => {
    const words = (count: number) => Array.from({ length: count }, () => 'word').join(' ')
    expect(storyReadingMinutes([{ type: 'paragraph', text: words(660) }])).toBe(3)
  })

  it('counts lists and steps, never less than a minute', () => {
    expect(storyReadingMinutes([{ type: 'list', items: ['one', 'two'] }])).toBe(1)
  })
})
