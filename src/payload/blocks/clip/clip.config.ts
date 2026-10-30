import type { Block } from 'payload'

import { imageOrVideo } from '@/payload/fields/media'

/**
 * One image or muted looping clip inside an article or case study, optionally
 * in minimal browser chrome, with a caption. The main way to show private
 * work: a 10–20s recording instead of a link.
 */
export const Clip: Block = {
  slug: 'clip',
  interfaceName: 'ClipBlock',
  labels: { singular: 'Image or clip', plural: 'Images and clips' },
  fields: [
    ...imageOrVideo({
      required: true,
      cover: true,
      description: 'Videos play muted and looped, only while on screen. Keep clips to 10–20 seconds.',
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'frame',
          type: 'select',
          label: 'Frame',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Browser window', value: 'browser' },
          ],
          admin: { width: '50%', description: 'Browser window: three dots and a hairline above the media.' },
        },
        {
          name: 'private',
          type: 'checkbox',
          defaultValue: false,
          label: 'Private project',
          admin: {
            width: '50%',
            style: { alignSelf: 'flex-end' },
            description: 'Adds "Private project, shown as a recording" under the media.',
          },
        },
      ],
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Optional. Shown under the media.' },
    },
  ],
}
