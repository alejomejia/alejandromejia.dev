import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

/**
 * Builds an `afterChange` hook that busts the Next.js cache tag for a global
 * (`global_<slug>`), so edits to Header/Footer/Site settings show up on the next visit.
 * Skipped when `req.context.disableRevalidate` is set (e.g. during seeding).
 */
export function buildGlobalRevalidateHook(slug: string): GlobalAfterChangeHook {
  return function revalidateGlobal({ doc, req: { payload, context } }) {
    if (!context.disableRevalidate) {
      payload.logger.info(`Revalidating global: ${slug}`)
      // `expire: 0` instead of the usual `'max'`, as in `revalidateSite()`: with
      // `'max'` the next visit still gets the old global once while it
      // regenerates, so an edit only showed on the second reload.
      revalidateTag(`global_${slug}`, { expire: 0 })
    }
    return doc
  }
}
