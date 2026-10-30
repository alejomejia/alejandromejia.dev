'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

import { getClientSideURL } from '@/lib/utils'

/**
 * Refreshes the route when Payload saves during a live-preview session.
 * Render only when draft mode is enabled.
 */
export function LivePreviewListener() {
  const router = useRouter()
  return <RefreshRouteOnSave refresh={router.refresh} serverURL={getClientSideURL()} />
}
