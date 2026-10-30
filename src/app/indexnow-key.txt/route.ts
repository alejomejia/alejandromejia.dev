/**
 * `/indexnow-key.txt`: serves `INDEXNOW_KEY` so IndexNow can verify that
 * submissions come from the site owner. 404 when IndexNow isn't configured.
 */
export function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!key) return new Response('Not found', { status: 404 })

  return new Response(key, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
