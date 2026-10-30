'use client'

import { useRowLabel } from '@payloadcms/ui'

type TextRowLabelProps = {
  /** The row's text field to show, e.g. `word`. */
  field: string
  /** Names a row whose field is still empty, e.g. "Word" → "Word 02". */
  itemName: string
}

/**
 * Admin row label for arrays of short text rows: "01 · Retreat" instead of
 * the generic "Row". Wire it with `textRowLabel()` from
 * `@/payload/fields/row-labels`.
 */
export function TextRowLabel({ field, itemName }: TextRowLabelProps) {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()
  const index = String((rowNumber ?? 0) + 1).padStart(2, '0')
  const value = data?.[field]

  return <span>{typeof value === 'string' && value ? `${index} · ${value}` : `${itemName} ${index}`}</span>
}
