import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/json-ld'
import { PageHeader } from '@/components/ui/page-header'
import { TextLink } from '@/components/ui/text-link'
import { COPY } from '@/lib/constants/copy'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { breadcrumbJsonLd } from '@/lib/seo/json-ld'
import { buildMetadata } from '@/lib/seo/metadata'
import { SITE } from '@/lib/seo/seo.const'

import { HOW_ITS_BUILT } from './_components/how-its-built.mock'
import { HowItsBuiltSection } from './_components/how-its-built-section'

export const metadata: Metadata = buildMetadata({
  title: COPY.howItsBuilt.title,
  description: COPY.howItsBuilt.description,
  path: SITE_ROUTES.howItsBuilt,
})

// Rendered per request: a build-time copy would need the database during the
// Docker build (the root layout reads it).
export const dynamic = 'force-dynamic'

/**
 * How it's built: the stack, the details the site cares about, how it's
 * tested and how AI agents fit in, as labeled rows. The inspect mode row
 * turns it on in place. Ends on the repository.
 */
export default function HowItsBuiltPage() {
  const copy = COPY.howItsBuilt

  return (
    <div className="flex flex-col gap-pad-2xl">
      <JsonLd data={breadcrumbJsonLd([{ name: copy.title, path: SITE_ROUTES.howItsBuilt }])} />

      <PageHeader title={copy.title} description={copy.description} />

      {HOW_ITS_BUILT.map((section) => (
        <HowItsBuiltSection key={section.label} {...section} />
      ))}

      <p className="text-caption text-muted">
        {copy.closing}{' '}
        <TextLink href={SITE.repository} variant="underline">
          {copy.repository}
        </TextLink>
        .
      </p>
    </div>
  )
}
