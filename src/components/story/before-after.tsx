'use client'

import { useState } from 'react'

import { CoverMedia } from '@/components/cms/cover-media'
import { cn, toCSSVars } from '@/lib/utils'

import { DOT_TEXTURE_CLASSNAME } from './media-frame'
import type { BeforeAfterProps, BeforeAfterSide } from './story.types'

const SIZES = '(min-width: 64rem) 40rem, 100vw'
const LABEL_CLASSNAME = 'absolute top-3 rounded-full bg-background/80 px-2 py-0.5 font-mono text-micro text-muted'

/** One side's media, or a dot texture: coarse and faint before, the house grid after. */
function Side({ side, placeholder }: { side: BeforeAfterSide; placeholder: 'before' | 'after' }) {
  if (side.media) return <CoverMedia media={side.media} sizes={SIZES} />
  return placeholder === 'before' ? (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(currentColor_1.5px,transparent_1.5px)] bg-size-[1rem_1rem] bg-position-[0.25rem_0.375rem] text-foreground/15"
    />
  ) : (
    <div aria-hidden className={cn(DOT_TEXTURE_CLASSNAME, 'text-foreground/25')} />
  )
}

/**
 * Two versions of the same screen. As a slider, the divider follows a drag
 * or the arrow keys (a native range input lies over the frame, so it works
 * with touch, mouse and keyboard); as a toggle, two buttons switch between
 * them with a cross-fade. Without media, each side shows a dot texture.
 */
export function BeforeAfter({ before, after, mode = 'slider', caption, labels }: BeforeAfterProps) {
  const [position, setPosition] = useState(50)
  const [showAfter, setShowAfter] = useState(true)
  const beforeLabel = before.label ?? labels.before
  const afterLabel = after.label ?? labels.after

  return (
    <figure className="flex flex-col gap-pad-xs">
      <div
        style={toCSSVars({ position: `${position}%` })}
        className="relative aspect-16/10 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/3 outline-offset-2 outline-foreground has-focus-visible:outline-1"
      >
        <Side side={before} placeholder="before" />
        <div
          className={cn(
            'absolute inset-0',
            mode === 'slider'
              ? '[clip-path:inset(0_0_0_var(--position))]'
              : cn('transition-opacity duration-250', !showAfter && 'opacity-0'),
          )}
        >
          <Side side={after} placeholder="after" />
        </div>

        {mode === 'slider' ? (
          <>
            <span className={cn(LABEL_CLASSNAME, 'left-3')}>{beforeLabel}</span>
            <span className={cn(LABEL_CLASSNAME, 'right-3')}>{afterLabel}</span>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-(--position) w-px -translate-x-1/2 bg-foreground/40"
            >
              <span className="absolute top-1/2 left-1/2 size-6 -translate-1/2 rounded-full border border-foreground/20 bg-background" />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              aria-label={labels.compare}
              aria-valuetext={`${position}%`}
              className="absolute inset-0 size-full cursor-ew-resize opacity-0"
            />
          </>
        ) : (
          <span className={cn(LABEL_CLASSNAME, 'left-3')}>{showAfter ? afterLabel : beforeLabel}</span>
        )}
      </div>

      {(caption || mode === 'toggle') && (
        <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 text-caption text-muted">
          {caption && <span className="text-pretty">{caption}</span>}
          {mode === 'toggle' && (
            <span className="flex gap-3 font-mono text-micro">
              {[
                { label: beforeLabel, after: false },
                { label: afterLabel, after: true },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  aria-pressed={showAfter === option.after}
                  onClick={() => setShowAfter(option.after)}
                  className="text-subtle transition-colors duration-250 hover:text-foreground aria-pressed:text-foreground"
                >
                  {option.label}
                </button>
              ))}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  )
}
