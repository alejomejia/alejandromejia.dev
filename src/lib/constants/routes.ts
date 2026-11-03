/**
 * Site routes that code links to directly (the menu's Home and CV, the
 * footer, the command menu, the home page's "All …" links). Collection routes come from `documentPath()` in
 * `@/lib/seo/seo.utils`; the header's main links come from the Header global.
 */
export const SITE_ROUTES = {
  home: '/',
  work: '/work',
  writing: '/writing',
  craft: '/craft',
  cv: '/cv',
  howItsBuilt: '/how-its-built',
  rss: '/rss.xml',
} as const
