import type { Metadata } from 'next'

import { COPY } from '@/lib/constants/copy'
import { getServerSideURL } from '@/lib/utils'
import type { Media, Writing } from '@/payload-types'

import { ogImagePath, type OgCard, writingCard } from './og/og-cards'
import { SITE } from './seo.const'
import { absoluteURL, isIndexable } from './seo.utils'

type ShareImage = { url: string; width?: number; height?: number; alt?: string }

const defaultImage: ShareImage = { ...SITE.ogImage, alt: SITE.name }

/**
 * The generated share image of a case study, chapter, writing entry or Craft
 * piece: its card (`og/og-cards.ts`) rendered at `app/og/[...segments]`.
 */
export function generatedShareImage(path: string, card: OgCard): ShareImage {
  return { url: ogImagePath(path, card), width: SITE.ogImage.width, height: SITE.ogImage.height, alt: card.title }
}

/**
 * Site-wide metadata for the root layout: title template, defaults for Open
 * Graph / Twitter and robots. Routes override per page with
 * {@link buildMetadata} or {@link generateMeta}.
 */
export function siteMetadata(): Metadata {
  const indexable = isIndexable()
  const description = COPY.site.description

  return {
    // Relative URLs in any route's metadata (canonical, OG images) resolve here.
    metadataBase: new URL(getServerSideURL()),
    title: { default: SITE.name, template: `%s | ${SITE.name}` },
    description,
    applicationName: SITE.name,
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: SITE.locale,
      title: SITE.name,
      description,
      url: '/',
      images: [defaultImage],
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.twitterHandle,
      creator: SITE.twitterHandle,
      title: SITE.name,
      description,
      images: [defaultImage],
    },
    robots: indexable
      ? {
          index: true,
          follow: true,
          // Allow large image previews and full snippets in Google results.
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        }
      : { index: false, follow: false },
  }
}

type BuildMetadataArgs = {
  /**
   * Bare page title; the layout template appends the site name. `{ absolute }`
   * skips the template (the home page). Omit for the site name alone.
   */
  title?: string | { absolute: string }
  description?: string | null
  /** Site-relative path of this route (`/writing`); also its canonical URL. */
  path: string
  image?: ShareImage
  article?: { publishedTime?: string | null; modifiedTime?: string | null; authors?: string[] }
  /** Marks the page as Alejandro's profile (`og:type` `profile`): the home page. */
  profile?: { firstName: string; lastName: string }
}

/**
 * Complete per-route metadata. Next.js replaces (not merges) `openGraph` and
 * `twitter` objects from parent layouts, so this always emits both in full.
 * @example return buildMetadata({ title: 'Writing', path: '/writing' })
 */
export function buildMetadata({ title, description, path, image, article, profile }: BuildMetadataArgs): Metadata {
  const fullTitle = typeof title === 'object' ? title.absolute : title ? `${title} | ${SITE.name}` : SITE.name
  const desc = description || COPY.site.description
  const images = [image ?? defaultImage]

  return {
    title: title ?? { absolute: SITE.name },
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      siteName: SITE.name,
      locale: SITE.locale,
      title: fullTitle,
      description: desc,
      url: path,
      images,
      ...(article
        ? {
            type: 'article',
            publishedTime: article.publishedTime ?? undefined,
            modifiedTime: article.modifiedTime ?? undefined,
            authors: article.authors,
          }
        : profile
          ? { type: 'profile', ...profile }
          : { type: 'website' }),
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.twitterHandle,
      creator: SITE.twitterHandle,
      title: fullTitle,
      description: desc,
      images,
    },
  }
}

/** Share image from an uploaded Media doc, preferring its 1200×630 `og` crop. */
function mediaToShareImage(media?: Media | number | null): ShareImage | undefined {
  if (!media || typeof media !== 'object' || !media.url) return undefined

  const og = media.sizes?.og
  const alt = media.alt ?? undefined
  if (og?.url) return { url: og.url, width: og.width ?? 1200, height: og.height ?? 630, alt }
  return { url: media.url, width: media.width ?? undefined, height: media.height ?? undefined, alt }
}

/**
 * Metadata for a Writing entry from its SEO tab (added by the SEO plugin),
 * falling back to the title, the excerpt, the generated share image and the
 * site defaults.
 */
export function generateMeta({ doc, path }: { doc: Writing | null; path: string }): Metadata {
  if (!doc) return buildMetadata({ path })

  return buildMetadata({
    path,
    title: doc.meta?.title || doc.title,
    description: doc.meta?.description || doc.excerpt || undefined,
    image: mediaToShareImage(doc.meta?.image) ?? generatedShareImage(path, writingCard(doc)),
    article: {
      publishedTime: doc.publishedAt,
      modifiedTime: doc.updatedAt,
      // The author's profile URL, which `og:article:author` expects.
      authors: [absoluteURL('/')],
    },
  })
}
