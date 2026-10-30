'use client'

import { useAllFormFields, useConfig, useDocumentInfo, useForm, useTranslation } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import { useEffect, useState } from 'react'

/**
 * The SEO tab's search-result preview, replacing the SEO plugin's own. The
 * plugin's version posts the document's whole form state to
 * `/plugin-seo/generate-url`, including each array row's rendered admin
 * row label, which `JSON.stringify` can't serialize ("Converting circular
 * structure to JSON") on documents with labelled arrays, like case studies.
 * This one posts only what `generateURL` reads: the document and where it
 * belongs.
 */
export function SeoPreview() {
  // The plugin registers its translation keys, not our own types.
  const { t } = useTranslation<object, 'plugin-seo:preview' | 'plugin-seo:previewDescription'>()
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const [fields] = useAllFormFields()
  const { getData } = useForm()
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const [href, setHref] = useState<string>()

  const metaTitle = fields['meta.title']?.value as string | undefined
  const metaDescription = fields['meta.description']?.value as string | undefined

  // Fetched once per document view, like the plugin's: the URL rarely changes while editing.
  useEffect(() => {
    if (href) return
    const controller = new AbortController()
    void (async () => {
      try {
        const response = await fetch(formatAdminURL({ apiRoute: api, path: '/plugin-seo/generate-url' }), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            id,
            collectionSlug,
            globalSlug,
            doc: getData(),
          }),
        })
        const { result } = (await response.json()) as { result?: string }
        setHref(result)
      } catch {
        // Aborted on unmount, or the endpoint failed: the preview keeps its placeholder URL.
      }
    })()
    return () => controller.abort()
  }, [api, collectionSlug, getData, globalSlug, href, id])

  // Same look as the plugin's preview; the classes live in `app/(payload)/custom.scss`.
  return (
    <div className="seo-preview">
      <div>{t('plugin-seo:preview')}</div>
      <div className="seo-preview__description">{t('plugin-seo:previewDescription')}</div>
      <div className="seo-preview__card">
        <div>
          <a href={href}>{href || 'https://...'}</a>
        </div>
        <h4>{metaTitle}</h4>
        <p>{metaDescription}</p>
      </div>
    </div>
  )
}
