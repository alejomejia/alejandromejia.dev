import type { CollectionConfig, Condition } from 'payload'
import { slugField } from 'payload'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { admins, authenticated, authenticatedOrPublished } from '@/payload/access'
import { image } from '@/payload/fields/media'
import { storyContent } from '@/payload/fields/story-content'
import { populatePublishedAt } from '@/payload/hooks/populate-published-at'
import { buildRevalidateHooks } from '@/payload/hooks/revalidate'
import { autosaveVersions } from '@/payload/versions'
import { CODE_LANGUAGE_OPTIONS } from '@/lib/constants/code-languages'
import { generatePreviewPath } from '@/lib/cms/preview'
import { SHARE_CARD_LIMITS } from '@/lib/seo/seo.const'
import { writingPath } from '@/lib/seo/seo.utils'

import type { Writing as WritingDoc } from '@/payload-types'

const revalidate = buildRevalidateHooks<WritingDoc>({
  pathFor: writingPath,
})

const isArticle: Condition = (data) => data?.format === 'article'
const isSnippet: Condition = (data) => data?.format === 'snippet'
const isNotSnippet: Condition = (data) => data?.format !== 'snippet'

/** True when a rich-text value holds anything besides empty paragraphs (a block counts). */
function hasContent(value: { root?: { children?: unknown[] } } | null | undefined): boolean {
  return (value?.root?.children ?? []).some((node) => {
    const { type, children } = node as { type?: string; children?: unknown[] }
    return type !== 'paragraph' || (children?.length ?? 0) > 0
  })
}

/**
 * Everything written for the site, in one stream with three formats: an
 * article (an argument or a deep dive), a note (a paragraph on something just
 * learned) and a snippet (copy-paste code with a one-line why). The admin
 * shows only the fields of the chosen format. Draft/publish is on; the public
 * only reads published entries.
 */
export const Writing: CollectionConfig<'writing'> = {
  slug: 'writing',
  labels: { singular: 'Writing entry', plural: 'Writing' },
  access: {
    create: authenticated,
    update: authenticated,
    delete: admins,
    read: authenticatedOrPublished,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    format: true,
    topics: true,
  },
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: 'title',
    defaultColumns: ['title', 'format', 'publishedAt', 'updatedAt'],
    description: 'Articles, notes and snippets, listed together at /writing and filterable by format.',
    livePreview: {
      url: ({ data }) =>
        generatePreviewPath({ collection: 'writing', slug: data?.slug }) ?? '',
    },
    preview: (data) =>
      generatePreviewPath({ collection: 'writing', slug: data?.slug as string }) ?? '',
  },
  fields: [
    {
      // Must stay first: the SEO plugin appends its tab here. Without it, the
      // plugin wraps every field in one tab, pulling the sidebar fields into
      // the main column. Unnamed tabs only group fields; the data stays flat.
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              maxLength: SHARE_CARD_LIMITS.title,
              admin: {
                description: `For a note, a short headline is enough. Up to ${SHARE_CARD_LIMITS.title} characters, so it fits the share image.`,
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              maxLength: SHARE_CARD_LIMITS.description,
              admin: {
                condition: isArticle,
                rows: 2,
                description: `One or two sentences, shown in lists, on the share image and as the search description when the SEO tab has none. Up to ${SHARE_CARD_LIMITS.description} characters.`,
              },
            },
            image({
              name: 'cover',
              label: 'Cover',
              condition: isArticle,
              description: 'Optional. Shown at the top of the article and as its share image. Most articles don’t need one.',
            }),
            {
              name: 'why',
              type: 'text',
              label: 'Why',
              required: true,
              admin: {
                condition: isSnippet,
                description: 'One line on what it’s for, shown above the code, e.g. "Pause canvas loops while off screen."',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'language',
                  type: 'select',
                  label: 'Language',
                  required: true,
                  defaultValue: 'tsx',
                  options: CODE_LANGUAGE_OPTIONS,
                  admin: { condition: isSnippet, width: '50%' },
                },
                {
                  name: 'sourceUrl',
                  type: 'text',
                  label: 'Source link',
                  admin: {
                    condition: isSnippet,
                    width: '50%',
                    description: 'Optional. Where it’s used for real, e.g. a GitHub file.',
                  },
                },
              ],
            },
            {
              name: 'code',
              type: 'code',
              label: 'Code',
              required: true,
              admin: { condition: isSnippet, language: 'typescript', description: 'Shown with a copy button.' },
            },
            {
              ...storyContent({
                description: 'Articles: h2 for sections. Snippets: optional notes under the code.',
              }),
              // Articles and notes need a body; a snippet's code is enough.
              validate: (value: { root?: { children?: unknown[] } } | null | undefined, { data }: { data: unknown }) =>
                (data as Partial<WritingDoc> | undefined)?.format === 'snippet' || hasContent(value) || 'Write the body.',
            },
          ],
        },
      ],
    },
    {
      name: 'format',
      type: 'select',
      label: 'Format',
      required: true,
      defaultValue: 'article',
      options: [
        { label: 'Article', value: 'article' },
        { label: 'Note', value: 'note' },
        { label: 'Snippet', value: 'snippet' },
      ],
      admin: { position: 'sidebar', description: 'Changes the fields above and how the entry looks on the site.' },
    },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'topics',
      type: 'relationship',
      relationTo: 'topics',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'relatedWork',
      type: 'relationship',
      label: 'Related work',
      relationTo: 'work',
      hasMany: true,
      maxRows: 3,
      admin: { position: 'sidebar', condition: isNotSnippet, description: 'Linked at the end of the entry.' },
    },
    {
      name: 'relatedCraft',
      type: 'relationship',
      label: 'Live demo',
      relationTo: 'craft',
      admin: { position: 'sidebar', condition: isSnippet, description: 'Optional. The Craft entry where this code runs.' },
    },
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidate.afterChange],
    afterDelete: [revalidate.afterDelete],
  },
  versions: autosaveVersions,
}
