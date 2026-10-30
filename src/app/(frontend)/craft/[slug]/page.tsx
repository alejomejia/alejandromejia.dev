import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'

import { JsonLd } from '@/components/seo/json-ld'
import { StoryContent } from '@/components/story'
import { CodeGroup } from '@/components/story/code-group'
import { TextLink } from '@/components/ui/text-link'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { breadcrumbJsonLd } from '@/lib/seo/json-ld'
import { buildMetadata, generatedShareImage } from '@/lib/seo/metadata'
import { craftCard } from '@/lib/seo/og/og-cards'
import { craftPath } from '@/lib/seo/seo.utils'
import { enter, formatDate, formatMonth } from '@/lib/utils'

import { BackLink } from '@/app/(frontend)/_components/back-link'
import { OnwardLink } from '@/app/(frontend)/_components/onward-link'
import { type PageFact, PageFacts } from '@/app/(frontend)/_components/page-facts'
import { findCraft, nextCraft } from '@/app/(frontend)/craft/_components/craft.mock'
import type { CraftEntry } from '@/app/(frontend)/craft/_components/craft.types'
import { CraftDemo } from '@/app/(frontend)/craft/_components/craft-demo'
import { snippetLanguages } from '@/app/(frontend)/craft/_components/craft.utils'

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
  const entry = findCraft(slug)
  if (!entry) return {}
  const path = craftPath(entry.slug)
  return buildMetadata({
    title: entry.title,
    description: entry.description,
    path,
    image: generatedShareImage(path, craftCard(entry)),
  })
}

/** A snippet's languages, or the month an experiment was published: the next link's meta. */
function onwardMeta(entry: CraftEntry): string {
  if (entry.kind === 'experiment') return formatMonth(entry.publishedAt)
  return snippetLanguages(entry)
}

/**
 * A Craft entry. An experiment: the title and description, the live demo,
 * its key code, then notes on how it's built. A snippet: the title and its
 * why, the code (one or more files, with a copy button), then any notes.
 * Both end on the next entry of their kind. Reads the mock until the design
 * is signed off.
 */
export default async function CraftEntryPage({ params }: Args) {
  const { slug } = await params
  const entry = findCraft(slug)
  if (!entry) notFound()
  const copy = COPY.craft
  const next = nextCraft(entry)

  const facts: PageFact[] = [
    { label: copy.published, value: <time dateTime={entry.publishedAt}>{formatDate(entry.publishedAt)}</time> },
    { label: copy.topics, value: entry.topics.join(', ') },
    {
      label: copy.source,
      value: entry.kind === 'snippet' && entry.sourceUrl && (
        <TextLink href={entry.sourceUrl} newTab variant="underline" icon={<ArrowUpRight strokeWidth={1.5} />}>
          {new URL(entry.sourceUrl).hostname}
        </TextLink>
      ),
    },
  ]

  return (
    <article className="flex flex-col gap-pad-2xl">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: copy.title, path: SITE_ROUTES.craft },
          { name: entry.title, path: craftPath(entry.slug) },
        ])}
      />

      <header className="flex flex-col gap-pad-l">
        <div className="flex flex-col gap-pad-xs">
          <BackLink href={SITE_ROUTES.craft}>{copy.back}</BackLink>
          <h1 {...enter(1, 'text-display-m font-medium tracking-tight text-balance')}>{entry.title}</h1>
          <p {...enter(2, 'text-lead text-pretty text-foreground/60')}>{entry.description}</p>
        </div>
        <div {...enter(3)}>
          <PageFacts facts={facts} />
        </div>
      </header>

      {entry.kind === 'experiment' && (
        <section aria-label={copy.demo} {...enter(4)}>
          <CraftDemo entry={entry} />
        </section>
      )}

      {entry.files && entry.files.length > 0 && (
        <div {...enter(entry.kind === 'experiment' ? 5 : 4)}>
          <CodeGroup files={entry.files} labels={COPY.code} />
        </div>
      )}

      {entry.content && <StoryContent nodes={entry.content} />}

      {next.slug !== entry.slug && (
        <OnwardLink
          label={entry.kind === 'experiment' ? copy.nextExperiment : copy.nextSnippet}
          href={craftPath(next.slug)}
          title={next.title}
          summary={next.description}
          meta={onwardMeta(next)}
        />
      )}
    </article>
  )
}
