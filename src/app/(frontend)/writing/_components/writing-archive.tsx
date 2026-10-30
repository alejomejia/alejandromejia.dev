import { notFound } from 'next/navigation'

import { WritingCard } from './writing-card'
import { JsonLd } from '@/components/seo/json-ld'
import { Pagination } from '@/components/ui/pagination'
import { queryPublishedWriting } from '@/lib/cms/writing.server'
import { COPY } from '@/lib/constants/copy'
import { collectionPageJsonLd } from '@/lib/seo/json-ld'
import { writingPath } from '@/lib/seo/seo.utils'
import type { Writing } from '@/payload-types'

/**
 * Renders a paginated grid of published Writing entries, published as a
 * `CollectionPage` that lists them. Shared by the archive routes.
 */
export async function WritingArchive({ page = 1 }: { page?: number }) {
  const result = await queryPublishedWriting({ page })

  // Requesting a page past the end (other than the empty first page) is a 404.
  if (result.docs.length === 0 && page > 1) notFound()

  const items = result.docs.flatMap((entry) => (entry.slug ? { name: entry.title, path: writingPath(entry.slug) } : []))

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <JsonLd
        data={collectionPageJsonLd({ name: COPY.writing.title, path: page > 1 ? `/writing/page/${page}` : '/writing', items })}
      />
      <h1 className="mb-10 text-3xl font-semibold tracking-tight">{COPY.writing.title}</h1>

      {result.docs.length === 0 ? (
        <p className="text-foreground/60">{COPY.writing.empty}</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {result.docs.map((entry) => (
            <WritingCard key={entry.id} entry={entry as Writing} />
          ))}
        </div>
      )}

      <Pagination page={result.page ?? page} totalPages={result.totalPages} labels={COPY.pagination} />
    </section>
  )
}
