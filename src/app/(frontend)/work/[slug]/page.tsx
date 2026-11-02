import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/json-ld'
import { StoryContent } from '@/components/story'
import { Metrics } from '@/components/story/metrics'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { breadcrumbJsonLd } from '@/lib/seo/json-ld'
import { buildMetadata, generatedShareImage } from '@/lib/seo/metadata'
import { caseStudyCard } from '@/lib/seo/og/og-cards'
import { workPath } from '@/lib/seo/seo.utils'
import { enter } from '@/lib/utils'

import { BackLink } from '@/app/(frontend)/_components/back-link'
import { findWork } from '@/app/(frontend)/work/_components/work.mock'
import { WorkCover } from '@/app/(frontend)/work/_components/work-cover'
import { WorkChapters } from './_components/work-chapters'
import { WorkClosing } from './_components/work-closing'
import { WorkFacts } from './_components/work-facts'
import { WorkNext } from './_components/work-next'

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
  const work = findWork(slug)
  if (!work) return {}
  const path = workPath(work.slug)
  return buildMetadata({
    title: work.title,
    description: work.summary,
    path,
    image: generatedShareImage(path, caseStudyCard(work)),
  })
}

/**
 * A case study: the title, summary, facts and outcomes, the cover, then the
 * story (text and story blocks), what I'd do differently, a recommendation,
 * and the next case study. A long one is told in chapters
 * (`[chapter]/page.tsx`): this page is then its overview, with the chapter
 * menu under the header, and ends on a link to the first chapter, which
 * carries the closing sections at the end. Reads the mock until the design
 * is signed off.
 */
export default async function WorkEntryPage({ params }: Args) {
  const { slug } = await params
  const work = findWork(slug)
  if (!work) notFound()
  const copy = COPY.work

  return (
    <article className="flex flex-col gap-pad-2xl">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: copy.title, path: SITE_ROUTES.work },
          { name: work.title, path: workPath(work.slug) },
        ])}
      />

      <header className="flex flex-col gap-pad-l">
        <div className="flex flex-col gap-pad-xs">
          <BackLink href={SITE_ROUTES.work}>{copy.back}</BackLink>
          <h1 {...enter(1, 'text-display-m font-medium tracking-tight text-balance')}>{work.title}</h1>
          <p {...enter(2, 'text-lead text-pretty text-muted')}>{work.summary}</p>
        </div>
        <div {...enter(3)}>
          <WorkFacts work={work} copy={copy} />
        </div>
        {work.metrics && work.metrics.length > 0 && (
          <div {...enter(4)}>
            <Metrics items={work.metrics} />
          </div>
        )}
      </header>

      <div {...enter(5)}>
        <WorkChapters work={work} current={null} copy={copy} />
      </div>

      <figure {...enter(6, 'flex flex-col gap-pad-xs')}>
        <WorkCover cover={work.cover} />
        {work.confidential && <figcaption className="font-mono text-micro text-subtle">{copy.confidential}</figcaption>}
      </figure>

      {work.content ? (
        <StoryContent nodes={work.content} />
      ) : (
        <p className="text-caption text-muted">{copy.inProgress}</p>
      )}

      {!work.chapters?.length && <WorkClosing work={work} copy={copy} />}

      <WorkNext work={work} current={null} copy={copy} />
    </article>
  )
}
