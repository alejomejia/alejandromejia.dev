/**
 * Alejandro's identity as every SEO surface uses it: <head> metadata, Open
 * Graph / Twitter cards, the `Person` JSON-LD, the web manifest, sitemap,
 * robots and llms.txt. The Profile global supplies the rest of the person
 * (headline, languages, skills). Per-document titles, descriptions and share
 * images come from the CMS (each document's SEO tab); these values are the
 * site-wide defaults.
 */
export const SITE = {
  name: 'Alejandro Mejía',
  /** Short name for the installed-app label (manifest `short_name`). */
  shortName: 'Alejandro Mejía',
  description:
    'Senior Design Engineer in Navarra, Spain. I build design systems and the interfaces that use them: components, motion, accessibility and performance.',
  /**
   * The site's language as a BCP 47 tag (`<html lang>`, manifest, JSON-LD);
   * `locale` is its Open Graph form.
   */
  lang: 'en',
  locale: 'en_US',
  /** Browser UI color (address bar, manifest). Match `--background`. */
  themeColor: '#0f0f0f',
  /** Fallback share image in `public/` (1200×630). */
  ogImage: { url: '/og-image.png', width: 1200, height: 630 },
  /** The name without diacritics, as people often type it (`Person.alternateName`). */
  alternateName: 'Alejandro Mejia',
  /** Region and country only, never a street (`Person.address`). */
  address: { addressRegion: 'Navarra', addressCountry: 'ES' },
  /**
   * The roles the site wants to be found for, listed first in
   * `Person.knowsAbout` ahead of the Profile's skills.
   */
  roles: ['Design engineering', 'UX engineering', 'Frontend development'],
  /** The site's public source code, linked from the footer and the ⌘K menu. */
  repository: 'https://github.com/alejomejia/alejandromejia.dev',
  /** X/Twitter handle including `@`, or `undefined` to omit. */
  twitterHandle: undefined as string | undefined,
  /**
   * Hand-written context for `/llms.txt`, shown above the auto-generated
   * content index. A factual paragraph about Alejandro: role, years,
   * specialties, location and time zone, work mode, availability and how to
   * get in touch.
   */
  llmsDetails: '',
  /**
   * AI crawler policy for robots.txt. `search` bots fetch pages to answer and
   * cite them in AI search (ChatGPT, Claude, Perplexity); block them and the
   * site can't be cited. `training` bots collect data for model training;
   * blocking them doesn't affect search visibility.
   */
  aiCrawlers: { search: true, training: true },
} as const

/**
 * The longest title and description that fit the generated share image,
 * three lines each. The collections with share images (Work, Writing, Craft)
 * cap those fields at these lengths; the image clamps anything longer.
 */
export const SHARE_CARD_LIMITS = { title: 60, description: 140 } as const

/** AI answer-engine crawlers that retrieve pages live and link back to them. */
export const AI_SEARCH_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
]

/** Crawlers (or robots.txt tokens) that gather content for model training. */
export const AI_TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Meta-ExternalAgent',
]

/**
 * Cache tag for data that lists every published document (sitemap, llms.txt).
 * The content hooks expire that data through `CMS_CACHE_TAG`, which it also
 * carries; this tag targets the site index alone.
 */
export const SITE_INDEX_TAG = 'site-index'
