import type { GlobalConfig } from 'payload'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { link, linkRowLabel } from '@/payload/fields/link'
import { buildGlobalRevalidateHook } from '@/payload/hooks/revalidate-global'

/** Site header: the logo (in the renderer) and the navigation links. */
export const Header: GlobalConfig = {
  slug: 'header',
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
      label: 'Menu links',
      labels: { singular: 'Menu link', plural: 'Menu links' },
      maxRows: 8,
      admin: {
        description: 'The links in the site header, in order.',
        initCollapsed: true,
        components: { RowLabel: linkRowLabel('Menu link') },
      },
      fields: [link()],
    },
  ],
  hooks: {
    afterChange: [buildGlobalRevalidateHook('header')],
  },
}
