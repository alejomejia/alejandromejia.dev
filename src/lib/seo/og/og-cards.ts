import { COPY } from '@/lib/constants/copy'

/** What a generated share image says. */
export type OgCard = {
  /** The mono line above the title: the section and its kind, e.g. "Writing · Article". */
  label: string
  title: string
  /** Up to three lines under the title. */
  description?: string | null
}

/** A Writing article's card: its title and excerpt. */
export function writingCard(doc: {
  title: string
  excerpt?: string | null
  meta?: { description?: string | null } | null
}): OgCard {
  return {
    label: `${COPY.shareCard.writing} · ${COPY.shareCard.article}`,
    title: doc.title,
    // The excerpt is capped to fit the card; the SEO description may run longer.
    description: doc.excerpt || doc.meta?.description,
  }
}

/** A Craft piece's card. */
export function craftCard(doc: { title: string; description: string }): OgCard {
  return {
    label: `${COPY.shareCard.craft} · ${COPY.shareCard.experiment}`,
    title: doc.title,
    description: doc.description,
  }
}

/** A case study's card. */
export function caseStudyCard(work: { title: string; summary: string }): OgCard {
  return { label: `${COPY.shareCard.work} · ${COPY.shareCard.caseStudy}`, title: work.title, description: work.summary }
}

/** A chapter's card: its case study in the label, then the chapter. */
export function chapterCard(work: { title: string }, chapter: { title: string; summary: string }): OgCard {
  return { label: `${COPY.shareCard.work} · ${work.title}`, title: chapter.title, description: chapter.summary }
}

/**
 * A short hash of what the card shows (FNV-1a, base 36). It changes only when
 * the image would, so editing a post's body keeps its image URL while editing
 * its title gives a new one.
 */
export function ogCardVersion({ label, title, description }: OgCard): string {
  let hash = 0x811c9dc5
  for (const char of `${label}\n${title}\n${description ?? ''}`) {
    hash ^= char.codePointAt(0)!
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

/**
 * The image URL of a page's card: `/og/<page path>/<version>.png`. The version
 * is part of the path so social platforms, which cache a preview by its image
 * URL, fetch the new image once the card changes. Visitors never see it: it
 * only appears in the page's `og:image` tag.
 */
export function ogImagePath(path: string, card: OgCard): string {
  return `/og${path}/${ogCardVersion(card)}.png`
}
