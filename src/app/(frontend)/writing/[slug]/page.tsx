import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/json-ld'
import { StoryContent } from '@/components/story'
import { MediaFrame } from '@/components/story/media-frame'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { breadcrumbJsonLd, writingJsonLd } from '@/lib/seo/json-ld'
import { buildMetadata, generatedShareImage } from '@/lib/seo/metadata'
import { ogImagePath, writingCard } from '@/lib/seo/og/og-cards'
import { absoluteURL, writingPath } from '@/lib/seo/seo.utils'
import { enter, formatMonth } from '@/lib/utils'

import { BackLink } from '@/app/(frontend)/_components/back-link'
import { OnwardLink } from '@/app/(frontend)/_components/onward-link'
import { findWriting, nextWriting } from '@/app/(frontend)/writing/_components/writing.mock'
import { WritingContents } from './_components/writing-contents'
import { WritingFacts } from './_components/writing-facts'
import { WritingRelated } from './_components/writing-related'

type Args = {
  params: Promise<{ slug: string }>
}

/**
 * Nothing is prerendered at build, so the Docker build never needs the
 * database (the root layout reads it). Each page renders on its first visit
 * and stays cached.
 */
export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const entry = findWriting(slug)
  if (!entry) return {}
  const path = writingPath(entry.slug)
  return buildMetadata({
    title: entry.title,
    description: entry.excerpt,
    path,
    image: generatedShareImage(path, writingCard(entry)),
    article: {
      publishedTime: entry.publishedAt,
      modifiedTime: entry.updatedAt,
      // The author's profile URL, which `og:article:author` expects.
      authors: [absoluteURL('/')],
    },
  })
}

/**
 * An article: the title, excerpt and facts, the optional cover, the
 * contents when there are enough sections, then the story (text and story
 * blocks), the case studies it draws on, and the next article. Reads the
 * mock until the design is signed off.
 */
export default async function WritingEntryPage({ params }: Args) {
  const { slug } = await params
  const entry = findWriting(slug)
  if (!entry) notFound()
  const copy = COPY.writing
  const path = writingPath(entry.slug)
  const next = nextWriting(entry.slug)

  return (
    <article className="flex flex-col gap-pad-2xl">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: copy.title, path: SITE_ROUTES.writing },
          { name: entry.title, path },
        ])}
      />
      <JsonLd
        data={writingJsonLd({
          path,
          title: entry.title,
          description: entry.excerpt,
          image: ogImagePath(path, writingCard(entry)),
          publishedAt: entry.publishedAt,
          updatedAt: entry.updatedAt,
          topics: entry.topics,
        })}
      />

      <header className="flex flex-col gap-pad-l">
        <div className="flex flex-col gap-pad-xs">
          <BackLink href={SITE_ROUTES.writing}>{copy.back}</BackLink>
          <h1 {...enter(1, 'text-display-m font-medium tracking-tight text-balance')}>{entry.title}</h1>
          <p {...enter(2, 'text-lead text-pretty text-muted')}>{entry.excerpt}</p>
        </div>
        <div {...enter(3)}>
          <WritingFacts entry={entry} copy={copy} />
        </div>
      </header>

      {entry.cover && (
        <div {...enter(4)}>
          <MediaFrame media={entry.cover} />
        </div>
      )}

      <WritingContents nodes={entry.content} label={copy.contents} enterStep={4} />

      <StoryContent nodes={entry.content} />

      <WritingRelated entries={entry.relatedWork} label={copy.relatedWork} />

      {next.slug !== entry.slug && (
        <OnwardLink
          label={copy.next}
          href={writingPath(next.slug)}
          title={next.title}
          summary={next.excerpt}
          meta={formatMonth(next.publishedAt)}
        />
      )}
    </article>
  )
}
