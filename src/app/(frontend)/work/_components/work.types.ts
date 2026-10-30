import type { StoryNode } from '@/components/story'
import type { MediaSource } from '@/lib/cms/media'

/**
 * A case study as the Work pages show it. Mirrors the `work` collection's
 * fields, so the mock maps 1:1 to Payload later. Entries are listed in
 * array order.
 */
export type WorkEntry = {
  slug: string
  title: string
  summary: string
  role: string
  /** Who it was for; absent on my own projects. */
  client?: string
  /** ISO dates; no end date means ongoing. */
  startDate: string
  endDate?: string
  /** Who I worked with, e.g. "Two designers, four engineers". */
  team?: string
  stack: string[]
  /** Up to four numbers that sum up the result, shown in the header. */
  metrics?: Array<{ value: string; label: string }>
  /** Featured entries open the list with their cover. */
  featured?: boolean
  liveUrl?: string
  /** A still or a muted loop; until there is one, the frame shows a dot texture. */
  cover?: MediaSource
  /** Hides the client's name and adds "Private project, shown with permission." */
  confidential?: boolean
  /**
   * The story; until it is written, the page says the write-up is on its way.
   * With chapters, this is the overview, the case study's first page.
   */
  content?: StoryNode[]
  /**
   * Optional. A long case study told over several pages, one per topic, at
   * `/work/<slug>/<chapter>`, in this order after the overview. Small case
   * studies leave it empty and stay on one page.
   */
  chapters?: WorkChapter[]
  /** "What I'd do differently": a short, honest closing paragraph. */
  retrospective?: string
  /** The id of one recommendation from someone on the project (see `RECOMMENDATIONS`), shown at the end. */
  recommendation?: string
}

/** One page of a long case study. */
export type WorkChapter = {
  /** The chapter's URL segment, unique within its case study. */
  slug: string
  title: string
  /** One sentence under the title and in the chapter list's next link. */
  summary: string
  content: StoryNode[]
}
