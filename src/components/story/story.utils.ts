import { slugify } from '@/lib/utils'

import type { StoryNode } from './story.types'

// A calm reading pace for technical prose.
const WORDS_PER_MINUTE = 220

/** The URL fragment of a story heading, shared by `StoryContent` and the lists that link to it. */
export function storyHeadingId(text: string): string {
  return slugify(text)
}

/** A story's h2s with their fragments, in reading order, for a table of contents. */
export function storyHeadings(nodes: StoryNode[]): Array<{ id: string; text: string }> {
  return nodes.flatMap((node) => (node.type === 'heading' ? { id: storyHeadingId(node.text), text: node.text } : []))
}

/** Minutes to read a story's prose (at least one). Code and media are left out: readers skim them. */
export function storyReadingMinutes(nodes: StoryNode[]): number {
  const text = nodes
    .map((node) => {
      switch (node.type) {
        case 'heading':
        case 'paragraph':
        case 'callout':
          return node.text
        case 'list':
          return node.items.join(' ')
        case 'steps':
          return node.items.map((step) => `${step.title} ${step.text ?? ''}`).join(' ')
        default:
          return ''
      }
    })
    .join(' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
