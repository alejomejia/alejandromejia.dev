'use client'

import { COPY } from '@/lib/constants/copy'
import { cn, formatMessage } from '@/lib/utils'

import { useIsApplePlatform } from './command-menu.hooks'
import { loadSearchEntries, setCommandMenuOpen } from './command-menu.store'

/**
 * Opens the command menu. Reads "Menu" on phones (where the menu is the
 * navigation) and shows the shortcut, ⌘K or Ctrl K, from `sm` up. From
 * `sm` the button itself is the key's box, so its focus ring traces it.
 *
 * @example
 * <CommandMenuTrigger />
 */
export function CommandMenuTrigger({ className }: { className?: string }) {
  const copy = COPY.commandMenu
  const apple = useIsApplePlatform()
  const shortcut = apple ? '⌘K' : 'Ctrl K'

  return (
    <button
      type="button"
      onClick={() => setCommandMenuOpen(true)}
      // Starts loading the content search before the click lands.
      onPointerEnter={loadSearchEntries}
      onFocus={loadSearchEntries}
      aria-haspopup="dialog"
      aria-keyshortcuts={apple ? 'Meta+K' : 'Control+K'}
      // The name holds the visible text ("Menu" or the shortcut), so voice
      // control users can say what they see.
      aria-label={formatMessage(copy.open, { shortcut })}
      className={cn(
        'inline-flex h-8 cursor-pointer items-center text-muted transition-colors duration-250 hover:text-foreground sm:h-6 sm:rounded-lg sm:border sm:border-foreground/10 sm:px-2',
        className,
      )}
    >
      <span className="sm:hidden">{copy.menu}</span>
      <kbd className="hidden font-mono text-micro sm:inline">{shortcut}</kbd>
    </button>
  )
}
