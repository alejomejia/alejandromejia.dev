import { querySiteSettings } from '@/lib/cms/site-settings.server'
import { SITE } from '@/lib/seo/seo.const'
import { getSiteIndex, type SiteIndexEntry } from '@/lib/seo/site-index.server'
import { absoluteURL, llmsContactSection } from '@/lib/seo/seo.utils'

// Rendered per request from the `site-index` cache, which the content hooks
// bust on publish: always matches published CMS content, no script to run,
// and the Docker build never needs the database.
export const dynamic = 'force-dynamic'

function linkList(entries: SiteIndexEntry[]): string {
  return entries
    .map((entry) => {
      const link = `- [${entry.title}](${absoluteURL(entry.path)})`
      return entry.description ? `${link}: ${entry.description}` : link
    })
    .join('\n')
}

/**
 * `/llms.txt` (https://llmstxt.org): a Markdown index of the site for LLMs:
 * the hand-written intro from `SITE.llmsDetails`, the contact details from
 * Site settings, then every published Writing entry with its SEO description.
 */
export async function GET() {
  const [{ writing }, settings] = await Promise.all([getSiteIndex(), querySiteSettings()])

  const sections = [
    `# ${SITE.name}`,
    `> ${SITE.description}`,
    SITE.llmsDetails,
    llmsContactSection(settings),
    writing.length > 0 && `## Writing\n\n${linkList(writing)}`,
    `## Optional\n\n- [Full site content](${absoluteURL('/llms-full.txt')}): every page and article as Markdown in one file`,
  ].filter(Boolean)

  return new Response(`${sections.join('\n\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
