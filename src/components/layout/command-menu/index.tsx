'use client'

import { useLenis } from 'lenis/react'
import { ArrowUpRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type KeyboardEvent, useDeferredValue, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'

import { COPY } from '@/lib/constants/copy'
import { cn } from '@/lib/utils'

import { useCommandItems, useCommandMenuShortcut, useSearchItems } from './command-menu.hooks'
import {
  getCommandMenuState,
  INITIAL_COMMAND_MENU_STATE,
  loadSearchEntries,
  setCommandMenuOpen,
  subscribeCommandMenu,
} from './command-menu.store'
import type { CommandItem, CommandMenuProps } from './command-menu.types'
import { COMMAND_GROUPS, filterCommands, ROUTED_GROUPS, withSearchItems } from './command-menu.utils'

// How long a "Copied" confirmation stays before the menu closes.
const CONFIRM_MS = 700

/**
 * The ⌘K menu: a search box over the site's pages, a few actions (copy the
 * email or this page's link, pick a theme) and the links out. Typing also
 * searches every published page, case study, chapter and writing entry,
 * loaded once per visit from `/search.json` when the menu first opens. ⌘K / Ctrl+K
 * toggles it anywhere; `CommandMenuTrigger` opens it from a button (the
 * header's, which reads "Menu" on phones, where it is the navigation).
 *
 * A native modal `<dialog>`: the browser traps focus, closes it on Esc and
 * puts it above everything. The input is an ARIA combobox over a listbox;
 * arrows move, Enter opens, the pointer highlights. It scales in from 0.96
 * with a fade (250ms) and closes instantly when it navigates, so it never
 * shows in the page transition. Lenis stops while it is open.
 *
 * Mount once (the header does); render as many triggers as needed. The
 * trigger is a separate named export, not `CommandMenu.Trigger`: Server
 * Components only see a Client Component's own exports, not properties
 * attached to it.
 *
 * @example
 * <CommandMenu navItems={navItems} />
 * <CommandMenuTrigger />
 */
export function CommandMenu({ navItems }: CommandMenuProps) {
  const copy = COPY.commandMenu
  const { open, session } = useSyncExternalStore(
    subscribeCommandMenu,
    getCommandMenuState,
    () => INITIAL_COMMAND_MENU_STATE,
  )
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lenis = useLenis()
  useCommandMenuShortcut()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      loadSearchEntries()
      delete dialog.dataset.instant
      // On touch screens the dialog takes focus instead of the input, so the
      // keyboard doesn't cover the list (it is the phone navigation).
      dialog.toggleAttribute('autofocus', window.matchMedia('(pointer: coarse)').matches)
      dialog.showModal()
      lenis?.stop()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, lenis])

  function handleClose() {
    setCommandMenuOpen(false)
    lenis?.start()
  }

  /** Closes without the fade, so the dialog isn't captured in the page transition. */
  function closeInstantly() {
    if (dialogRef.current) dialogRef.current.dataset.instant = ''
    setCommandMenuOpen(false)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={copy.label}
      onClose={handleClose}
      // Backdrop clicks land on the dialog itself; clicks inside land on its content.
      onClick={(event) => event.target === event.currentTarget && setCommandMenuOpen(false)}
      // The list scrolls natively; Lenis would otherwise take the wheel.
      data-lenis-prevent
      // Stays usable while inspect mode is on.
      data-inspect-ignore
      className={cn(
        'inset-x-0 top-0 mx-auto mt-16 mb-0 w-[calc(100%-3rem)] max-w-140 overflow-hidden rounded-xl border border-foreground/10 bg-background p-0 text-foreground outline-none sm:mt-32',
        'scale-96 opacity-0 transition-[opacity,scale,display,overlay] transition-discrete duration-250 ease-out-quint',
        'open:scale-100 open:opacity-100 starting:open:scale-96 starting:open:opacity-0',
        'backdrop:bg-background/80 backdrop:opacity-0 backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-250',
        'open:backdrop:opacity-100 starting:open:backdrop:opacity-0',
        'data-instant:transition-none data-instant:backdrop:transition-none motion-reduce:transition-none motion-reduce:backdrop:transition-none',
      )}
    >
      <CommandMenuPanel key={session} navItems={navItems} onNavigate={closeInstantly} />
    </dialog>
  )
}

