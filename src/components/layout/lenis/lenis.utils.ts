/**
 * Class name that opts an element (or any of its ancestors) out of Lenis
 * smooth scrolling. Add it to scrollable UI (modals, dropdowns, code blocks)
 * that should keep native wheel/touch scrolling.
 */
export const LENIS_PREVENT_CLASS = 'lenis-prevent'

/**
 * Returns `true` when Lenis should not smooth-scroll for a given event target,
 * i.e. the node or an ancestor carries {@link LENIS_PREVENT_CLASS}.
 *
 * @param node - The element the wheel/touch event originated from.
 */
export function shouldPreventScroll(node: HTMLElement): boolean {
  return node.closest(`.${LENIS_PREVENT_CLASS}`) !== null
}
