import 'server-only'

import { getCachedGlobal } from './globals.server'
import { cmsNavLink, type NavLink } from './links'

/** The Header global, resolved for the site header. */
export type HeaderData = {
  navItems: NavLink[]
}

/**
 * Reads the Header global and resolves every link to a
 * plain href, so Client Components receive a few strings instead of the
 * populated documents. Links that can't be resolved are dropped.
 */
export async function queryHeader(): Promise<HeaderData> {
  // Depth 1 populates internal references, which carry the slug of their path.
  const { navItems } = await getCachedGlobal('header', 1)()

  return {
    navItems: (navItems ?? []).flatMap(({ link }) => cmsNavLink(link) ?? []),
  }
}