/** The search box, results and hints. Keyed by the menu's session, so every opening starts empty. */
function CommandMenuPanel({ navItems, onNavigate }: CommandMenuProps & { onNavigate: () => void }) {
  const copy = COPY.commandMenu
  const router = useRouter()
  const items = useCommandItems(navItems)
  const searchItems = useSearchItems()
  const [query, setQuery] = useState('')
  // Filtering trails the input on slow devices, so typing never waits for the list.
  const deferredQuery = useDeferredValue(query)
  const [activeIndex, setActiveIndex] = useState(0)
  const [confirmedId, setConfirmedId] = useState<string | null>(null)
  const baseId = useId()
  const listId = `${baseId}-list`

  // Content rows join only while searching; the empty menu stays short.
  const results = filterCommands(deferredQuery.trim() ? withSearchItems(items, searchItems) : items, deferredQuery)
  const active = Math.min(activeIndex, results.length - 1)
  const optionId = (item: CommandItem) => `${baseId}-${item.id}`

  // Keeps the highlighted row in view while the arrows move past the list's edge.
  useEffect(() => {
    const item = results[active]
    if (item) document.getElementById(optionId(item))?.scrollIntoView({ block: 'nearest' })
  })

  async function select(item: CommandItem) {
    if (item.run) {
      const result = await item.run()
      if (result !== 'keep-open') return setCommandMenuOpen(false)
      setConfirmedId(item.id)
      setTimeout(() => setCommandMenuOpen(false), CONFIRM_MS)
      return
    }
    if (!item.href) return

    onNavigate()
    if (item.newTab) window.open(item.href, '_blank', 'noopener,noreferrer')
    // Pages go through the router (and the page transition); feeds and
    // `mailto:` links are documents of their own.
    else if (ROUTED_GROUPS.includes(item.group)) router.push(item.href)
    else window.location.assign(item.href)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((active + step + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      void select(results[active])
    }
  }

  return (
    <>
      <input
        type="text"
        role="combobox"
        aria-label={copy.search}
        aria-expanded
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={results[active] ? optionId(results[active]) : undefined}
        placeholder={copy.placeholder}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
        className="h-12 w-full border-b border-foreground/10 bg-transparent px-4 text-body outline-none placeholder:text-foreground/40"
      />

      <div id={listId} role="listbox" aria-label={copy.label} className="max-h-80 overflow-y-auto overscroll-contain p-2">
        {results.length === 0 && <p className="px-2 py-4 text-foreground/40">{copy.empty}</p>}

        {COMMAND_GROUPS.map((group) => {
          const groupItems = results.filter((item) => item.group === group)
          if (groupItems.length === 0) return null
          const headingId = `${baseId}-${group}`

          return (
            <div key={group} role="group" aria-labelledby={headingId} className="not-first:mt-2">
              <div id={headingId} role="presentation" className="px-2 pt-2 pb-1 font-mono text-micro text-foreground/40">
                {copy[group]}
              </div>
              {groupItems.map((item) => {
                // Results are already in group order, so this is the row's place in the arrow order.
                const rowIndex = results.indexOf(item)
                const isActive = rowIndex === active

                return (
                  <div
                    key={item.id}
                    id={optionId(item)}
                    role="option"
                    aria-selected={isActive}
                    aria-current={item.current || undefined}
                    onPointerMove={() => rowIndex !== active && setActiveIndex(rowIndex)}
                    onClick={() => void select(item)}
                    className={cn(
                      'flex h-10 cursor-pointer items-center justify-between gap-4 rounded-lg px-2 text-foreground/60',
                      isActive && 'bg-foreground/3 text-foreground',
                    )}
                  >
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className="truncate">{item.label}</span>
                      {item.detail && <span className="truncate text-foreground/40">{item.detail}</span>}
                    </span>
                    <CommandItemHint item={item} confirmed={confirmedId === item.id} copiedLabel={copy.copied} />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <CommandMenuHints />
    </>
  )
}

/** What sits at the end of a row: "Copied" after a copy, a check on the current choice, an arrow for a new tab. */
function CommandItemHint({ item, confirmed, copiedLabel }: { item: CommandItem; confirmed: boolean; copiedLabel: string }) {
  if (confirmed) return <span className="font-mono text-micro text-foreground/60">{copiedLabel}</span>
  if (item.current) return <Check aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
  if (item.newTab) return <ArrowUpRight aria-hidden className="size-4 shrink-0 text-foreground/40" strokeWidth={1.5} />
  return null
}

/** The keyboard legend; hidden on touch screens, which have no arrows to press. */
function CommandMenuHints() {
  const copy = COPY.commandMenu
  const hints = [
    ['↑↓', copy.hintMove],
    ['↵', copy.hintSelect],
    ['esc', copy.hintClose],
  ]

  return (
    <div aria-hidden className="flex gap-4 border-t border-foreground/10 px-4 py-2 font-mono text-micro text-foreground/40 pointer-coarse:hidden">
      {hints.map(([key, label]) => (
        <span key={key}>
          <kbd className="text-foreground/60">{key}</kbd> {label}
        </span>
      ))}
    </div>
  )
}

export { CommandMenuLink } from './command-menu-link'
export { CommandMenuTrigger } from './command-menu-trigger'
export type { CommandItem, CommandMenuProps } from './command-menu.types'
