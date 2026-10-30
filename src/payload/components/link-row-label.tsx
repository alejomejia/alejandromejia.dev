'use client'

import { useRowLabel } from '@payloadcms/ui'

type LinkRow = { link?: { label?: string | null } | null }

type LinkRowLabelProps = {
  /** Names a row whose link has no label yet, e.g. "Button" → "Button 02". */
  itemName?: string
}

/**
 * Admin row label for arrays of `link()` rows (menus, social links): shows
 * the link's label (or a numbered fallback) instead of the generic "Row".
 * Wire it with `linkRowLabel()` from `@/payload/fields/link`.
 */
export function LinkRowLabel({ itemName = 'Link' }: LinkRowLabelProps) {
  const { data, rowNumber } = useRowLabel<LinkRow>()
  const index = String((rowNumber ?? 0) + 1).padStart(2, '0')
  const label = data?.link?.label

  return <span>{label ? `${index} · ${label}` : `${itemName} ${index}`}</span>
}
