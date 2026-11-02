import { CODE_LANGUAGES } from '@/lib/constants/code-languages'
import { cn } from '@/lib/utils'

import type { CodeBlockProps } from './story.types'

/** "1,4-6" → {1, 4, 5, 6}. Anything that isn't a number or a range is ignored. */
function parseLines(highlight?: string): Set<number> {
  const lines = new Set<number>()
  for (const part of highlight?.split(',') ?? []) {
    const [start, end = start] = part.trim().split('-').map(Number)
    if (!Number.isInteger(start) || !Number.isInteger(end)) continue
    for (let line = start; line <= end; line++) lines.add(line)
  }
  return lines
}

/**
 * The code itself, in mono: scrolls sideways (never wraps), highlighted
 * lines on a darker band. Plain monochrome for now; syntax colors (Shiki,
 * server rendered) come later. Shared by `CodeBlock` and `CodeGroup`.
 * Focusable, so keyboard users can scroll it; the focus ring is drawn inside,
 * where the frame's `overflow-hidden` can't clip it.
 */
export function CodeLines({ code, highlight }: Pick<CodeBlockProps, 'code' | 'highlight'>) {
  const highlighted = parseLines(highlight)

  return (
    <pre
      tabIndex={0}
      className="overflow-x-auto rounded-lg py-3 font-mono text-micro leading-relaxed focus-visible:-outline-offset-2"
    >
      <code className="block min-w-max">
        {code.split('\n').map((line, index) => (
          <span
            key={index}
            className={cn('block px-4', highlighted.has(index + 1) ? 'bg-foreground/5' : 'text-foreground/70')}
          >
            {line || ' '}
          </span>
        ))}
      </code>
    </pre>
  )
}

/** Code on a surface: the file name and language above, the code below. */
export function CodeBlock({ language, filename, code, highlight }: CodeBlockProps) {
  return (
    <figure className="overflow-hidden rounded-xl border border-foreground/10 bg-foreground/3">
      <figcaption className="flex justify-between gap-4 border-b border-foreground/10 px-4 py-2 font-mono text-micro text-subtle">
        <span>{filename}</span>
        <span>{CODE_LANGUAGES[language]}</span>
      </figcaption>
      <CodeLines code={code} highlight={highlight} />
    </figure>
  )
}
