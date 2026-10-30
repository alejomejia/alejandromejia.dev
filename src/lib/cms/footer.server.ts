import 'server-only'

import { getCachedGlobal } from './globals.server'
import { cmsNavLink, type NavLink } from './links'
import type { SiteSettings } from './site-settings-provider'
import { querySiteSettings } from './site-settings.server'

/**
 * What the site footer shows: the email and social links from Site settings,
 * the Footer global's links, then the copyright. Empty values are `null` (or
 * empty lists), which hides their row.
 */
export type FooterData = SiteSettings['contact'] & {
  socialLinks: NavLink[]
  /** The Footer global's links, beside the copyright. */
  links: NavLink[]
  copyright: string | null
}

/**
 * Reads the Footer global and Site settings and resolves their links to plain
 * values. Links that can't be resolved are dropped.
 */
export async function queryFooter(): Promise<FooterData> {
  // Depth 1 populates internal references, which carry the slug of their path.
  const [footer, settings] = await Promise.all([getCachedGlobal('footer', 1)(), querySiteSettings()])

  return {
    ...settings.contact,
    socialLinks: settings.socialLinks,
    links: (footer.navItems ?? []).flatMap(({ link }) => cmsNavLink(link) ?? []),
    copyright: footer.copyright?.trim() || null,
  }
}
