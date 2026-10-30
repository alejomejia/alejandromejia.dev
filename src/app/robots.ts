import type { MetadataRoute } from 'next'

import { AI_SEARCH_BOTS, AI_TRAINING_BOTS, SITE } from '@/lib/seo/seo.const'
import { absoluteURL, isIndexable } from '@/lib/seo/seo.utils'

// CMS admin, REST/GraphQL API and the draft-preview route handlers.
const privatePaths = ['/admin', '/api/', '/next/']

type Rule = { userAgent: string | string[]; allow?: string; disallow: string | string[] }

/** Rule group for a set of bots: normal access, or fully blocked. */
function botRule(userAgent: string[], allowed: boolean): Rule {
  return allowed ? { userAgent, allow: '/', disallow: privatePaths } : { userAgent, disallow: '/' }
}

/**
 * `/robots.txt`: blocks everything on non-indexable deployments (staging/previews).
 * AI bots get explicit groups so the policy in `SITE.aiCrawlers` is visible
 * and auditable. A bot that matches a named group ignores the `*` group, so
 * each group repeats the private paths.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: privatePaths },
      botRule(AI_SEARCH_BOTS, SITE.aiCrawlers.search),
      botRule(AI_TRAINING_BOTS, SITE.aiCrawlers.training),
    ],
    sitemap: absoluteURL('/sitemap.xml'),
  }
}
