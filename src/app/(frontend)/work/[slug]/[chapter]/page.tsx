import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/json-ld'
import { StoryContent } from '@/components/story'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { breadcrumbJsonLd } from '@/lib/seo/json-ld'
import { buildMetadata, generatedShareImage } from '@/lib/seo/metadata'
import { chapterCard } from '@/lib/seo/og/og-cards'
import { workChapterPath, workPath } from '@/lib/seo/seo.utils'

import { BackLink } from '@/app/(frontend)/_components/back-link'
import { findChapter, findWork } from '@/app/(frontend)/work/_components/work.mock'
import { chapterPages } from '@/app/(frontend)/work/_components/work.utils'
import { WorkChapters } from '@/app/(frontend)/work/[slug]/_components/work-chapters'
import { WorkClosing } from '@/app/(frontend)/work/[slug]/_components/work-closing'
import { WorkNext } from '@/app/(frontend)/work/[slug]/_components/work-next'

type Args = {
  params: Promise<{ slug: string; chapter: string }>
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
  const { slug, chapter: chapterSlug } = await params
  const work = findWork(slug)
  const chapter = work && findChapter(work, chapterSlug)
  if (!work || !chapter) return {}
  const path = workChapterPath(work.slug, chapter.slug)
  return buildMetadata({
    title: `${chapter.title} · ${work.title}`,
    description: chapter.summary,
    path,
    image: generatedShareImage(path, chapterCard(work, chapter)),
  })
}

/**
 * One chapter of a long case study: a link back to its overview, the
 * chapter's number, title and summary, the chapter menu, the story, then
 * the next chapter. The last chapter closes the case study (what I'd do
 * differently, a recommendation) and leads to the next one.
 */
export default async function WorkChapterPage({ params }: Args) {
  const { slug, chapter: chapterSlug } = await params
  const work = findWork(slug)
  const chapter = work && findChapter(work, chapterSlug)
  if (!work || !chapter) notFound()
  const copy = COPY.work

  const pages = chapterPages(work, copy.overview)
  const position = pages.findIndex((page) => page.slug === chapter.slug) + 1
  const isLast = position === pages.length

  return (
    <article className="flex flex-col gap-pad-2xl">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: copy.title, path: SITE_ROUTES.work },
          { name: work.title, path: workPath(work.slug) },
          { name: chapter.title, path: workChapterPath(work.slug, chapter.slug) },
        ])}
      />

      <header className="flex flex-col gap-pad-xs">
        <BackLink href={workPath(work.slug)}>{work.title}</BackLink>
        <h1 className="text-display-m font-medium tracking-tight text-balance">{chapter.title}</h1>
        <p className="text-lead text-pretty text-muted">{chapter.summary}</p>
      </header>

      <WorkChapters work={work} current={chapter.slug} copy={copy} />

      <StoryContent nodes={chapter.content} />

      {isLast && <WorkClosing work={work} copy={copy} />}

      <WorkNext work={work} current={chapter.slug} copy={copy} />
    </article>
  )
}
