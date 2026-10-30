import type { Block } from 'payload'

/** A recommendation from someone you worked with, quoted with their name and role. */
export const Quote: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: { singular: 'Recommendation', plural: 'Recommendations' },
  fields: [
    {
      name: 'recommendation',
      type: 'relationship',
      relationTo: 'recommendations',
      required: true,
      admin: { description: 'Shown word for word, with their name, role and a link to the original.' },
    },
  ],
}
