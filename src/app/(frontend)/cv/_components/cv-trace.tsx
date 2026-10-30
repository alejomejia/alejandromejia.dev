'use client'

import { createContext, type ReactNode, use, useState } from 'react'

import { cn } from '@/lib/utils'

type TraceState = {
  /** The skill being traced: the hovered one, else the pinned one. */
  active: string | null
  pinned: string | null
  hover: (key: string | null) => void
  togglePin: (key: string) => void
}

const TraceContext = createContext<TraceState | null>(null)

function useTrace(): TraceState {
  const trace = use(TraceContext)
  if (!trace) throw new Error('CvSkill and CvTraceItem need a <CvTrace> around them.')
  return trace
}

/**
 * The skill trace: hovering a skill (or tapping it, which pins it) lights up
 * the same skill everywhere on the CV and fades the roles that didn't use
 * it, so "where did he use React?" is answered at a glance.
 */
export function CvTrace({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)

  return (
    <TraceContext
      value={{
        active: hovered ?? pinned,
        pinned,
        hover: setHovered,
        togglePin: (key) => setPinned((current) => (current === key ? null : key)),
      }}
    >
      {children}
    </TraceContext>
  )
}

const TAG_CLASSNAME = 'inline-flex h-6 items-center rounded-full border px-2 font-mono text-micro'

/**
 * A skill as a tag. With a `traceKey` it is a button that traces the skill;
 * without one (a skill no role lists) it is plain text, since tracing it
 * would fade everything.
 */
export function CvSkill({ name, traceKey }: { name: string; traceKey?: string }) {
  const trace = use(TraceContext)

  if (!traceKey || !trace) {
    return <span className={cn(TAG_CLASSNAME, 'border-foreground/10 text-foreground/60')}>{name}</span>
  }

  const active = trace.active === traceKey

  return (
    <button
      type="button"
      aria-pressed={trace.pinned === traceKey}
      // Mouse only: on touch, a tap pins instead, and a stray hover would stick.
      onPointerEnter={(event) => event.pointerType === 'mouse' && trace.hover(traceKey)}
      onPointerLeave={() => trace.hover(null)}
      onClick={() => trace.togglePin(traceKey)}
      className={cn(
        TAG_CLASSNAME,
        'cursor-pointer transition-colors duration-250',
        active ? 'border-foreground bg-foreground text-background' : 'border-foreground/10 text-foreground/60 hover:text-foreground',
      )}
    >
      {name}
    </button>
  )
}

/** A role or project that fades while a skill it didn't use is traced. */
export function CvTraceItem({ traceKeys, children, className }: { traceKeys: string[]; children: ReactNode; className?: string }) {
  const { active } = useTrace()
  const faded = active !== null && !traceKeys.includes(active)

  return <div className={cn('transition-opacity duration-250', faded && 'opacity-40', className)}>{children}</div>
}
