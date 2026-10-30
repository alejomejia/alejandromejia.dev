import type { StoryNode } from '@/components/story'
import type { MediaSource } from '@/lib/cms/media'

/**
 * An article as the Writing pages show it. Mirrors the `writing` collection's
 * fields (relationships as they come back populated), so the mock maps 1:1
 * to Payload later. Entries are listed newest first.
 */
export type WritingEntry = {
  slug: string
  title: string
  /** One or two sentences: under the title, in the list and on the share image. */
  excerpt: string
  /** ISO dates; the updated date shows once it falls on a different day. */
  publishedAt: string
  updatedAt?: string
  /** From the fixed topic list (CONTENT-MODEL.md §9). */
  topics: string[]
  /** Optional; most articles don't need one. */
  cover?: MediaSource
  content: StoryNode[]
  /** Up to three case studies, linked at the end. */
  relatedWork?: WritingRelatedWork[]
}

/** A related case study, with the fields the link shows. */
export type WritingRelatedWork = { slug: string; title: string; summary: string }
