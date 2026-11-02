import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/json-ld'
import { PageHeader } from '@/components/ui/page-header'
import { TextLink } from '@/components/ui/text-link'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo/json-ld'
import { buildMetadata } from '@/lib/seo/metadata'
import { craftPath } from '@/lib/seo/seo.utils'
import { enter } from '@/lib/utils'

import { CRAFT_LAST_ENTER_STEP } from './_components/craft.const'
import { CRAFT, craftExperiments, craftSnippets } from './_components/craft.mock'
import { CraftExperiments } from './_components/craft-experiments'
import { CraftSnippets } from './_components/craft-snippets'

export const metadata: Metadata = buildMetadata({
  title: COPY.craft.title,
  description: COPY.craft.description,
  path: SITE_ROUTES.craft,
})

// Rendered per request: a build-time copy would need the database during the
// Docker build (the root layout reads it). Cheap: the data comes from the CMS
// cache, not a query per hit.
export const dynamic = 'force-dynamic'

/**
 * Craft: the experiments as tiles, then the snippets as rows, each opening
 * its own page. Ends on Writing, for the longer pieces. Reads the mock until
 * the design is signed off, then the `craft` collection.
 */
export default async function CraftPage() {
  const copy = COPY.craft
  const experiments = craftExperiments()
  const snippets = craftSnippets()

  return (
    <div className="flex flex-col gap-pad-2xl">
      <JsonLd data={breadcrumbJsonLd([{ name: copy.title, path: SITE_ROUTES.craft }])} />
      <JsonLd
        data={collectionPageJsonLd({
          name: copy.title,
          description: copy.description,
          path: SITE_ROUTES.craft,
          items: [...experiments, ...snippets].map((entry) => ({ name: entry.title, path: craftPath(entry.slug) })),
        })}
      />

      <PageHeader title={copy.title} description={copy.description} />

      {CRAFT.length === 0 && <p {...enter(2, 'text-caption text-muted')}>{copy.empty}</p>}
      <CraftExperiments entries={experiments} label={copy.experiments} enterFrom={2} />
      <CraftSnippets entries={snippets} label={copy.snippets} enterFrom={2 + experiments.length} />

      <p {...enter(CRAFT_LAST_ENTER_STEP, 'text-caption text-muted')}>
        {copy.closing}{' '}
        <TextLink href={SITE_ROUTES.writing} variant="underline">
          {copy.writing}
        </TextLink>
        .
      </p>
    </div>
  )
}
