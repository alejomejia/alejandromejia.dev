import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { admins, authenticated, authenticatedOrPublished } from '@/payload/access'
import { imageOrVideo } from '@/payload/fields/media'
import { textRowLabel } from '@/payload/fields/row-labels'
import { storyContent } from '@/payload/fields/story-content'
import { populatePublishedAt } from '@/payload/hooks/populate-published-at'
import { buildRevalidateHooks } from '@/payload/hooks/revalidate'
import { autosaveVersions } from '@/payload/versions'
import { generatePreviewPath } from '@/lib/cms/preview'
import { SHARE_CARD_LIMITS } from '@/lib/seo/seo.const'
import { workPath } from '@/lib/seo/seo.utils'

import type { Work as WorkDoc } from '@/payload-types'

const revalidate = buildRevalidateHooks<WorkDoc>({
  pathFor: workPath,
})

/**
 * Case studies: what was built, how and with whom, told with clips and
 * before/after comparisons where the work can't be linked. Draft/publish is
 * on; the public only reads published case studies.
 */
export const Work: CollectionConfig<'work'> = {
  slug: 'work',
  labels: { singular: 'Case study', plural: 'Work' },
  // Lowest order first, as on the site.
  defaultSort: 'order',
  access: {
    create: authenticated,
    update: authenticated,
    delete: admins,
    read: authenticatedOrPublished,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    summary: true,
    cover: true,
    confidential: true,
  },
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'order', 'updatedAt'],
    description: 'Case studies, listed at /work: featured ones first, by order.',
    livePreview: {
      url: ({ data }) => generatePreviewPath({ collection: 'work', slug: data?.slug }) ?? '',
    },
    preview: (data) => generatePreviewPath({ collection: 'work', slug: data?.slug as string }) ?? '',
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
              admin: {
                description: `What it is, plainly: "Desigual design system", not a slogan. Up to ${SHARE_CARD_LIMITS.title} characters, so it fits the share image.`,
              },
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              maxLength: SHARE_CARD_LIMITS.description,
              admin: {
                rows: 2,
                description: `One sentence on the problem and what you did, shown on the list, under the title and on the share image. Up to ${SHARE_CARD_LIMITS.description} characters.`,
              },
            },
            {
              name: 'cover',
              type: 'group',
              label: 'Cover',
              fields: imageOrVideo({
                required: true,
                cover: true,
                description: 'Shown on the list (a clip plays on hover) and at the top of the case study.',
              }),
            },
            storyContent({ description: 'The story: the problem, the approach, the result. h2 for each part.' }),
            {
              name: 'retrospective',
              type: 'textarea',
              label: 'What I’d do differently',
              admin: { rows: 3, description: 'Optional. A short, honest closing paragraph.' },
            },
            {
              name: 'recommendation',
              type: 'relationship',
              relationTo: 'recommendations',
              admin: { description: 'Optional. One recommendation from someone on this project, shown at the end.' },
            },
          ],
        },
        {
          label: 'Project',
          description: 'The facts shown in the case study’s header.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'role',
                  type: 'text',
                  required: true,
                  admin: { width: '50%', description: 'Your role, e.g. "Design Engineer".' },
                },
                {
                  name: 'client',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Company or client, e.g. "Desigual, via Kodly". Hidden when the project is confidential.',
                  },
                },
              ],
            },
            {
              name: 'team',
              type: 'text',
              admin: { description: 'Optional. Who you worked with, e.g. "Two designers, four engineers".' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'startDate',
                  type: 'date',
                  label: 'Started',
                  required: true,
                  admin: { width: '50%', date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } },
                },
                {
                  name: 'endDate',
                  type: 'date',
                  label: 'Ended',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
                    description: 'Empty reads as "Present".',
                  },
                },
              ],
            },
            {
              name: 'stack',
              type: 'text',
              hasMany: true,
              admin: { description: 'Tools and technologies, e.g. Vue, Storybook, Changesets. Press Enter after each.' },
            },
            {
              name: 'metrics',
              type: 'array',
              label: 'Outcomes',
              labels: { singular: 'Outcome', plural: 'Outcomes' },
              maxRows: 4,
              admin: {
                initCollapsed: true,
                description: 'Optional. Up to four numbers that sum up the result, shown in the header.',
                components: { RowLabel: textRowLabel('label', 'Outcome') },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', required: true, admin: { width: '33%', description: 'E.g. "−40%".' } },
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      admin: { width: '67%', description: 'E.g. "CSS shipped".' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'liveUrl',
              type: 'text',
              label: 'Live link',
              admin: { description: 'Optional. Where the work can still be seen, e.g. "https://chromia.com".' },
            },
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Shown on the home page and first on the list.' },
    },
    {
      name: 'order',
      type: 'number',
      min: 0,
      admin: { position: 'sidebar', step: 1, description: 'Lower numbers come first. Empty goes last.' },
    },
    {
      name: 'confidential',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Hides the client’s name and adds "Private project, shown with permission."',
      },
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
