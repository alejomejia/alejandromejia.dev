const XML_ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }

/**
 * Escapes text for an XML element or attribute (feeds, sitemaps).
 * @example escapeXML('Tom & Jerry <3') // 'Tom &amp; Jerry &lt;3'
 */
export function escapeXML(text: string): string {
  return text.replace(/[&<>"']/g, (character) => XML_ENTITIES[character])
}
