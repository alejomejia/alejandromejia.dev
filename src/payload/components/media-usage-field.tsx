import type { UIFieldServerProps } from 'payload'

import { getMediaUsage } from '@/payload/utils/media-usage'

/**
 * Media sidebar: every document or global that shows this file, linked to
 * its editor. Covers count through their video. Drafts are marked.
 */
export async function MediaUsageField({ id, payload }: UIFieldServerProps) {
  // A file being created is used nowhere yet.
  if (id === undefined) return null

  const usage = await getMediaUsage(payload)
  const usages = usage.usages(id)
  const used = usage.isUsed(id)

  return (
    <div className="field-type media-usage">
      <span className="field-label">Used in</span>
      {usages.length === 0 ? (
        <p className="media-usage__empty">Not used anywhere. It is safe to delete.</p>
      ) : (
        <ul className="media-usage__list">
          {usages.map((item) => (
            <li key={item.adminURL}>
              <a href={item.adminURL}>{item.title}</a>
              <span className="media-usage__meta">
                {item.fromMedia ? 'Video cover' : item.type}
                {item.draftOnly ? ' · draft' : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
      {usages.length > 0 && !used && (
        // Only the cover of videos nobody uses: deleted along with them.
        <p className="media-usage__empty">Only used by unused videos. It is safe to delete with them.</p>
      )}
    </div>
  )
}
