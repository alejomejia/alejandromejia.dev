import { PayloadRedirects } from '@/components/cms/payload-redirects'

type Args = {
  params: Promise<{ path: string[] }>
}

/** Nothing is prerendered at build: unknown URLs resolve on request. */
export function generateStaticParams() {
  return []
}

/**
 * Every URL no other route claims. A redirect managed in the admin
 * (Redirects) sends it on; anything else renders the 404 page.
 */
export default async function UnmatchedPage({ params }: Args) {
  const { path } = await params
  return <PayloadRedirects url={`/${path.map((segment) => decodeURIComponent(segment)).join('/')}`} />
}
