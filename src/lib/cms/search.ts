/** Where the command menu loads its content search from (`app/search.json/route.ts`). */
export const SEARCH_INDEX_PATH = '/search.json'

/** One published page the command menu can search for, beyond its own rows. */
export type SearchEntry = {
  group: 'pages' | 'work' | 'writing'
  title: string
  path: string
  /** Muted text after the title: a writing format, a chapter's case study. */
  detail?: string
}
