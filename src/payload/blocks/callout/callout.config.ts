import type { Block } from 'payload'

/** A short aside set apart from the text: a note, a lesson learned or a trade-off. */
export const Callout: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  labels: { singular: 'Callout', plural: 'Callouts' },
  fields: [
    {
      name: 'kind',
      type: 'select',
      label: 'Kind',
      required: true,
      defaultValue: 'note',
      options: [
        { label: 'Note', value: 'note' },
        { label: 'Lesson', value: 'lesson' },
        { label: 'Trade-off', value: 'tradeoff' },
      ],
      admin: { description: 'Shown as a small label above the text.' },
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      admin: { rows: 3, description: 'One to three sentences.' },
    },
  ],
}
