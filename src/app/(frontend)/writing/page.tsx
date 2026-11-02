import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/json-ld'
import { PageHeader } from '@/components/ui/page-header'
import { TextLink } from '@/components/ui/text-link'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo/json-ld'
import { buildMetadata } from '@/lib/seo/metadata'
import { writingPath } from '@/lib/seo/seo.utils'
import { enter } from '@/lib/utils'

import { WRITING_LAST_ENTER_STEP } from './_components/writing.const'
import { WRITING } from './_components/writing.mock'
import { WritingList } from './_components/writing-list'

export const metadata: Metadata = buildMetadata({
  title: COPY.writing.title,
  description: COPY.writing.description,
  path: SITE_ROUTES.writing,
})

// Rendered per request: a build-time copy would need the database during the
// Docker build (the root layout reads it). Cheap: the data comes from the CMS
// cache, not a query per hit.
export const dynamic = 'force-dynamic'

/**
 * Writing: every article on one page, newest first, grouped by year. Ends
 * on Craft, where the snippets and experiments live. Reads the mock until
 * the design is signed off, then the `writing` collection.
 */
export default async function WritingPage() {
  const copy = COPY.writing

  return (
    <div className="flex flex-col gap-pad-2xl">
      <JsonLd data={breadcrumbJsonLd([{ name: copy.title, path: SITE_ROUTES.writing }])} />
      <JsonLd
        data={collectionPageJsonLd({
          name: copy.title,
          description: copy.description,
          path: SITE_ROUTES.writing,
          items: WRITING.map((entry) => ({ name: entry.title, path: writingPath(entry.slug) })),
        })}
      />

      <PageHeader title={copy.title} description={copy.description} />

      {WRITING.length > 0 ? (
        <WritingList entries={WRITING} enterFrom={2} />
      ) : (
        <p {...enter(2, 'text-caption text-muted')}>{copy.empty}</p>
      )}

      <p {...enter(WRITING_LAST_ENTER_STEP, 'text-caption text-muted')}>
        {copy.closing}{' '}
        <TextLink href={SITE_ROUTES.craft} variant="underline">
          {copy.craft}
        </TextLink>
        .
      </p>
    </div>
  )
}
