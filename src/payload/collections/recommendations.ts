import type { CollectionConfig } from 'payload'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { admins, anyone, authenticated } from '@/payload/access'
import { siteRevalidateHooks } from '@/payload/hooks/revalidate'

/**
 * Recommendations from people Alejandro has worked with, quoted word for word
 * from LinkedIn with who they are and a link to the original. Shown on About,
 * the CV page and at the end of case studies; never as a carousel.
 */
export const Recommendations: CollectionConfig = {
  slug: 'recommendations',
  labels: { singular: 'Recommendation', plural: 'Recommendations' },
  // Lowest order first, as on the site.
  defaultSort: 'order',
  access: {
    create: authenticated,
    update: authenticated,
    delete: admins,
    read: anyone,
  },
  defaultPopulate: {
    quote: true,
    name: true,
    role: true,
    company: true,
    relationship: true,
    date: true,
    linkedinUrl: true,
  },
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'featured', 'date'],
    description:
      'Word for word: shorten with "…" if needed, never reword. Each one links to the original so anyone can check it.',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: { rows: 6, description: 'Their words, as written on LinkedIn.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'linkedinUrl',
          type: 'text',
          label: 'LinkedIn link',
          admin: { width: '50%', description: 'Their profile or the recommendation itself.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'text',
          admin: { width: '50%', description: 'Their role at the time, e.g. "Engineering Manager".' },
        },
        { name: 'company', type: 'text', admin: { width: '50%', description: 'Where you worked together.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'relationship',
          type: 'text',
          admin: { width: '50%', description: 'How you worked together, e.g. "Managed me" or "Client".' },
        },
        {
          name: 'date',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Shown on the home page (pick three).' },
    },
    {
      name: 'order',
      type: 'number',
      min: 0,
      admin: { position: 'sidebar', step: 1, description: 'Lower numbers come first. Empty goes last.' },
    },
    {
      name: 'relatedWork',
      type: 'relationship',
      label: 'Project',
      relationTo: 'work',
      admin: { position: 'sidebar', description: 'Optional. The case study it’s about.' },
    },
  ],
  hooks: siteRevalidateHooks,
}
