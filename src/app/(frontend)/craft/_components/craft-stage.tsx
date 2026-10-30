import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** The surface a live demo runs on: `MediaFrame`'s surface, hairline and corners, its content centered. */
export function CraftStage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative flex aspect-16/10 items-center justify-center overflow-hidden rounded-xl border border-foreground/10 bg-foreground/3',
        className,
      )}
    >
      {children}
    </div>
  )
}
