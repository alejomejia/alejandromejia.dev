import { COPY } from '@/lib/constants/copy'
import type { SiteSettings } from '@/lib/cms/site-settings-provider'
import type { Media, Profile, Writing } from '@/payload-types'

import { SITE } from './seo.const'
import { absoluteURL, writingPath } from './seo.utils'

/** A schema.org node. Kept loose on purpose; schema.org is too wide to type. */
export type JsonLdNode = Record<string, unknown>

// Stable `@id`s let pages reference the site-wide nodes instead of repeating them.
const personId = () => absoluteURL('/#person')
const websiteId = () => absoluteURL('/#website')

/**
 * The site's owner as an author or subject. Carries the name and URL next to
 * the `@id`, so a node that search engines read on its own (an article's
 * author) still validates without the site-wide graph.
 */
function personRef(): JsonLdNode {
  return { '@type': 'Person', '@id': personId(), name: SITE.name, url: absoluteURL('/') }
}

/**
 * Site-wide `Person` + `WebSite` graph, rendered once in the root layout. The
 * site is Alejandro's, so the `Person` is its publisher and the subject of
 * every page. The Profile global supplies the headline, languages and
 * skills; Site settings supply the public profiles (`sameAs`).
 */
export function siteJsonLd({ socialLinks }: SiteSettings, profile: Profile): JsonLdNode {
  const sameAs = socialLinks.map(({ href }) => href).filter((href) => /^https?:\/\//.test(href))
  const description = COPY.site.description
  // The target roles first, then every Profile skill, without repeats.
  const knowsAbout = [...new Set([...SITE.roles, ...(profile.skills ?? []).flatMap(({ skills }) => skills)])]
  const languages = (profile.languages ?? []).map(({ language }) => language)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...personRef(),
        name: profile.name || SITE.name,
        alternateName: SITE.alternateName,
        jobTitle: profile.headline,
        description,
        address: { '@type': 'PostalAddress', ...SITE.address },
        knowsAbout,
        ...(languages.length > 0 && { knowsLanguage: languages }),
        ...(sameAs.length > 0 && { sameAs }),
      },
      {
        '@type': 'WebSite',
        '@id': websiteId(),
        name: SITE.name,
        description,
        url: absoluteURL('/'),
        inLanguage: SITE.lang,
        publisher: { '@id': personId() },
        author: { '@id': personId() },
        copyrightHolder: { '@id': personId() },
      },
    ],
  }
}

/**
 * `WebPage` for the home page, about the site's owner. The home page is built
 * in code, from the Profile.
 */
export function homePageJsonLd({ name, description }: { name: string; description: string }): JsonLdNode {
  const url = absoluteURL('/')

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name,
    description,
    isPartOf: { '@id': websiteId() },
    about: { '@id': personId() },
    inLanguage: SITE.lang,
  }
}

/**
 * `BreadcrumbList` from ordered `[name, path]` crumbs (Home is prepended).
 */
export function breadcrumbJsonLd(crumbs: Array<{ name: string; path: string }>): JsonLdNode {
  const items = [{ name: COPY.breadcrumb.home, path: '/' }, ...crumbs]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteURL(crumb.path),
    })),
  }
}

/** `BlogPosting` for a Writing entry, enabling article rich results. */
export function writingJsonLd(entry: Writing): JsonLdNode {
  const url = absoluteURL(writingPath(entry.slug ?? ''))
  const image = [entry.meta?.image, entry.cover].find(
    (media): media is Media => typeof media === 'object' && media !== null && Boolean(media.url),
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: entry.meta?.title || entry.title,
    description: entry.meta?.description || entry.excerpt || undefined,
    url,
    mainEntityOfPage: url,
    image: image ? absoluteURL(image.sizes?.og?.url || image.url!) : absoluteURL(SITE.ogImage.url),
    datePublished: entry.publishedAt || entry.createdAt,
    dateModified: entry.updatedAt,
    // One author site: everything is written by the site's owner.
    author: personRef(),
    publisher: { '@id': personId() },
    isPartOf: { '@id': websiteId() },
    // Topic signals: topics become the article's section(s).
    articleSection: (entry.topics ?? []).flatMap((topic) =>
      typeof topic === 'object' && topic.title ? [topic.title] : [],
    ),
    inLanguage: SITE.lang,
  }
}

type CollectionPageArgs = {
  name: string
  description?: string
  /** Site-relative path of the collection. */
  path: string
  /** The listed items, in page order; paths are unprefixed like `path`. */
  items: Array<{ name: string; path: string; image?: string }>
}

/**
 * `CollectionPage` for a listing (the writing archive, a topic page), with
 * its items as an `ItemList`, so search engines and AI readers see what the
 * page lists.
 */
export function collectionPageJsonLd({ name, description, path, items }: CollectionPageArgs): JsonLdNode {
  const url = absoluteURL(path)

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name,
    description,
    isPartOf: { '@id': websiteId() },
    about: { '@id': personId() },
    inLanguage: SITE.lang,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteURL(item.path),
        image: item.image,
      })),
    },
  }
}
