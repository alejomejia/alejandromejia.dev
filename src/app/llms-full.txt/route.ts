import { querySiteSettings } from '@/lib/cms/site-settings.server'
import { SITE } from '@/lib/seo/seo.const'
import { getSiteContent, type SiteContentEntry } from '@/lib/seo/site-index.server'
import { absoluteURL, llmsContactSection } from '@/lib/seo/seo.utils'

// Same caching model as /llms.txt: per request, data cached under the `site-index` tag.
export const dynamic = 'force-dynamic'

function documentSection(entry: SiteContentEntry): string {
  return [
    `## ${entry.title}`,
    `Source: ${absoluteURL(entry.path)}`,
    `Last updated: ${entry.updatedAt.slice(0, 10)}`,
    entry.description && `> ${entry.description}`,
    entry.markdown,
  ]
    .filter(Boolean)
    .join('\n\n')
}

/**
 * `/llms-full.txt`: the full text of every published Writing entry as one
 * Markdown document, so an LLM can read the whole site in a single fetch
 * instead of crawling and parsing HTML.
 */
export async function GET() {
  const [{ writing }, settings] = await Promise.all([getSiteContent(), querySiteSettings()])

  const body = [
    `# ${SITE.name}`,
    `> ${SITE.description}`,
    SITE.llmsDetails,
    llmsContactSection(settings),
    ...writing.map(documentSection),
  ]
    .filter(Boolean)
    .join('\n\n---\n\n')

  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
