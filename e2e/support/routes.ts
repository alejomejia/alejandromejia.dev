import type { Page } from '@playwright/test'

/** Sections whose index links to every page in them. */
export const SECTIONS = ['/work', '/writing', '/craft'] as const

/**
 * The site's pages under `prefix`, found by following links from `start`
 * (and one level further), so the suite keeps up as content is added or
 * renamed. Paths only: no query, no hash, no files.
 */
export async function discoverRoutes(page: Page, start: string, prefix = start): Promise<string[]> {
  const linked = await linksUnder(page, start, prefix)
  const found = new Set([start, ...linked])
  for (const path of linked) {
    for (const link of await linksUnder(page, path, prefix)) found.add(link)
  }
  return [...found].sort()
}

async function linksUnder(page: Page, path: string, prefix: string): Promise<string[]> {
  // Lets Next's link prefetches finish before the next visit cancels them.
  await page.goto(path, { waitUntil: 'networkidle' })
  const hrefs = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''))
  return [
    ...new Set(
      hrefs.map((href) => href.split(/[?#]/)[0]).filter((href) => href.startsWith(prefix) && !/\.\w+$/.test(href)),
    ),
  ]
}

/**
 * The first page of each template, told apart by URL shape: `/work`,
 * `/work/:slug` and `/work/:slug/:chapter` are three templates, however many
 * case studies there are.
 */
export function onePerTemplate(routes: string[]): string[] {
  const templates = new Map<string, string>()
  for (const route of routes) {
    const [section, ...params] = route.split('/').filter(Boolean)
    const shape = [section, ...params.map(() => ':param')].join('/')
    if (!templates.has(shape)) templates.set(shape, route)
  }
  return [...templates.values()]
}
