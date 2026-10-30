import type { GlobalConfig } from 'payload'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { link, linkRowLabel } from '@/payload/fields/link'
import { buildGlobalRevalidateHook } from '@/payload/hooks/revalidate-global'

/**
 * Settings the whole site reuses: the contact email (footer, ⌘K menu,
 * llms.txt) and the public profiles (footer, structured data). The frontend
 * layout reads it once per request and hands it down (`useSiteSettings()` in
 * Client Components, `querySiteSettings()` on the server). Empty fields hide
 * what reads them. Add site-wide settings here rather than in a new global.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: {
    read: () => true,
  },
  admin: {
    group: ADMIN_GROUPS.site,
    description: 'Details the whole site reuses: your email and public profiles.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          description: 'How to reach you. Shown in the footer and the ⌘K menu.',
          fields: [
            {
              name: 'email',
              type: 'email',
              label: 'Email',
            },
          ],
        },
        {
          label: 'Social',
          description: 'Your public profiles (LinkedIn, GitHub…), in the footer. Search engines also read them as your profiles.',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social links',
              labels: { singular: 'Social link', plural: 'Social links' },
              maxRows: 6,
              admin: {
                description: 'Open in a new tab.',
                initCollapsed: true,
                components: { RowLabel: linkRowLabel('Social link') },
              },
              fields: [link({ defaults: { type: 'custom' } })],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [buildGlobalRevalidateHook('site-settings')],
  },
}
