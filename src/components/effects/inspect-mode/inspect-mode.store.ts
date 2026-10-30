// On or off, shared by the overlay, the footer toggle and the command menu
// without a provider (the toggles sit in Server Component trees).
let enabled = false
const listeners = new Set<() => void>()

/** Turns inspect mode on or off. */
export function setInspectEnabled(next: boolean) {
  if (next === enabled) return
  enabled = next
  for (const listener of listeners) listener()
}

export function isInspectEnabled(): boolean {
  return enabled
}

export function subscribeInspect(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}
