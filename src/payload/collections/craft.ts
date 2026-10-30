import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { admins, authenticated, authenticatedOrPublished } from '@/payload/access'
import { imageOrVideo } from '@/payload/fields/media'
import { storyContent } from '@/payload/fields/story-content'
import { populatePublishedAt } from '@/payload/hooks/populate-published-at'
import { buildRevalidateHooks } from '@/payload/hooks/revalidate'
import { autosaveVersions } from '@/payload/versions'
import { CODE_LANGUAGE_OPTIONS } from '@/lib/constants/code-languages'
import { CRAFT_DEMO_OPTIONS } from '@/lib/constants/craft-demos'
import { generatePreviewPath } from '@/lib/cms/preview'
import { SHARE_CARD_LIMITS } from '@/lib/seo/seo.const'
import { craftPath } from '@/lib/seo/seo.utils'

import type { Craft as CraftDoc } from '@/payload-types'

const revalidate = buildRevalidateHooks<CraftDoc>({
  pathFor: craftPath,
})

/**
 * Live UI experiments: a running demo (picked from the demos built in code),
 * its key code and a short write-up. Draft/publish is on; the public only
 * reads published entries.
 */
export const Craft: CollectionConfig<'craft'> = {
  slug: 'craft',
  labels: { singular: 'Craft entry', plural: 'Craft' },
  access: {
    create: authenticated,
    update: authenticated,
    delete: admins,
    read: authenticatedOrPublished,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    description: true,
    demo: true,
  },
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: 'title',
    defaultColumns: ['title', 'demo', 'publishedAt', 'updatedAt'],
    description: 'Live experiments, listed at /craft.',
    livePreview: {
      url: ({ data }) => generatePreviewPath({ collection: 'craft', slug: data?.slug }) ?? '',
    },
    preview: (data) => generatePreviewPath({ collection: 'craft', slug: data?.slug as string }) ?? '',
  },
  fields: [
    {
      // Must stay first: the SEO plugin appends its tab here (see Writing).
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
              admin: { description: `Up to ${SHARE_CARD_LIMITS.title} characters, so it fits the share image.` },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              maxLength: SHARE_CARD_LIMITS.description,
              admin: {
                rows: 2,
                description: `One or two sentences, shown on the list, under the title and on the share image. Up to ${SHARE_CARD_LIMITS.description} characters.`,
              },
            },
            {
              name: 'demo',
              type: 'select',
              label: 'Demo',
              required: true,
              options: CRAFT_DEMO_OPTIONS,
              admin: { description: 'The live demo at the top of the page. Demos are built in code; new ones appear here once they ship.' },
            },
            {
              name: 'fallback',
              type: 'group',
              label: 'Recording',
              admin: {
                description:
                  'A short recording of the demo, shown to visitors who turn off motion, in the list and when the page is shared.',
              },
              fields: imageOrVideo(),
            },
            {
              type: 'collapsible',
              label: 'Key code',
              admin: { initCollapsed: true, description: 'Optional. The few lines that make it work, shown under the demo.' },
              fields: [
                {
                  name: 'codeLanguage',
                  type: 'select',
                  label: 'Language',
                  defaultValue: 'tsx',
                  options: CODE_LANGUAGE_OPTIONS,
                },
                {
                  name: 'code',
                  type: 'code',
                  label: 'Code',
                  admin: { language: 'typescript' },
                },
              ],
            },
            storyContent({ description: 'Optional. How it’s built and why, under the code.' }),
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'topics',
      type: 'relationship',
      relationTo: 'topics',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidate.afterChange],
    afterDelete: [revalidate.afterDelete],
  },
  versions: autosaveVersions,
}
