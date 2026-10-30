import type { StoryNode } from '@/components/story'
import type { CodeFile } from '@/components/story/story.types'
import type { MediaSource } from '@/lib/cms/media'

/**
 * The live demos a Craft page can run, each a component in `CRAFT_DEMOS`
 * (`craft-demo.tsx`). These replace the keys in `@/lib/constants/craft-demos`
 * when Craft moves to the CMS (the collection stores them in a select, so
 * that change ships with a migration).
 */
export type CraftDemoKey = 'inspect-mode' | 'halftone-shape' | 'before-after' | 'theme-toggle'

type CraftBase = {
  slug: string
  title: string
  /** One or two sentences: under the title, in the list and on the share image. A snippet's is its one-line why. */
  description: string
  /** ISO date. */
  publishedAt: string
  /** From the fixed topic list (CONTENT-MODEL.md §9). */
  topics: string[]
  /** Optional notes: how it's built and why, under the code. */
  content?: StoryNode[]
}

/** A live interface experiment: the demo, its key code and a short note. */
export type CraftExperiment = CraftBase & {
  kind: 'experiment'
  /** Until a demo is built, the page shows the recording, or the dot texture. */
  demo?: CraftDemoKey
  /** A short recording: the list's tile and the stand-in while a demo is missing. */
  fallback?: MediaSource
  /** The few files that make it work. */
  files?: CodeFile[]
}

/** Copy-paste code, in one or more files, with a one-line why. */
export type CraftSnippet = CraftBase & {
  kind: 'snippet'
  files: CodeFile[]
  /** Where it's used for real, e.g. a GitHub file. */
  sourceUrl?: string
}

/**
 * A Craft entry as the Craft pages show it. Mirrors the `craft` collection
 * (with the snippet fields Writing gives up), so the mock maps 1:1 to
 * Payload later. Entries are listed newest first within each kind.
 */
export type CraftEntry = CraftExperiment | CraftSnippet
