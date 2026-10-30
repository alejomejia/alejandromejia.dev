import 'server-only'

import { UMAMI_SCRIPT_URL } from './umami.const'
import type { UmamiConfig } from './umami.types'

/**
 * Umami's settings, or `null` when tracking is off. Opt-in: on only with
 * `UMAMI_ENABLED=true` and a website id, in a production build (`next dev`
 * never tracks).
 */
export function getUmamiConfig(): UmamiConfig | null {
  if (process.env.UMAMI_ENABLED !== 'true') return null
  if (process.env.NODE_ENV !== 'production') return null

  const websiteId = process.env.UMAMI_WEBSITE_ID?.trim()
  if (!websiteId) return null

  return { websiteId, scriptUrl: UMAMI_SCRIPT_URL, domains: process.env.UMAMI_DOMAINS?.trim() ?? '' }
}
