/**
 * Generates every raster icon from the single source SVG, so rebranding is:
 * replace `src/app/(frontend)/icon.svg`, run `pnpm generate:icons`, commit.
 *
 * Every output is a full-bleed square: no rounded corners, no transparency.
 * Anything transparent in the source (e.g. rounded corners) is filled with
 * `--bg`, and platforms apply their own masks (iOS, Android adaptive icons).
 *
 * Outputs:
 *   src/app/favicon.ico              16/32/48: legacy browsers, RSS readers, Google results
 *   src/app/(frontend)/apple-icon.png 180 (iOS rounds it itself)
 *   public/icon-192.png, icon-512.png  web manifest `any` icons
 *   public/icon-maskable-512.png       manifest `maskable` icon (logo inside the 80% safe zone)
 *
 * Usage: pnpm generate:icons [--bg "#0a0a0a"]
 *   --bg  square background fill (default #0a0a0a; keep it equal to SITE.themeColor).
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'src/app/(frontend)/icon.svg')

const bgFlag = process.argv.indexOf('--bg')
const background = bgFlag > -1 ? process.argv[bgFlag + 1] : '#0a0a0a'

const svg = await readFile(source)

/**
 * Renders the SVG to an opaque square PNG; `padding` shrinks the logo inside the canvas.
 * `rgba` keeps a (fully opaque) alpha channel, required for PNGs embedded in an ICO.
 */
async function render(size, { padding = 0, rgba = false } = {}) {
  const inner = Math.round(size * (1 - padding * 2))
  // Render at the target density so the SVG stays crisp instead of being upscaled.
  let image = sharp(svg, { density: Math.ceil((72 * inner) / 64) * 2 }).resize(inner, inner)

  if (padding > 0) {
    const offset = Math.round((size - inner) / 2)
    image = sharp({ create: { width: size, height: size, channels: 4, background } })
      .composite([{ input: await image.png().toBuffer(), top: offset, left: offset }])
  }
  // Flatten onto the background so the result is always a solid square.
  image = image.flatten({ background })
  // flatten() drops the alpha channel; ICO entries are declared 32bpp and
  // strict decoders (e.g. Next's image pipeline) reject RGB-only payloads,
  // which makes every route 500 once favicon.ico exists.
  if (rgba) image = image.ensureAlpha()

  return image.png().toBuffer()
}

// sharp can't write .ico, but an ICO is just a directory header followed by
// PNG payloads, which every modern browser and Windows (Vista+) accepts.
async function ico(sizes) {
  const pngs = await Promise.all(sizes.map((size) => render(size, { rgba: true })))
  const header = Buffer.alloc(6 + 16 * pngs.length)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(pngs.length, 4)

  let offset = header.length
  pngs.forEach((png, index) => {
    const entry = 6 + index * 16
    header.writeUInt8(sizes[index] % 256, entry) // width (0 = 256)
    header.writeUInt8(sizes[index] % 256, entry + 1) // height
    header.writeUInt16LE(1, entry + 4) // color planes
    header.writeUInt16LE(32, entry + 6) // bits per pixel
    header.writeUInt32LE(png.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += png.length
  })

  return Buffer.concat([header, ...pngs])
}

const outputs = {
  'src/app/favicon.ico': ico([16, 32, 48]),
  'src/app/(frontend)/apple-icon.png': render(180),
  'public/icon-192.png': render(192),
  'public/icon-512.png': render(512),
  'public/icon-maskable-512.png': render(512, { padding: 0.1 }),
}

for (const [file, buffer] of Object.entries(outputs)) {
  await writeFile(path.join(root, file), await buffer)
  console.log(`✓ ${file}`)
}
