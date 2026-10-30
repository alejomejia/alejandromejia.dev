import type { Block } from 'payload'

import { textRowLabel } from '@/payload/fields/row-labels'

/** Two to four key numbers in a row: the outcome of a project at a glance. */
export const Metrics: Block = {
  slug: 'metrics',
  interfaceName: 'MetricsBlock',
  labels: { singular: 'Metrics', plural: 'Metrics' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Numbers',
      labels: { singular: 'Number', plural: 'Numbers' },
      minRows: 2,
      maxRows: 4,
      required: true,
      admin: { initCollapsed: true, components: { RowLabel: textRowLabel('label', 'Number') } },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { width: '33%', description: 'E.g. "98", "−40%", "3×".' },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { width: '67%', description: 'What it measures, e.g. "Lighthouse performance".' },
            },
          ],
        },
      ],
    },
  ],
}
