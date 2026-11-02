import { COPY } from '@/lib/constants/copy'
import type { SiteSettings } from '@/lib/cms/site-settings-provider'
import type { Profile } from '@/payload-types'

import { SITE } from './seo.const'
import { absoluteURL } from './seo.utils'

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

type WritingJsonLdArgs = {
  /** Site-relative path of the article. */
  path: string
  title: string
  description?: string | null
  /** The share image, site-relative or absolute; the site's default when absent. */
  image?: string | null
  publishedAt: string
  updatedAt?: string | null
  topics: string[]
}

/** `BlogPosting` for a Writing article, enabling article rich results. */
export function writingJsonLd({
  path,
  title,
  description,
  image,
  publishedAt,
  updatedAt,
  topics,
}: WritingJsonLdArgs): JsonLdNode {
  const url = absoluteURL(path)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description || undefined,
    url,
    mainEntityOfPage: url,
    image: absoluteURL(image || SITE.ogImage.url),
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    // One author site: everything is written by the site's owner.
    author: personRef(),
    publisher: { '@id': personId() },
    isPartOf: { '@id': websiteId() },
    // Topic signals: topics become the article's section(s).
    articleSection: topics,
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

type ProfilePageArgs = {
  path: string
  name: string
  description: string
  /** The CV's roles, most recent first; the first open-ended one is the current employer. */
  roles: Array<{ company: string; companyUrl?: string | null; endDate?: string | null }>
  schools: string[]
  languages: string[]
}

/**
 * `ProfilePage` for the CV: about the site's `Person`, extended with what a
 * CV adds (the current employer, past employers, schools), so search engines
 * and AI answers can read the career, not just the name.
 */
export function profilePageJsonLd({ path, name, description, roles, schools, languages }: ProfilePageArgs): JsonLdNode {
  const url = absoluteURL(path)
  const organization = ({ company, companyUrl }: ProfilePageArgs['roles'][number]) => ({
    '@type': 'Organization',
    name: company,
    ...(companyUrl && { url: companyUrl }),
  })
  const current = roles.filter((role) => !role.endDate)
  const past = roles.filter((role) => role.endDate)

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': url,
    url,
    name,
    description,
    isPartOf: { '@id': websiteId() },
    inLanguage: SITE.lang,
    mainEntity: {
      ...personRef(),
      ...(current.length > 0 && { worksFor: current.map(organization) }),
      ...(past.length > 0 && {
        alumniOf: [
          ...past.map(organization),
          ...schools.map((school) => ({ '@type': 'EducationalOrganization', name: school })),
        ],
      }),
      ...(languages.length > 0 && { knowsLanguage: languages }),
    },
  }
}
