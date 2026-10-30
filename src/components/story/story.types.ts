import type { MediaSource } from '@/lib/cms/media'
import type { CodeLanguage } from '@/lib/constants/code-languages'

/**
 * The body of a case study, article or experiment, as plain data: the
 * rich text's nodes (h2, paragraphs, lists) and the story blocks between
 * them. Each block mirrors its Payload config in `src/payload/blocks/`
 * (same field names), so the Lexical content maps onto these components
 * when the pages move to the CMS.
 */
export type StoryNode =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | ({ type: 'clip' } & ClipProps)
  | ({ type: 'beforeAfter' } & Omit<BeforeAfterProps, 'labels'>)
  | ({ type: 'code' } & CodeBlockProps)
  | ({ type: 'callout' } & CalloutData)
  | ({ type: 'steps' } & StepsProps)
  | ({ type: 'metrics' } & MetricsProps)

export type ClipProps = {
  /** A muted loop (or a still); until there is one, the frame shows a dot texture. */
  media?: MediaSource
  /** `browser` adds minimal browser chrome: three dots and a hairline. */
  frame?: 'none' | 'browser'
  /** Adds the "private project, shown as a recording" label. */
  private?: boolean
  caption?: string
}

export type BeforeAfterSide = { media?: MediaSource; label?: string }

export type BeforeAfterProps = {
  before: BeforeAfterSide
  after: BeforeAfterSide
  /** `slider` drags a divider across; `toggle` switches between the two. */
  mode?: 'slider' | 'toggle'
  caption?: string
  /** UI copy: the default side labels and the control's accessible name. */
  labels: { before: string; after: string; compare: string }
}

export type CodeBlockProps = {
  language: CodeLanguage
  filename?: string
  code: string
  /** Lines to highlight, 1-based: "2" or "1,4-6". */
  highlight?: string
}

/** One file of a `CodeGroup`: a file name is required, since it labels the tab. */
export type CodeFile = Omit<CodeBlockProps, 'filename'> & { filename: string }

export type CodeGroupProps = {
  /** One or more files; with several, tabs switch between them. */
  files: CodeFile[]
  /** UI copy: the tab list's accessible name and the copy button's states. */
  labels: { files: string; copy: string; copied: string }
}

export type CalloutData = { kind: 'note' | 'lesson' | 'tradeoff'; text: string }

export type StepsProps = { items: Array<{ title: string; text?: string }> }

export type MetricsProps = { items: Array<{ value: string; label: string }> }
