'use client'

import { COPY } from '@/lib/constants/copy'
import { cn } from '@/lib/utils'

import { useIsApplePlatform } from './command-menu.hooks'
import { loadSearchEntries, setCommandMenuOpen } from './command-menu.store'

/**
 * Opens the command menu. Reads "Menu" on phones (where the menu is the
 * navigation) and shows the shortcut, ⌘K or Ctrl K, from `sm` up.
 *
 * @example
 * <CommandMenuTrigger />
 */
export function CommandMenuTrigger({ className }: { className?: string }) {
  const copy = COPY.commandMenu
  const apple = useIsApplePlatform()

  return (
    <button
      type="button"
      onClick={() => setCommandMenuOpen(true)}
      // Starts loading the content search before the click lands.
      onPointerEnter={loadSearchEntries}
      onFocus={loadSearchEntries}
      aria-haspopup="dialog"
      aria-keyshortcuts={apple ? 'Meta+K' : 'Control+K'}
      aria-label={copy.open}
      className={cn(
        'inline-flex h-8 cursor-pointer items-center text-foreground/60 transition-colors duration-250 hover:text-foreground',
        className,
      )}
    >
      <span className="sm:hidden">{copy.menu}</span>
      <kbd className="hidden rounded-lg border border-foreground/10 px-2 font-mono text-micro leading-6 sm:inline">
        {apple ? '⌘K' : 'Ctrl K'}
      </kbd>
    </button>
  )
}
