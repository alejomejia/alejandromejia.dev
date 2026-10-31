'use client'

import { Frame } from 'lucide-react'

import { COPY } from '@/lib/constants/copy'
import { cn } from '@/lib/utils'

import { INSPECT_IGNORE_ATTRIBUTE } from './inspect-mode.const'
import { useInspectEnabled } from './inspect-mode.hooks'
import { setInspectEnabled } from './inspect-mode.store'

/**
 * The 32px icon button that turns inspect mode on and off; pressed while on.
 * Inspect mode leaves it clickable.
 *
 * @example
 * <InspectModeToggle />
 */
export function InspectModeToggle({ className }: { className?: string }) {
  const copy = COPY.inspect
  const enabled = useInspectEnabled()

  return (
    <button
      type="button"
      onClick={() => setInspectEnabled(!enabled)}
      aria-pressed={enabled}
      aria-keyshortcuts="I"
      aria-label={copy.title}
      title={`${copy.title} (I)`}
      {...{ [INSPECT_IGNORE_ATTRIBUTE]: '' }}
      className={cn(
        'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors duration-250 hover:text-foreground aria-pressed:text-foreground',
        className,
      )}
    >
      <Frame aria-hidden className="size-4" strokeWidth={1.5} />
    </button>
  )
}
