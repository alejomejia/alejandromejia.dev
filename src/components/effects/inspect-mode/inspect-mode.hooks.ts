'use client'

import { useEffect, useSyncExternalStore } from 'react'

import { INSPECT_KEY } from './inspect-mode.const'
import { isInspectEnabled, setInspectEnabled, subscribeInspect } from './inspect-mode.store'

/** Whether inspect mode is on. `false` on the server and during hydration. */
export function useInspectEnabled(): boolean {
  return useSyncExternalStore(subscribeInspect, isInspectEnabled, () => false)
}

/** Whether the event happened while typing, where `I` is a letter, not a shortcut. */
function isTyping(event: KeyboardEvent): boolean {
  const target = event.target
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}

/** `I` toggles inspect mode anywhere outside text fields and open dialogs. */
export function useInspectShortcut() {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== INSPECT_KEY || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.repeat || isTyping(event) || document.querySelector('dialog[open]')) return
      setInspectEnabled(!isInspectEnabled())
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
