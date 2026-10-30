'use client'

import type { DefaultCellComponentProps } from 'payload'
import { formatFilesize } from 'payload/shared'

/**
 * Media list cell for the stored byte count: "38.2KB", "1.4MB", like the edit
 * view, so heavy files stand out without doing the math.
 */
export function FileSizeCell({ cellData }: DefaultCellComponentProps) {
  return <span>{typeof cellData === 'number' ? formatFilesize(cellData, 1) : ''}</span>
}
