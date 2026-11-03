import { highlightCode } from '@/lib/code/highlight.server'
import { CODE_LANGUAGES } from '@/lib/constants/code-languages'
import { cn, toCSSVars } from '@/lib/utils'

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
 * The code itself, in mono, with syntax colors (Shiki, on the server: no
 * JavaScript reaches the browser): scrolls sideways (never wraps),
 * highlighted lines on a lighter band. Paper gets the light theme. Shared by
 * `CodeBlock` and `CodeGroup`. Focusable, so keyboard users can scroll it;
 * the focus ring is drawn inside, where the frame's `overflow-hidden` can't
 * clip it.
 */
export async function CodeLines({
  code,
  language,
  highlight,
}: Pick<CodeBlockProps, 'code' | 'language' | 'highlight'>) {
  const highlighted = parseLines(highlight)
  const lines = await highlightCode(code, language)

  return (
    <pre
      tabIndex={0}
      className="overflow-x-auto rounded-lg py-3 font-mono text-micro leading-relaxed focus-visible:-outline-offset-2"
    >
      <code className="block min-w-max">
        {lines.map((tokens, index) => (
          <span key={index} className={cn('block px-4', highlighted.has(index + 1) && 'bg-foreground/5')}>
            {tokens.length === 0
              ? ' '
              : tokens.map((token, tokenIndex) => (
                  <span
                    key={tokenIndex}
                    className="text-(--code-screen) print:text-(--code-print)"
                    style={toCSSVars({ 'code-screen': token.screen, 'code-print': token.print })}
                  >
                    {token.content}
                  </span>
                ))}
          </span>
        ))}
      </code>
    </pre>
  )
}

/** Code on a surface: the file name and language above, the code below. */
export async function CodeBlock({ language, filename, code, highlight }: CodeBlockProps) {
  return (
    <figure className="overflow-hidden rounded-xl border border-foreground/10 bg-foreground/3">
      <figcaption className="flex justify-between gap-4 border-b border-foreground/10 px-4 py-2 font-mono text-micro text-subtle">
        <span>{filename}</span>
        <span>{CODE_LANGUAGES[language]}</span>
      </figcaption>
      <CodeLines code={code} language={language} highlight={highlight} />
    </figure>
  )
}
