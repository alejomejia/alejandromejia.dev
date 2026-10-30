'use client'

import { useEffect, useEffectEvent, useRef, useState } from 'react'

import { COPY, type Copy } from '@/lib/constants/copy'
import { cn, toCSSVars } from '@/lib/utils'

import { INSPECT_COLORS, INSPECT_IGNORE_ATTRIBUTE, INSPECT_ORIGIN_ATTRIBUTE } from './inspect-mode.const'
import { useInspectEnabled, useInspectShortcut } from './inspect-mode.hooks'
import { setInspectEnabled } from './inspect-mode.store'
import type { InspectBox, InspectDistance, InspectMeasure, InspectSnapshot } from './inspect-mode.types'
import { describeElement, formatLength, measureDistances, measureElement, nameElement, toBox } from './inspect-mode.utils'

const EMPTY_SNAPSHOT: InspectSnapshot = {
  column: null,
  hovered: null,
  selected: null,
  selectedName: null,
  details: [],
  distances: [],
}

// An 8px grid of hairlines at 6% ink, anchored by `--grid-x` / `--grid-y`.
const GRID_CLASSNAME = [
  'bg-[linear-gradient(to_right,color-mix(in_srgb,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--foreground)_6%,transparent)_1px,transparent_1px)]',
  'bg-size-[0.5rem_0.5rem] [background-position:var(--grid-x)_var(--grid-y)]',
].join(' ')

// Overlay labels: small mono pills in the overlay's colors.
const LABEL_CLASSNAME =
  'absolute rounded-sm px-1 font-mono text-micro leading-4 whitespace-nowrap text-(--inspect-label)'

/**
 * Inspect mode: turns any page into a Figma-like inspection view, to show the
 * site sits on its 8px grid. Hover an element to see its box, padding and
 * size; click to select it, then hover another for the redlines between them
 * (px plus the spacing token when one matches, `24 · pad-m`). An 8px grid and
 * the layout column sit behind everything, and a panel lists the selection's
 * size, padding, gap, radius and type.
 *
 * `I` toggles it (outside text fields), as do `InspectModeToggle` and the
 * command menu; `Esc` clears the selection, then exits. While it is on,
 * clicks select instead of following links. Touch screens get the grid and
 * the panel (there is no hover to measure with).
 *
 * Mount once, in the root layout. Mark the layout column's container with
 * `data-inspect-origin` (the header's does): it anchors the grid.
 *
 * @example
 * <InspectMode />
 */
export function InspectMode() {
  const enabled = useInspectEnabled()
  useInspectShortcut()
  // Mounted only while on, so every session starts with nothing selected.
  return enabled ? <InspectOverlay /> : null
}

function InspectOverlay() {
  const copy = COPY.inspect
  const [snapshot, setSnapshot] = useState<InspectSnapshot>(EMPTY_SNAPSHOT)
  const hoveredRef = useRef<Element | null>(null)
  const selectedRef = useRef<Element | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const handleEscape = useEffectEvent(() => {
    if (snapshot.selected) {
      selectedRef.current = null
      setSnapshot((current) => ({ ...current, selected: null, selectedName: null, details: [], distances: [] }))
    } else {
      setInspectEnabled(false)
    }
  })

  useEffect(() => {
    let frame = 0
    const ignored = (element: Element) => element.closest(`[${INSPECT_IGNORE_ATTRIBUTE}]`)
    const fine = window.matchMedia('(pointer: fine)').matches

    // Re-measures everything on the next frame: after a hover, a click, a
    // scroll or a resize. Elements that left the page (a navigation) are dropped.
    function measure() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const hovered = hoveredRef.current?.isConnected ? hoveredRef.current : null
        const selected = selectedRef.current?.isConnected ? selectedRef.current : null
        const origin = document.querySelector(`[${INSPECT_ORIGIN_ATTRIBUTE}]`)?.getBoundingClientRect()

        gridRef.current?.style.setProperty('--grid-x', `${origin?.left ?? 0}px`)
        gridRef.current?.style.setProperty('--grid-y', `${origin?.top ?? 0}px`)
        setSnapshot({
          column: origin ? toBox(origin) : null,
          hovered: hovered && hovered !== selected ? measureElement(hovered) : null,
          selected: selected ? measureElement(selected) : null,
          selectedName: selected ? nameElement(selected) : null,
          details: selected ? describeElement(selected) : [],
          distances:
            hovered && selected && hovered !== selected
              ? measureDistances(selected.getBoundingClientRect(), hovered.getBoundingClientRect())
              : [],
        })
      })
    }

    function handlePointerMove(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target : null
      const valid = target && target !== document.documentElement && target !== document.body && !ignored(target)
      const next = valid ? target : null
      if (next === hoveredRef.current) return
      hoveredRef.current = next
      measure()
    }

    function handlePointerLeave() {
      hoveredRef.current = null
      measure()
    }

    // Capture phase on window: runs before React's handlers and stops them,
    // so links and buttons don't fire while inspecting.
    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null
      if (!target || ignored(target)) return
      event.preventDefault()
      event.stopPropagation()
      selectedRef.current = selectedRef.current === target ? null : target
      measure()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) handleEscape()
    }

    // Crosshair everywhere while inspecting; removed with the overlay.
    const cursor = document.createElement('style')
    cursor.textContent = `*:not([${INSPECT_IGNORE_ATTRIBUTE}] *) { cursor: crosshair !important; }`
    if (fine) document.head.append(cursor)

    measure()
    if (fine) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', handlePointerLeave)
      window.addEventListener('click', handleClick, true)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(frame)
      cursor.remove()
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('click', handleClick, true)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { column, hovered, selected, distances } = snapshot

  return (
    <>
      <div
        aria-hidden
        {...{ [INSPECT_IGNORE_ATTRIBUTE]: '' }}
        style={toCSSVars(INSPECT_COLORS)}
        className="pointer-events-none fixed inset-0 z-90"
      >
        <div ref={gridRef} className={cn('absolute inset-0', GRID_CLASSNAME)} />
        {column && <ColumnBand box={column} />}
        {hovered && <MeasureBox measure={hovered} />}
        {/* While measuring, the redlines take over; the panel still shows the selection's size. */}
        {selected && <MeasureBox measure={selected} selected showSize={distances.length === 0} />}
        {distances.map((distance) => (
          <DistanceLine key={`${distance.axis}-${distance.x}-${distance.y}`} distance={distance} />
        ))}
      </div>
      <InspectPanel snapshot={snapshot} copy={copy} />
    </>
  )
}

