import type { SiteSettings } from '@/lib/cms/site-settings-provider'
import { getServerSideURL } from '@/lib/utils'

/**
 * Whether search engines may index the site: true in production builds, false
 * under `next dev`, so local work never reaches an index or pings IndexNow.
 * The site runs only locally and in production, with no previews to keep out.
 */
export function isIndexable(): boolean {
  return process.env.NODE_ENV === 'production'
}

/** Resolves a site-relative path (or passes through an absolute URL). */
export function absoluteURL(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return new URL(path, getServerSideURL()).toString()
}

/** Public path for a Writing entry (article, note or snippet). */
export function writingPath(slug: string): string {
  return `/writing/${slug}`
}

/** Public path for a Work case study. */
export function workPath(slug: string): string {
  return `/work/${slug}`
}

/** Public path for a chapter of a case study told over several pages (`/work/<slug>/<chapter>`). */
export function workChapterPath(slug: string, chapter: string): string {
  return `${workPath(slug)}/${chapter}`
}

/** Public path for a Craft experiment. */
export function craftPath(slug: string): string {
  return `/craft/${slug}`
}

/** Collections whose documents have their own public page. */
export type RoutableCollection = 'writing' | 'work' | 'craft'

/** Every routable collection, e.g. for link and redirect pickers. */
export const ROUTABLE_COLLECTIONS: RoutableCollection[] = ['writing', 'work', 'craft']

const COLLECTION_PATHS: Record<RoutableCollection, (slug: string) => string> = {
  writing: writingPath,
  work: workPath,
  craft: craftPath,
}

/** Public path of any routable document, from its collection and slug. */
export function documentPath(collection: RoutableCollection, slug: string): string {
  return COLLECTION_PATHS[collection](slug)
}

/**
 * The llms files' "Contact" section, from Site settings: Alejandro's email
 * and public profiles. `null` when nothing is set.
 */
export function llmsContactSection({ contact, socialLinks }: SiteSettings): string | null {
  const lines = [
    contact.email && `- Email: ${contact.email}`,
    ...socialLinks.map(({ label, href }) => `- ${label}: ${href}`),
  ].filter(Boolean)
  return lines.length > 0 ? `## Contact\n\n${lines.join('\n')}` : null
}
