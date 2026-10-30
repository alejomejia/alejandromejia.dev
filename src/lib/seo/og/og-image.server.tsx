import 'server-only'

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

import { getServerSideURL } from '@/lib/utils'

import { SHARE_CARD_LIMITS, SITE } from '../seo.const'

import type { OgCard } from './og-cards'

/** Share image size: the 1.91:1 card every platform shows in full. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const

const ASSETS = join(process.cwd(), 'src/lib/seo/og')
const COLORS = { background: '#0f0f0f', foreground: '#ededed' }

// Read once per server: the shape is the home page's halftone loop, drawn once
// (as on the LinkedIn cover), since the image renderer can't run a canvas.
const assets = Promise.all([
  readFile(join(ASSETS, 'og-shape.png')),
  readFile(join(ASSETS, 'Geist-Regular.ttf')),
  readFile(join(ASSETS, 'Geist-Medium.ttf')),
  readFile(join(ASSETS, 'GeistMono-Regular.ttf')),
])

/**
 * Long titles step down so a title at the CMS limit
 * (`SHARE_CARD_LIMITS.title`) still fits three lines beside the shape.
 */
function titleSize(title: string): number {
  if (title.length > SHARE_CARD_LIMITS.title - 12) return 52
  if (title.length > 30) return 60
  return 72
}

/**
 * Renders a share image in the site's card design: the label in mono, the
 * title and description on the left, the halftone shape on the right, and the
 * name and domain at the bottom. The general image (`public/og-image.png`) is
 * the same design with the headline.
 */
export async function renderOgImage({ label, title, description }: OgCard): Promise<ImageResponse> {
  const [shape, regular, medium, mono] = await assets
  const size = titleSize(title)
  const byline = `${SITE.name} · ${new URL(getServerSideURL()).host}`

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          background: COLORS.background,
          color: COLORS.foreground,
          fontFamily: 'Geist',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain elements, not next/image. */}
        <img
          src={`data:image/png;base64,${shape.toString('base64')}`}
          width={OG_IMAGE_SIZE.width}
          height={OG_IMAGE_SIZE.height}
          alt=""
          style={{ position: 'absolute', inset: 0 }}
        />
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 0,
            bottom: 0,
            width: 620,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          {/* Every line is clamped, so text the CMS didn't cap (the mock, a long
              case study name in a chapter's label) ends in an ellipsis instead
              of running into the shape or the byline. */}
          <div style={{ display: 'block', lineClamp: 1, fontFamily: 'Geist Mono', fontSize: 20, letterSpacing: 0.4, opacity: 0.55 }}>
            {label}
          </div>
          <div
            style={{
              display: 'block',
              lineClamp: 3,
              fontSize: size,
              fontWeight: 500,
              letterSpacing: -0.03 * size,
              lineHeight: 1.04,
            }}
          >
            {title}
          </div>
          {description && (
            <div style={{ display: 'block', lineClamp: 3, fontSize: 26, lineHeight: 1.35, letterSpacing: -0.26, opacity: 0.6 }}>
              {description}
            </div>
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 80,
            bottom: 56,
            fontFamily: 'Geist Mono',
            fontSize: 20,
            letterSpacing: 0.4,
            opacity: 0.55,
          }}
        >
          {byline}
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        { name: 'Geist', data: regular, weight: 400, style: 'normal' },
        { name: 'Geist', data: medium, weight: 500, style: 'normal' },
        { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  )
}
