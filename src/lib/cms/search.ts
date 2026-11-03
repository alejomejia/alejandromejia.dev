/** Where the command menu loads its content search from (`app/search.json/route.ts`). */
export const SEARCH_INDEX_PATH = '/search.json'

/** One published page the command menu can search for, beyond its own rows. */
export type SearchEntry = {
  group: 'pages' | 'work' | 'writing' | 'craft'
  title: string
  path: string
  /** Muted text after the title: a chapter's case study, a Craft piece's kind. */
  detail?: string
}
