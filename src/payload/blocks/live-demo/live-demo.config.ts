import type { Block } from 'payload'

import { CRAFT_DEMO_OPTIONS } from '@/lib/constants/craft-demos'

/** One of the Craft demos, running inline in the text. */
export const LiveDemo: Block = {
  slug: 'liveDemo',
  interfaceName: 'LiveDemoBlock',
  labels: { singular: 'Live demo', plural: 'Live demos' },
  fields: [
    {
      name: 'demo',
      type: 'select',
      label: 'Demo',
      required: true,
      options: CRAFT_DEMO_OPTIONS,
      admin: { description: 'Demos are built in code; new ones appear here once they ship.' },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Optional. Shown under the demo.' },
    },
  ],
}
