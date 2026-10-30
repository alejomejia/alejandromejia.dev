import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { admins, anyone, authenticated } from '@/payload/access'
import { siteRevalidateHooks } from '@/payload/hooks/revalidate'

/**
 * The shared topics of Work, Writing and Craft (Design systems, Motion,
 * Accessibility…): one short, fixed list so filters stay useful. Publicly
 * readable; only editors can change it.
 */
export const Topics: CollectionConfig = {
  slug: 'topics',
  labels: { singular: 'Topic', plural: 'Topics' },
  access: {
    create: authenticated,
    update: authenticated,
    delete: admins,
    read: anyone,
  },
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    description: 'Keep the list short (under ten): every topic becomes a filter.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
  ],
  // Topic names render on every entry that uses them.
  hooks: siteRevalidateHooks,
}
