import type { JsonLdNode } from '@/lib/seo/json-ld'

/**
 * Renders schema.org structured data as a JSON-LD `<script>`.
 * @example <JsonLd data={writingJsonLd(entry)} />
 */
export function JsonLd({ data }: { data: JsonLdNode }) {
  return (
    <script
      type="application/ld+json"
      // CMS strings end up in here; escaping `<` stops a `</script>` in the
      // content from breaking out of the tag (XSS).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
