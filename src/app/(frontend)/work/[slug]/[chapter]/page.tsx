import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { JsonLd } from '@/components/seo/json-ld'
import { StoryContent } from '@/components/story'
import { Link } from '@/components/ui/link'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { breadcrumbJsonLd } from '@/lib/seo/json-ld'
import { buildMetadata, generatedShareImage } from '@/lib/seo/metadata'
import { chapterCard } from '@/lib/seo/og/og-cards'
import { workChapterPath, workPath } from '@/lib/seo/seo.utils'
import { enter } from '@/lib/utils'

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
        data={breadcrumbJsonLd(
          [
            { name: copy.title, path: SITE_ROUTES.work },
            { name: work.title, path: workPath(work.slug) },
            { name: chapter.title, path: workChapterPath(work.slug, chapter.slug) },
          ],
        )}
      />

      <header className="flex flex-col gap-pad-xs">
        <Link
          href={workPath(work.slug)}
          {...enter(0, 'group flex w-fit items-center gap-1 text-caption text-foreground/40 transition-colors duration-250 hover:text-foreground')}
        >
          <ArrowLeft aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform duration-250 group-hover:-translate-x-0.5" />
          {work.title}
        </Link>
        <h1 {...enter(1, 'text-display-m font-medium tracking-tight text-balance')}>{chapter.title}</h1>
        <p {...enter(2, 'text-lead text-pretty text-foreground/60')}>{chapter.summary}</p>
      </header>

      <div {...enter(3)}>
        <WorkChapters work={work} current={chapter.slug} copy={copy} />
      </div>

      <StoryContent nodes={chapter.content} />

      {isLast && <WorkClosing work={work} copy={copy} />}

      <WorkNext work={work} current={chapter.slug} copy={copy} />
    </article>
  )
}
