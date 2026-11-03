'use client'

import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useEffectEvent, useId, useRef, useState } from 'react'

import { Link } from '@/components/ui/link'
import { COPY } from '@/lib/constants/copy'
import { cn, isTyping } from '@/lib/utils'

import { chapterNumber } from '@/app/(frontend)/work/_components/work.utils'
import { ARROW_KEY_OWNERS, WORK_CHAPTERS_ID } from './work-chapters.const'

/** A page of the case study, as the bar lists it. */
export type ChapterBarPage = { title: string; href: string }

type WorkChapterBarProps = {
  /** The overview, then each chapter, in reading order. */
  pages: ChapterBarPage[]
  /** The page on screen, from 1 (the overview). */
  position: number
}

const ARROW_CLASSNAME = 'inline-flex size-8 items-center justify-center rounded-lg'

/**
 * A compact chapter bar that sticks to the top of a chaptered case study
 * once its chapter list has scrolled away: the position, the current title
 * (which opens every chapter in a popover) and arrows to the previous and
 * next chapter, which ← and → also reach. Renders into a zero-height sticky
 * slot, so it takes no room in the page.
 */
export function WorkChapterBar({ pages, position }: WorkChapterBarProps) {
  const copy = COPY.work
  const router = useRouter()
  const listId = useId()
  const bar = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)
  const previous = position > 1 ? pages[position - 2] : null
  const next = pages[position] ?? null

  // Shown once the chapter list is above the viewport, hidden again when it's back.
  useEffect(() => {
    const chapters = document.getElementById(WORK_CHAPTERS_ID)
    if (!chapters) return
    const observer = new IntersectionObserver(([entry]) => {
      const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0
      setShown(passed)
      if (!passed) setOpen(false)
    })
    observer.observe(chapters)
    return () => observer.disconnect()
  }, [])

  // ← and → move between chapters, unless focus is somewhere that uses the arrows.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    if (isTyping(event) || document.querySelector('dialog[open]')) return
    if (event.target instanceof Element && event.target.closest(ARROW_KEY_OWNERS)) return
    const target = event.key === 'ArrowLeft' ? previous : next
    if (target) router.push(target.href)
  })

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // The open list closes on Esc and on a press anywhere outside the bar.
  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    function handlePointerDown(event: PointerEvent) {
      if (!bar.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open])

  return (
    // The sticky slot has no height, and cancels the gap it would add to the article.
    <div className="sticky top-0 z-10 -mb-pad-2xl h-0 print:hidden">
      <div
        ref={bar}
        inert={!shown}
        className={cn(
          'absolute inset-x-0 top-0 flex items-center justify-between gap-4 border-b border-foreground/10 bg-background py-pad-xs transition-[opacity,translate] duration-250 ease-out-quint motion-reduce:transition-none',
          !shown && 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen(!open)}
          className="group -ml-2 flex min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-caption transition-colors duration-250 hover:bg-foreground/3"
        >
          <span className="font-mono text-micro text-subtle">{chapterNumber(position, pages.length)}</span>
          <span className="truncate">{pages[position - 1]?.title}</span>
          <ChevronDown
            aria-hidden
            strokeWidth={1.5}
            className={cn(
              'size-4 shrink-0 text-subtle transition-transform duration-250 group-hover:text-foreground',
              open && 'rotate-180',
            )}
          />
        </button>

        <div className="-mr-2 flex shrink-0 items-center">
          {previous ? (
            <Link
              href={previous.href}
              aria-label={copy.previousChapter}
              aria-keyshortcuts="ArrowLeft"
              title={`${copy.previousChapter} (←)`}
              className={cn(ARROW_CLASSNAME, 'text-muted transition-colors duration-250 hover:text-foreground')}
            >
              <ArrowLeft aria-hidden strokeWidth={1.5} className="size-4" />
            </Link>
          ) : (
            <span aria-hidden className={cn(ARROW_CLASSNAME, 'text-foreground/25')}>
              <ArrowLeft strokeWidth={1.5} className="size-4" />
            </span>
          )}
          {next ? (
            <Link
              href={next.href}
              aria-label={copy.nextChapter}
              aria-keyshortcuts="ArrowRight"
              title={`${copy.nextChapter} (→)`}
              className={cn(ARROW_CLASSNAME, 'text-muted transition-colors duration-250 hover:text-foreground')}
            >
              <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
            </Link>
          ) : (
            <span aria-hidden className={cn(ARROW_CLASSNAME, 'text-foreground/25')}>
              <ArrowRight strokeWidth={1.5} className="size-4" />
            </span>
          )}
        </div>

        {/* Every chapter: a popover under the bar (scale from 0.96 and fade, the brand's popover motion). */}
        <div
          id={listId}
          inert={!open}
          className={cn(
            'absolute top-full left-0 mt-pad-xs w-full max-w-sm origin-top-left rounded-xl border border-foreground/10 bg-background p-1 transition-[opacity,scale] duration-250 ease-out-quint motion-reduce:transition-none',
            !open && 'pointer-events-none scale-96 opacity-0',
          )}
        >
          <ol aria-label={copy.chapters}>
            {pages.map((page, index) => {
              const isCurrent = index + 1 === position
              return (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    aria-current={isCurrent ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-baseline gap-4 rounded-lg px-2 py-2 text-caption transition-colors duration-250',
                      isCurrent
                        ? 'bg-foreground/3 text-foreground'
                        : 'text-muted hover:bg-foreground/3 hover:text-foreground',
                    )}
                  >
                    <span className="font-mono text-micro text-subtle">{String(index + 1).padStart(2, '0')}</span>
                    {page.title}
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
