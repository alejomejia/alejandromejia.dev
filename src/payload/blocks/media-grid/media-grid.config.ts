import type { Block } from 'payload'

import { imageOrVideo } from '@/payload/fields/media'
import { textRowLabel } from '@/payload/fields/row-labels'

/** Two or three images or clips side by side (stacked on phones), with a shared caption. */
export const MediaGrid: Block = {
  slug: 'mediaGrid',
  interfaceName: 'MediaGridBlock',
  labels: { singular: 'Media grid', plural: 'Media grids' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Images and clips',
      labels: { singular: 'Item', plural: 'Items' },
      minRows: 2,
      maxRows: 3,
      required: true,
      admin: { initCollapsed: true, components: { RowLabel: textRowLabel('label', 'Item') } },
      fields: [
        ...imageOrVideo({ required: true }),
        {
          name: 'label',
          type: 'text',
          admin: { description: 'Optional. A short label under this item, e.g. "Mobile".' },
        },
      ],
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Optional. Shown under the grid.' },
    },
  ],
}
