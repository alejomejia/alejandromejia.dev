import 'server-only'

import { cache } from 'react'


import { getCachedGlobal } from './globals.server'
import { cmsNavLink } from './links'
import type { SiteSettings } from './site-settings-provider'

/** A trimmed string, or `null` when it is empty. */
function text(value: string | null | undefined): string | null {
  return value?.trim() || null
}

/**
 * Reads the Site settings global and resolves it to plain values. Cached across requests under the global's tag,
 * and once per request, so the layout, footer and SEO routes share one read.
 */
export const querySiteSettings = cache(async function querySiteSettings(): Promise<SiteSettings> {
  // Depth 1 populates internal references, which carry the slug of their path.
  const settings = await getCachedGlobal('site-settings', 1)()

  return {
    contact: {
      email: text(settings.email),
    },
    socialLinks: (settings.socialLinks ?? []).flatMap(({ link }) => {
      const resolved = cmsNavLink(link)
      return resolved ? { ...resolved, newTab: true } : []
    }),
  }
})
