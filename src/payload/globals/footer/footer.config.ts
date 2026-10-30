import type { GlobalConfig } from 'payload'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { link, linkRowLabel } from '@/payload/fields/link'
import { buildGlobalRevalidateHook } from '@/payload/hooks/revalidate-global'

/**
 * Site footer's own content: its links and the copyright line. The email and
 * social profiles come from Site settings.
 */
export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  admin: {
    group: ADMIN_GROUPS.site,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Footer links',
      labels: { singular: 'Footer link', plural: 'Footer links' },
      maxRows: 8,
      admin: {
        description: 'Extra links beside the copyright, e.g. a page hosted elsewhere.',
        initCollapsed: true,
        components: { RowLabel: linkRowLabel('Footer link') },
      },
      fields: [link()],
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright',
      admin: {
        description: 'Shown after "© <current year>" at the bottom, e.g. "Studio Name. All rights reserved."',
      },
    },
  ],
  hooks: {
    afterChange: [buildGlobalRevalidateHook('footer')],
  },
}
