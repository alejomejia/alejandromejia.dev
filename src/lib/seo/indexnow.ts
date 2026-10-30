// Server code, but deliberately not `.server.ts`/`server-only`: a Payload hook
// imports it, so the Payload CLI loads it outside Next, where that guard throws.
import { getServerSideURL } from '@/lib/utils'

import { absoluteURL, isIndexable } from './seo.utils'

// Served by src/app/indexnow-key.txt/route.ts; IndexNow fetches it to verify ownership.
const INDEXNOW_KEY_PATH = '/indexnow-key.txt'

/**
 * Tells IndexNow engines (Bing, Yandex, Seznam, Naver…) that URLs changed, so
 * they recrawl within minutes instead of days. Bing's index backs ChatGPT
 * Search and Copilot, so this directly speeds up AI-search freshness.
 * No-op unless `INDEXNOW_KEY` is set and the site is indexable and public.
 */
export async function submitToIndexNow(paths: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY
  const { host } = new URL(getServerSideURL())
  if (!key || !isIndexable() || host.startsWith('localhost') || paths.length === 0) return

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key,
      keyLocation: absoluteURL(INDEXNOW_KEY_PATH),
      urlList: paths.map(absoluteURL),
    }),
  })

  // 200/202 = accepted; anything else is a config problem worth surfacing.
  if (!response.ok) throw new Error(`IndexNow responded ${response.status}`)
}
