import type { CommandGroup, CommandItem } from './command-menu.types'

/** Group order on screen. */
export const COMMAND_GROUPS: CommandGroup[] = ['pages', 'work', 'writing', 'craft', 'actions', 'links']

/** Groups whose rows are pages of this site, opened through the router (and the page transition). */
export const ROUTED_GROUPS: CommandGroup[] = ['pages', 'work', 'writing', 'craft']

// Content search rows per group, so a broad query never buries the actions.
const CONTENT_GROUPS: CommandGroup[] = ['work', 'writing', 'craft']
const CONTENT_RESULTS_PER_GROUP = 5

/**
 * How well `item` matches `query` (already lowercased and trimmed): the label
 * starting with it ranks first, then a word of it starting with it, then the
 * label or a keyword containing it, then the query's letters in order
 * (`wrt` → Writing). 0 means no match.
 */
function score(item: CommandItem, query: string): number {
  const label = item.label.toLowerCase()
  if (label.startsWith(query)) return 4
  if (label.split(/\s+/).some((word) => word.startsWith(query))) return 3
  if (label.includes(query)) return 2
  if (item.keywords?.some((keyword) => keyword.toLowerCase().includes(query))) return 1.5

  let index = 0
  for (const char of label) if (char === query[index]) index++
  return index === query.length ? 1 : 0
}

/**
 * The items matching `query`, best first within each group, groups in
 * {@link COMMAND_GROUPS} order. An empty query keeps every item in its
 * authored order.
 */
export function filterCommands(items: CommandItem[], query: string): CommandItem[] {
  const normalized = query.trim().toLowerCase()
  const groupOrder = (item: CommandItem) => COMMAND_GROUPS.indexOf(item.group)
  if (!normalized) return [...items].sort((a, b) => groupOrder(a) - groupOrder(b))

  const shown = new Map<CommandGroup, number>()
  return items
    .map((item) => ({ item, score: score(item, normalized) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => groupOrder(a.item) - groupOrder(b.item) || b.score - a.score)
    .map(({ item }) => item)
    .filter(({ group }) => {
      if (!CONTENT_GROUPS.includes(group)) return true
      const count = (shown.get(group) ?? 0) + 1
      shown.set(group, count)
      return count <= CONTENT_RESULTS_PER_GROUP
    })
}

/**
 * The menu's own rows plus the content search's, without a second row for a
 * page the menu already lists (Home, the header's links).
 */
export function withSearchItems(items: CommandItem[], searchItems: CommandItem[]): CommandItem[] {
  const listed = new Set(items.map((item) => item.href))
  return [...items, ...searchItems.filter((item) => !listed.has(item.href))]
}
