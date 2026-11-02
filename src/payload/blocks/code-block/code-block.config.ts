import type { Block } from 'payload'

import { CODE_LANGUAGE_OPTIONS } from '@/lib/constants/code-languages'

/** Highlighted code with an optional file name, rendered on the server (no client JS). */
export const CodeBlock: Block = {
  slug: 'codeBlock',
  interfaceName: 'CodeBlock',
  labels: { singular: 'Code', plural: 'Code' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'language',
          type: 'select',
          label: 'Language',
          required: true,
          defaultValue: 'tsx',
          options: CODE_LANGUAGE_OPTIONS,
          admin: { width: '50%' },
        },
        {
          name: 'filename',
          type: 'text',
          label: 'File name',
          admin: { width: '50%', description: 'Optional. Shown above the code, e.g. "use-in-viewport.ts".' },
        },
      ],
    },
    {
      name: 'code',
      type: 'code',
      label: 'Code',
      required: true,
      admin: { language: 'typescript' },
    },
    {
      name: 'highlight',
      type: 'text',
      label: 'Highlighted lines',
      admin: { description: 'Optional. Line numbers to emphasize, e.g. "3, 7-9".' },
      validate: (value: string | null | undefined) =>
        !value ||
        /^\s*\d+(\s*-\s*\d+)?(\s*,\s*\d+(\s*-\s*\d+)?)*\s*$/.test(value) ||
        'Use numbers and ranges, e.g. "3, 7-9".',
    },
  ],
}
