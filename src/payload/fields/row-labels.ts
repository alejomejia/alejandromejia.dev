import type { RowLabelComponent } from 'payload'

/**
 * Array `RowLabel` that shows one text field of the row ("01 · Retreat"),
 * or "<itemName> 02" while it is empty.
 * @example admin: { components: { RowLabel: textRowLabel('word', 'Word') } }
 */
export function textRowLabel(field: string, itemName: string): RowLabelComponent {
  return { path: '@/payload/components/text-row-label#TextRowLabel', clientProps: { field, itemName } }
}
