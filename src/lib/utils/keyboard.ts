/**
 * Whether a key event happened while typing (a text field, a select, an
 * editable element), where a letter or an arrow is text, not a shortcut.
 */
export function isTyping(event: KeyboardEvent): boolean {
  const target = event.target
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}
