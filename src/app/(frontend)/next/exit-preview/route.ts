import { draftMode } from 'next/headers'

/** Disables draft mode, ending a live-preview session. */
export async function GET(): Promise<Response> {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode is disabled')
}
