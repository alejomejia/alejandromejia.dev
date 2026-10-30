import type { TextFieldSingleValidation } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  UnderlineFeature,
  lexicalEditor,
  type LinkFields,
} from '@payloadcms/richtext-lexical'

import { ROUTABLE_COLLECTIONS } from '@/lib/seo/seo.utils'

/**
 * Baseline rich-text editor shared by the config and inherited by every
 * `richText` field. Individual fields extend `rootFeatures` to add headings,
 * toolbars, blocks, etc. Internal links resolve to any document with its own page.
 */
export const defaultLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature({
      enabledCollections: ROUTABLE_COLLECTIONS,
      fields: ({ defaultFields }) => {
        const fieldsWithoutUrl = defaultFields.filter(
          (field) => !('name' in field && field.name === 'url'),
        )

        return [
          ...fieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            validate: ((value, options) => {
              // Internal links carry a reference, not a URL, so skip validation.
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') return true
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),
  ],
})
