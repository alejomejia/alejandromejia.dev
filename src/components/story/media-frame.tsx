import type { ReactNode } from 'react'

import { CoverMedia } from '@/components/cms/cover-media'
import type { MediaSource } from '@/lib/cms/media'
import { cn } from '@/lib/utils'

/** The halftone dots that stand in for missing media (`currentColor`, so `text-*` sets their ink). */
export const DOT_TEXTURE_CLASSNAME =
  'absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-size-[0.5rem_0.5rem] text-foreground/10'

type MediaFrameProps = {
  media?: MediaSource
  /** Minimal browser chrome above the media: three dots and a hairline. */
  chrome?: boolean
  /** Rendered width per breakpoint; defaults to the content column. */
  sizes?: string
  /** Sets the aspect ratio of the media area (`aspect-16/10` by default). */
  className?: string
  /** Replaces the dot texture when there is no media. */
  children?: ReactNode
}

/**
 * The frame every piece of work is shown in: a `foreground/3` surface, a
 * hairline and 12px corners, optionally with browser chrome. Without media
 * it shows a dot texture, so a page can be designed before the recordings
 * exist.
 */
export function MediaFrame({
  media,
  chrome = false,
  sizes = '(min-width: 64rem) 40rem, 100vw',
  className,
  children,
}: MediaFrameProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-foreground/10 bg-foreground/3">
      {chrome && (
        <div aria-hidden className="flex gap-1.5 border-b border-foreground/10 px-3 py-2.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-2 rounded-full bg-foreground/10" />
          ))}
        </div>
      )}
      <div className={cn('relative aspect-16/10', className)}>
        {media ? (
          <CoverMedia media={media} sizes={sizes} />
        ) : (
          (children ?? <div aria-hidden className={DOT_TEXTURE_CLASSNAME} />)
        )}
      </div>
    </div>
  )
}