/** The layout column, as a faint band like a Figma layout grid. */
function ColumnBand({ box }: { box: InspectBox }) {
  return (
    <div
      style={toCSSVars({ x: box.x, w: box.w }, 'px')}
      className="absolute inset-y-0 left-(--x) w-(--w) border-x border-(--inspect-distance)/20 bg-(--inspect-distance)/3"
    />
  )
}

/** An element's outline, its padding shaded, and its size below it. */
function MeasureBox({
  measure,
  selected = false,
  showSize = true,
}: {
  measure: InspectMeasure
  selected?: boolean
  showSize?: boolean
}) {
  const { box, padding, size } = measure

  return (
    <>
      {padding.map((area) => (
        <div
          key={`${area.x}-${area.y}-${area.w}-${area.h}`}
          style={toCSSVars(area, 'px')}
          className="absolute top-(--y) left-(--x) h-(--h) w-(--w) bg-(--inspect-box)/12"
        />
      ))}
      <div
        style={toCSSVars(box, 'px')}
        className={cn(
          'absolute top-(--y) left-(--x) h-(--h) w-(--w) outline-1 outline-(--inspect-box)',
          selected && 'outline-2',
        )}
      >
        {showSize && (
          <span className={cn(LABEL_CLASSNAME, 'top-full left-1/2 mt-1 -translate-x-1/2 bg-(--inspect-box)')}>
            {size}
          </span>
        )}
      </div>
    </>
  )
}

/** A redline with its length. */
function DistanceLine({ distance }: { distance: InspectDistance }) {
  const { axis, x, y, length } = distance
  const horizontal = axis === 'x'

  return (
    <div
      style={toCSSVars({ x, y, length: Math.round(length) }, 'px')}
      className={cn(
        'absolute top-(--y) left-(--x) bg-(--inspect-distance)',
        horizontal ? 'h-px w-(--length)' : 'h-(--length) w-px',
      )}
    >
      <span
        className={cn(
          LABEL_CLASSNAME,
          'bg-(--inspect-distance)',
          horizontal ? 'bottom-full left-1/2 mb-1 -translate-x-1/2' : 'top-1/2 left-full ml-1 -translate-y-1/2',
        )}
      >
        {formatLength(length)}
      </span>
    </div>
  )
}

/** The mode's panel: what is selected and its specs, or how to start; and a way out. */
function InspectPanel({
  snapshot,
  copy,
}: {
  snapshot: InspectSnapshot
  copy: Copy['inspect']
}) {
  return (
    <aside
      {...{ [INSPECT_IGNORE_ATTRIBUTE]: '' }}
      aria-label={copy.title}
      className="fixed top-4 right-4 z-90 w-64 rounded-xl border border-foreground/10 bg-background p-4 font-mono text-micro"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-foreground">{copy.title}</p>
        <button
          type="button"
          onClick={() => setInspectEnabled(false)}
          className="cursor-pointer text-foreground/40 transition-colors duration-250 hover:text-foreground"
        >
          {copy.exit}
        </button>
      </div>

      {snapshot.selectedName ? (
        <>
          <p className="mt-2 truncate text-foreground/60">{snapshot.selectedName}</p>
          <dl className="mt-2 grid grid-cols-[4rem_1fr] gap-y-1">
            {snapshot.details.map(({ label, value }) => (
              <div key={label} className="contents">
                <dt className="text-foreground/40">{copy[label]}</dt>
                <dd className="truncate text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <p className="mt-2 text-foreground/60">{copy.hint}</p>
      )}
      <p className="mt-4 text-foreground/40">{copy.keys}</p>
    </aside>
  )
}

export { InspectModeToggle } from './inspect-mode-toggle'
export { useInspectEnabled } from './inspect-mode.hooks'
export { isInspectEnabled, setInspectEnabled } from './inspect-mode.store'
