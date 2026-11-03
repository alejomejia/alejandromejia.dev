import { CODE_LANGUAGES } from '@/lib/constants/code-languages'

import { CodeLines } from './code-block'
import { CodeGroupFrame } from './code-group-frame'
import type { CodeGroupProps } from './story.types'

/**
 * One or more files in a single code block, with a copy button: one file
 * shows its name, several get tabs. The code is highlighted on the server;
 * only the tabs and the copy button run in the browser.
 *
 * @example
 * <CodeGroup files={[{ filename: 'loop.tsx', language: 'tsx', code }]} labels={COPY.code} />
 */
export function CodeGroup({ files, labels }: CodeGroupProps) {
  if (files.length === 0) return null

  return (
    <CodeGroupFrame
      files={files.map((file) => ({
        filename: file.filename,
        language: CODE_LANGUAGES[file.language],
        code: file.code,
      }))}
      panels={files.map((file) => (
        <CodeLines key={file.filename} code={file.code} language={file.language} highlight={file.highlight} />
      ))}
      labels={labels}
    />
  )
}
