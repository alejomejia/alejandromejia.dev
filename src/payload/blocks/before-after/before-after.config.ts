import type { Block } from 'payload'

import { imageOrVideo } from '@/payload/fields/media'

/**
 * Two images or clips of the same view, compared with a draggable divider (or
 * a toggle), for redesigns and refactors.
 */
export const BeforeAfter: Block = {
  slug: 'beforeAfter',
  interfaceName: 'BeforeAfterBlock',
  labels: { singular: 'Before and after', plural: 'Before and afters' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'before',
          type: 'group',
          label: 'Before',
          admin: { width: '50%' },
          fields: [
            ...imageOrVideo({ required: true }),
            { name: 'label', type: 'text', defaultValue: 'Before', admin: { description: 'Shown on its side.' } },
          ],
        },
        {
          name: 'after',
          type: 'group',
          label: 'After',
          admin: { width: '50%' },
          fields: [
            ...imageOrVideo({ required: true }),
            { name: 'label', type: 'text', defaultValue: 'After', admin: { description: 'Shown on its side.' } },
          ],
        },
      ],
    },
    {
      name: 'mode',
      type: 'select',
      label: 'Comparison',
      defaultValue: 'slider',
      options: [
        { label: 'Slider (drag the divider)', value: 'slider' },
        { label: 'Toggle (switch between them)', value: 'toggle' },
      ],
      admin: { description: 'Use the same size for both. A toggle suits clips, where a split view is hard to follow.' },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Optional. Shown under the comparison.' },
    },
  ],
}
