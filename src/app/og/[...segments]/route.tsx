import { notFound } from 'next/navigation'

import { findChapter, findWork } from '@/app/(frontend)/work/_components/work.mock'
import { findWriting } from '@/app/(frontend)/writing/_components/writing.mock'
import { getShareCard } from '@/lib/cms/share-card.server'
import { caseStudyCard, chapterCard, type OgCard, ogCardVersion, writingCard } from '@/lib/seo/og/og-cards'
import { renderOgImage } from '@/lib/seo/og/og-image.server'

// Rendered once, on the first request for each path, then served from Next's
// cache. The CMS reads it uses carry the `cms` tag, so publishing a change
// (the revalidate hooks) discards the cached image and the next request
// draws it again. Nothing renders at build, so the build never needs the
// database.
export const dynamic = 'force-static'
export const dynamicParams = true

export function generateStaticParams() {
  return []
}

/** Case studies and chapters. Read from the mock data until Work moves to the CMS. */
function workCard(slug: string, chapterSlug?: string): OgCard | null {
  const work = findWork(slug)
  if (!work) return null
  if (!chapterSlug) return caseStudyCard(work)
  const chapter = findChapter(work, chapterSlug)
  return chapter ? chapterCard(work, chapter) : null
}

/** Articles. Read from the mock data until Writing moves to the CMS. */
function articleCard(slug: string): OgCard | null {
  const entry = findWriting(slug)
  return entry ? writingCard(entry) : null
}

async function findCard([section, slug, chapter, ...rest]: string[]): Promise<OgCard | null> {
  if (!slug || rest.length > 0) return null
  if (section === 'work') return workCard(slug, chapter)
  if (chapter) return null
  if (section === 'writing') return articleCard(slug)
  if (section === 'craft') return getShareCard(section, slug)
  return null
}

/**
 * `/og/<page path>/<version>.png` (`ogImagePath()`): the share image of a
 * case study, chapter, writing entry or Craft piece, with its section and
 * title. Only published content has one, and only at its current version, so
 * the URL can't print arbitrary text or fill the cache with stale copies.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ segments: string[] }> }) {
  const segments = (await params).segments.map((segment) => decodeURIComponent(segment))
  const version = segments.pop()?.match(/^([0-9a-z]+)\.png$/)?.[1]
  const card = version ? await findCard(segments) : null
  if (!card || ogCardVersion(card) !== version) notFound()
  return renderOgImage(card)
}
