import type { RichTextField } from 'payload'
import {
  BlockquoteFeature,
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { storyBlocks } from '@/payload/blocks'

type StoryContentOptions = {
  required?: boolean
  /** Hint under the editor, saying where it shows on the site. */
  description?: string
}

/**
 * The body of a case study, an article, a note or a Craft entry: rich text
 * with h2–h4 (the title is the page's h1), lists, quotes, inline code, and the
 * story blocks (clips, before/after, code, metrics…) between paragraphs.
 * Stored as `content`.
 */
export function storyContent({ required = false, description }: StoryContentOptions = {}): RichTextField {
  return {
    name: 'content',
    type: 'richText',
    label: false,
    required,
    admin: { description },
    editor: lexicalEditor({
      features: ({ rootFeatures }) => [
        ...rootFeatures,
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        UnorderedListFeature(),
        OrderedListFeature(),
        BlockquoteFeature(),
        InlineCodeFeature(),
        HorizontalRuleFeature(),
        BlocksFeature({ blocks: storyBlocks }),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ],
    }),
  }
}
