import type { Metadata } from 'next'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { draftMode } from 'next/headers'

import { Media } from '@/components/cms/media'
import { RichText } from '@/components/cms/rich-text'
import { PayloadRedirects } from '@/components/cms/payload-redirects'
import { LivePreviewListener } from '@/components/cms/live-preview-listener'
import { JsonLd } from '@/components/seo/json-ld'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { breadcrumbJsonLd, writingJsonLd } from '@/lib/seo/json-ld'
import { generateMeta } from '@/lib/seo/metadata'
import { writingPath } from '@/lib/seo/seo.utils'
import { queryWritingBySlug } from '@/lib/cms/writing.server'
import { COPY } from '@/lib/constants/copy'
import { formatDate } from '@/lib/utils'

type Args = {
  params: Promise<{ slug?: string }>
}

/** Rendered on first visit, then cached until publish (see the `[slug]` page). */
export async function generateStaticParams() {
  return []
}

/** A Writing entry. A placeholder layout until Phase 6 designs each format. */
export default async function WritingEntryPage({ params }: Args) {
  const { slug = '' } = await params
  const decodedSlug = decodeURIComponent(slug)
  const url = writingPath(decodedSlug)

  const { isEnabled: draft } = await draftMode()
  const post = await queryWritingBySlug(decodedSlug)

  if (!post) return <PayloadRedirects url={url} />

  const topics = (post.topics ?? [])
    .map((topic) => (typeof topic === 'object' ? topic.title : null))
    .filter(Boolean)
    .join(', ')

  // Only worth showing once it falls on a different day than publication.
  const showUpdated = !post.publishedAt || formatDate(post.updatedAt) !== formatDate(post.publishedAt)

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16">
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <JsonLd data={writingJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: COPY.writing.title, path: '/writing' },
          { name: post.title, path: url },
        ])}
      />

      <header className="mb-8 flex flex-col gap-4">
        <Breadcrumb crumbs={[{ label: COPY.writing.title, href: '/writing' }, { label: post.title }]} className="mb-4" />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/60">
          {topics && <span className="uppercase tracking-wide">{topics}</span>}
          {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
          {/* A visible "updated" date backs up JSON-LD `dateModified`; search and
              AI engines favor content that is demonstrably fresh. */}
          {showUpdated && (
            <span>
              {COPY.writing.updated} <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
            </span>
          )}
        </div>

        <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>

        {post.cover && typeof post.cover === 'object' && (
          <Media
            resource={post.cover}
            className="mt-4 overflow-hidden rounded-xl"
            lcp
            sizes="(max-width: 768px) 100vw, 768px"
          />
        )}
      </header>

      {post.format === 'snippet' && post.code && (
        <pre className="mb-8 overflow-x-auto rounded-xl bg-foreground/5 p-4 font-mono text-caption">
          <code>{post.code}</code>
        </pre>
      )}
      {post.content && <RichText data={post.content as DefaultTypedEditorState} />}
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = '' } = await params
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryWritingBySlug(decodedSlug)
  return generateMeta({ doc: post, path: writingPath(decodedSlug) })
}
