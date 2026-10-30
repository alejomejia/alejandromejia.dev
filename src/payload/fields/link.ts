import type { Field, GroupField, RowLabelComponent } from 'payload'

import { ROUTABLE_COLLECTIONS } from '@/lib/seo/seo.utils'
import { deepMerge } from '@/lib/utils'

/** Starting values for a new link. They also become the database column defaults. */
type LinkDefaults = {
  type?: 'reference' | 'custom'
  url?: string
  label?: string
}

type LinkOptions = {
  /** E.g. `{ type: 'custom' }` for links that usually point at other sites. */
  defaults?: LinkDefaults
  overrides?: Partial<GroupField>
}

/**
 * Admin row label for an array of {@link link} rows: the link's label, or
 * "<itemName> 01" while it has none.
 * @example admin: { components: { RowLabel: linkRowLabel('Menu link') } }
 */
export function linkRowLabel(itemName: string): RowLabelComponent {
  return { path: '@/payload/components/link-row-label#LinkRowLabel', clientProps: { itemName } }
}

/**
 * Reusable link group: an internal reference (any document with its own page)
 * or a custom URL, with a label and a new-tab toggle. Resolve it with
 * `cmsNavLink()` (`@/lib/cms/links`).
 * @example fields: [link({ defaults: { type: 'custom' } })]
 */
export function link({ defaults = {}, overrides = {} }: LinkOptions = {}): Field {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: { hideGutter: true },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            defaultValue: defaults.type ?? 'reference',
            options: [
              { label: 'Internal link', value: 'reference' },
              { label: 'Custom URL', value: 'custom' },
            ],
            admin: { layout: 'horizontal', width: '50%' },
          },
          {
            name: 'newTab',
            type: 'checkbox',
            label: 'Open in new tab',
            admin: { width: '50%', style: { alignSelf: 'flex-end' } },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'reference',
            type: 'relationship',
            relationTo: ROUTABLE_COLLECTIONS,
            label: 'Document to link to',
            required: true,
            admin: { width: '50%', condition: (_, siblingData) => siblingData?.type === 'reference' },
          },
          {
            name: 'url',
            type: 'text',
            label: 'Custom URL',
            required: true,
            defaultValue: defaults.url,
            admin: {
              width: '50%',
              condition: (_, siblingData) => siblingData?.type === 'custom',
              description: 'A site path (/writing) or a full URL (https://…).',
            },
          },
          {
            name: 'label',
            type: 'text',
            label: 'Label',
            required: true,
            defaultValue: defaults.label,
            admin: { width: '50%' },
          },
        ],
      },
    ],
  }

  return deepMerge(linkResult, overrides)
}
