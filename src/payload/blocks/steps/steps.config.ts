import type { Block } from 'payload'

import { textRowLabel } from '@/payload/fields/row-labels'

/** Numbered steps: how a project got from the problem to the result. */
export const Steps: Block = {
  slug: 'steps',
  interfaceName: 'StepsBlock',
  labels: { singular: 'Steps', plural: 'Steps' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Steps',
      labels: { singular: 'Step', plural: 'Steps' },
      minRows: 2,
      maxRows: 8,
      required: true,
      admin: { initCollapsed: true, components: { RowLabel: textRowLabel('title', 'Step') } },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', admin: { rows: 2, description: 'Optional. One or two sentences.' } },
      ],
    },
  ],
}
