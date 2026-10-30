import type { Plugin } from 'payload'

/**
 * Admin menu groups, in menu order. Every collection and global sets one
 * (`admin: { group: ADMIN_GROUPS.content }`), plugin collections included.
 */
export const ADMIN_GROUPS = {
  content: 'Content',
  media: 'Media',
  site: 'Site',
  admin: 'Admin',
} as const

const groupOrder: string[] = Object.values(ADMIN_GROUPS)

/** Position of a group in {@link ADMIN_GROUPS}; unknown groups go last. */
function groupRank(group: unknown): number {
  const rank = typeof group === 'string' ? groupOrder.indexOf(group) : -1
  return rank === -1 ? groupOrder.length : rank
}

/**
 * Keeps the admin menu in {@link ADMIN_GROUPS} order. Payload orders groups by
 * where their first collection sits, and plugins append theirs (redirects)
 * after ours, so Admin would otherwise land before Site. Register
 * it after every other plugin.
 */
export const adminNavOrderPlugin: Plugin = function adminNavOrderPlugin(config) {
  return {
    ...config,
    // `sort` is stable, so collections keep their order inside each group.
    collections: [...(config.collections ?? [])].sort(
      (a, b) => groupRank(a.admin?.group) - groupRank(b.admin?.group),
    ),
  }
}
