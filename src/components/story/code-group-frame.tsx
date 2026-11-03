'use client'

import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import type { CodeGroupProps } from './story.types'

// How long "Copied" shows before the button reads "Copy" again.
const COPIED_MS = 2000

type CodeGroupFrameProps = {
  files: Array<{ filename: string; language: string; code: string }>
  /** Each file's code, rendered on the server, in the order of `files`. */
  panels: ReactNode[]
  labels: CodeGroupProps['labels']
}

/**
 * The interactive half of `CodeGroup`: file tabs (arrow keys move between
 * them), the active file's language, and a button that copies its code.
 * Every panel is in the markup, the inactive ones `hidden`.
 */
export function CodeGroupFrame({ files, panels, labels }: CodeGroupFrameProps) {
  const id = useId()
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(files[active].code)
    } catch {
      // Clipboard blocked (permissions, insecure context): nothing to confirm.
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), COPIED_MS)
  }

  function select(index: number) {
    setActive(index)
    setCopied(false)
  }

  // Roving focus, as a tab list expects: arrows wrap, Home and End jump.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = files.length - 1
    const targets: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }
    const next = targets[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next)
    tabs.current[next]?.focus()
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-foreground/10 bg-foreground/3">
      <div className="flex items-center justify-between gap-4 border-b border-foreground/10 pr-4 font-mono text-micro text-subtle">
        {files.length > 1 ? (
          // Out of the tab order: Firefox would stop on the scroll container
          // itself; the tabs inside are the stop.
          <div
            role="tablist"
            aria-label={labels.files}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="flex min-w-0 gap-1 overflow-x-auto py-1 pl-2"
          >
            {files.map((file, index) => (
              <button
                key={file.filename}
                ref={(element) => {
                  tabs.current[index] = element
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${index}`}
                aria-selected={index === active}
                aria-controls={`${id}-panel-${index}`}
                tabIndex={index === active ? 0 : -1}
                onClick={() => select(index)}
                // Chips, so they read as choices: the active one boxed (hairline, surface, ink), the others filled on hover.
                className="shrink-0 cursor-pointer rounded-lg border border-transparent px-2 py-1 whitespace-nowrap transition-colors duration-250 hover:bg-foreground/3 hover:text-foreground focus-visible:-outline-offset-2 aria-selected:border-foreground/10 aria-selected:bg-foreground/5 aria-selected:text-foreground"
              >
                {file.filename}
              </button>
            ))}
          </div>
        ) : (
          <span className="py-2 pl-4">{files[0]?.filename}</span>
        )}
        <span className="flex shrink-0 items-center gap-4">
          <span className="hidden sm:inline">{files[active]?.language}</span>
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              'cursor-pointer transition-colors duration-250 hover:text-foreground',
              copied && 'text-foreground',
            )}
          >
            {/* Announced when it changes, so screen readers hear the copy land. */}
            <span aria-live="polite">{copied ? labels.copied : labels.copy}</span>
          </button>
        </span>
      </div>
      {panels.map((panel, index) => (
        <div
          key={files[index].filename}
          role={files.length > 1 ? 'tabpanel' : undefined}
          id={`${id}-panel-${index}`}
          aria-labelledby={files.length > 1 ? `${id}-tab-${index}` : undefined}
          hidden={index !== active}
        >
          {panel}
        </div>
      ))}
    </figure>
  )
}
