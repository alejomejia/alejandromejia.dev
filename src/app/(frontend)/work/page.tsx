import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/json-ld'
import { PageHeader } from '@/components/ui/page-header'
import { TextLink } from '@/components/ui/text-link'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo/json-ld'
import { buildMetadata } from '@/lib/seo/metadata'
import { workPath } from '@/lib/seo/seo.utils'
import { enter } from '@/lib/utils'

import { WORK } from './_components/work.mock'
import { WorkFeatured } from './_components/work-featured'
import { WorkList } from './_components/work-list'

export const metadata: Metadata = buildMetadata({
  title: COPY.work.title,
  description: COPY.work.description,
  path: SITE_ROUTES.work,
})

// Rendered per request: a build-time copy would need the database during the
// Docker build (the root layout reads it). Cheap: the data comes from the CMS
// cache, not a query per hit.
export const dynamic = 'force-dynamic'

/**
 * Work: every case study. The featured ones open the page large, with their
 * cover; the rest follow as rows, and the CV covers the older roles. Reads
 * the mock until the design is signed off, then the `work` collection.
 */
export default async function WorkPage() {
  const copy = COPY.work
  const featured = WORK.filter((work) => work.featured)
  const more = WORK.filter((work) => !work.featured)

  return (
    <div className="flex flex-col gap-pad-2xl">
      <JsonLd data={breadcrumbJsonLd([{ name: copy.title, path: SITE_ROUTES.work }])} />
      <JsonLd
        data={collectionPageJsonLd({
          name: copy.title,
          description: copy.description,
          path: SITE_ROUTES.work,
          items: WORK.map((work) => ({ name: work.title, path: workPath(work.slug) })),
        })}
      />

      <PageHeader title={copy.title} description={copy.description} />
      <WorkFeatured entries={featured} label={copy.selected} enterFrom={2} />
      <WorkList entries={more} label={copy.more} enterFrom={2 + featured.length} />

      <p {...enter(2 + WORK.length, 'text-caption text-foreground/60')}>
        {copy.closing} <TextLink href={SITE_ROUTES.cv}>{copy.cv}</TextLink>.
      </p>
    </div>
  )
}
