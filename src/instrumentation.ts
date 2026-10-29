/**
 * Runs once when the Next.js server starts (dev and production, never during
 * `next build`), before it handles any request.
 */
export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  // Next 16.3 stamps cache revalidations with `Date.now()` but checks them
  // against `performance.timeOrigin + performance.now()`. Once the wall clock
  // steps ahead of the process's monotonic clock (NTP sync, VM resume, laptop
  // sleep), every revalidation looks like it's in the future and is ignored,
  // so published edits never reach the site. Pinning `performance.now()` to
  // the wall clock puts both on one clock. Remove once fixed upstream:
  // https://github.com/vercel/next.js/issues/99329
  performance.now = function now() {
    return Date.now() - performance.timeOrigin
  }
}
