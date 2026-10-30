import { execFile } from 'child_process'
import { randomUUID } from 'crypto'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { promisify } from 'util'

import {
  APIError,
  type CollectionAfterOperationHook,
  type CollectionBeforeOperationHook,
  type File,
  type PayloadRequest,
} from 'payload'

const run = promisify(execFile)

const MB = 1024 * 1024

/**
 * What editors may upload to Media. Enforced here, and listed on the Media
 * screen. payload.config.ts sizes the request parser to `videoBytes`.
 */
export const MEDIA_LIMITS = {
  imageBytes: 30 * MB,
  videoBytes: 300 * MB,
  videoSeconds: 60,
}

// 1080p on the longest side: the sharpness ceiling for web video, at a quarter
// of 4K's pixels.
const VIDEO_MAX_SIZE = 1920
const VIDEO_MAX_FPS = 60
// x264 constant quality: lower is better, ~18 is visually lossless.
const VIDEO_CRF = '20'
// A web-ready upload (8-bit SDR H.264 within the size and frame-rate caps) at
// or under this bitrate is only remuxed: re-encoding would cost quality and
// save little.
const VIDEO_PASSTHROUGH_MAX_BITRATE = 10_000_000
// HDR transfer functions: PQ, and HLG (what iPhones record by default).
const HDR_TRANSFERS = new Set(['smpte2084', 'arib-std-b67'])
// Far more than a 60 s clip needs; a stuck ffmpeg must not hold the request forever.
const FFMPEG_TIMEOUT_MS = 10 * 60_000
// `req.context` key listing the upload's temp files, for cleanUpMediaUpload.
const TEMP_FILES = 'mediaUploadTempFiles'

type VideoInfo = {
  codec: string
  pixelFormat: string
  width: number
  height: number
  fps: number
  /** Bits per second; 0 when the file doesn't say. */
  bitrate: number
  /** Seconds; 0 when the file doesn't say. */
  duration: number
  hdr: boolean
}

/**
 * Enforces {@link MEDIA_LIMITS} and optimizes videos before Payload stores
 * them. Images need nothing here: the collection's `resizeOptions` and
 * `formatOptions` convert them. `beforeOperation` is the only hook that sees
 * the raw upload before Payload measures it and hands it to storage.
 */
export const processMediaUpload: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  const { file } = req
  if ((operation !== 'create' && operation !== 'update') || !file) return args
  // This runs before Payload's access check: never spend CPU on an upload that
  // check is about to reject.
  if (!req.user && !args.overrideAccess) return args

  if (file.tempFilePath) trackTempFile(req, file.tempFilePath)
  req.file = { ...file, name: slugifyFilename(file.name) }
  if (file.mimetype.startsWith('image/')) assertMaxSize(file, MEDIA_LIMITS.imageBytes, 'Images')
  if (file.mimetype.startsWith('video/')) {
    const video = await optimizeVideo(req.file, req)
    req.file = video
    // Every new video file gets a fresh poster: the old one shows another clip.
    const data = (args as { data?: Record<string, unknown> }).data
    const poster = await createPoster(video, data, req)
    if (data && poster) data.poster = poster
  }
  return args
}

/**
 * Deletes the upload's temp files. Payload deletes `req.file`'s itself, right
 * after this hook, but with R2 the storage plugin has cleared `req.file` by
 * then, so every upload would stay in the temp folder.
 */
export const cleanUpMediaUpload: CollectionAfterOperationHook = async ({ req, result }) => {
  const paths = req.context[TEMP_FILES] as string[] | undefined
  // Leave Payload's to Payload: its delete fails the operation if the file is gone.
  const leftovers = paths?.filter((tempFile) => tempFile !== req.file?.tempFilePath) ?? []
  await Promise.all(leftovers.map((tempFile) => fs.rm(tempFile, { force: true })))
  return result
}

/**
 * `Señal del Río.MOV` → `senal-del-rio.mov`: lowercase ASCII words joined by
 * dashes, so every stored file gets a clean, predictable URL.
 */
export function slugifyFilename(filename: string) {
  const { name, ext } = path.parse(filename)
  const slug = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // accents: "í" decomposes to "i" + a combining mark
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug || 'file'}${ext.toLowerCase().replace(/[^.a-z0-9]/g, '')}`
}

function trackTempFile(req: PayloadRequest, tempFile: string) {
  req.context[TEMP_FILES] = [...((req.context[TEMP_FILES] as string[] | undefined) ?? []), tempFile]
}

function assertMaxSize(file: File, maxBytes: number, kind: 'Images' | 'Videos') {
  if (file.size > maxBytes) {
    throw new APIError(`${kind} can be up to ${maxBytes / MB} MB. This one is ${Math.ceil(file.size / MB)} MB.`, 413)
  }
}

/**
 * Re-encodes a video for the web: H.264 MP4 (plays everywhere) that fits in
 * 1920×1920 at up to 60 fps, with HDR tone-mapped to SDR. Sound, subtitles
 * and metadata (e.g. GPS) are dropped. An upload that is already web-ready is
 * remuxed instead, keeping its exact quality.
 */
async function optimizeVideo(file: File, req: PayloadRequest): Promise<File> {
  assertMaxSize(file, MEDIA_LIMITS.videoBytes, 'Videos')

  // With `useTempFiles` the upload is already on disk; a Local API upload
  // arrives as a buffer.
  const input = file.tempFilePath || tempPath()
  if (!file.tempFilePath) await fs.writeFile(input, file.data)
  const output = tempPath('.mp4')

  try {
    const video = await probeVideo(input, req)
    if (video.duration > MEDIA_LIMITS.videoSeconds) {
      throw new APIError(
        `Videos can be up to ${MEDIA_LIMITS.videoSeconds} seconds long. This one is ${Math.ceil(video.duration)} seconds.`,
        400,
      )
    }

    const toneMap = video.hdr && (await hasZscale(req))
    if (video.hdr && !toneMap) {
      req.payload.logger.warn('Media upload: HDR video kept its HDR colors, this ffmpeg has no zscale filter')
    }

    await runTool(
      'ffmpeg',
      [
        '-hide_banner', '-loglevel', 'error', '-nostdin', '-y',
        '-i', input,
        // The main video track alone: no sound, subtitles, data tracks or metadata.
        '-map', '0:V:0', '-map_metadata', '-1', '-map_chapters', '-1',
        ...encodeArgs(video, toneMap),
        // Index at the front, so playback starts before the download ends.
        '-movflags', '+faststart',
        output,
      ],
      req,
    )
  } catch (error) {
    await fs.rm(output, { force: true })
    throw error
  } finally {
    // An upload's own temp file is cleaned up with the operation.
    if (!file.tempFilePath) await fs.rm(input, { force: true })
  }

  // The output replaces the upload, so the original can go now.
  if (file.tempFilePath) await fs.rm(file.tempFilePath, { force: true })
  trackTempFile(req, output)
  const { size } = await fs.stat(output)
  return {
    ...file,
    data: Buffer.alloc(0),
    mimetype: 'video/mp4',
    name: `${path.parse(file.name).name}.mp4`,
    size,
    tempFilePath: output,
  }
}

/**
 * Saves the video's first frame to Media (so it gets WebP and the image sizes)
 * and returns its id. A failure only logs: the video still uploads, without
 * a poster.
 */
async function createPoster(video: File, data: Record<string, unknown> | undefined, req: PayloadRequest) {
  const frame = tempPath('.png')
  try {
    // PNG, so the WebP conversion is the only lossy step.
    await runTool('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-i', video.tempFilePath!, '-frames:v', '1', frame], req)
    const buffer = await fs.readFile(frame)
    // Not `req`: a nested create on the same request would swap out `req.file`,
    // the video being uploaded. It saves in its own transaction instead.
    const poster = await req.payload.create({
      collection: 'media',
      data: { alt: typeof data?.alt === 'string' ? data.alt : '', folder: data?.folder as number | undefined },
      file: { data: buffer, mimetype: 'image/png', name: `${path.parse(video.name).name}-cover.png`, size: buffer.length },
      context: { disableRevalidate: true },
    })
    return poster.id
  } catch (error) {
    req.payload.logger.warn(`Media upload: could not create the video poster: ${error}`)
    return undefined
  } finally {
    await fs.rm(frame, { force: true })
  }
}

function encodeArgs(video: VideoInfo, toneMap: boolean): string[] {
  const webReady =
    video.codec === 'h264' &&
    video.pixelFormat === 'yuv420p' &&
    !video.hdr &&
    Math.max(video.width, video.height) <= VIDEO_MAX_SIZE &&
    video.fps <= VIDEO_MAX_FPS &&
    video.bitrate > 0 &&
    video.bitrate <= VIDEO_PASSTHROUGH_MAX_BITRATE
  if (webReady) return ['-c:v', 'copy']

  const filters = [
    // Never upscales, keeps the aspect ratio, and keeps both sides even (H.264 needs it).
    `scale=w='min(${VIDEO_MAX_SIZE},iw)':h='min(${VIDEO_MAX_SIZE},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`,
  ]
  if (video.fps > VIDEO_MAX_FPS) filters.push(`fps=${VIDEO_MAX_FPS}`)
  if (toneMap) {
    filters.push(
      'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p',
    )
  }

  return [
    '-vf', filters.join(','),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', VIDEO_CRF, '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    ...(toneMap ? ['-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709'] : []),
  ]
}

async function probeVideo(input: string, req: PayloadRequest): Promise<VideoInfo> {
  const { stdout } = await runTool(
    'ffprobe',
    [
      '-v', 'error',
      // `V` skips cover art, which ffprobe also lists as a video stream.
      '-select_streams', 'V:0',
      '-show_entries', 'stream=codec_name,pix_fmt,width,height,avg_frame_rate,bit_rate,color_transfer:format=duration,bit_rate',
      '-of', 'json',
      input,
    ],
    req,
  )
  const { streams = [], format = {} } = JSON.parse(stdout)
  const stream = streams[0]
  if (!stream) throw new APIError('This file has no video track.', 400)

  const [frames, seconds] = String(stream.avg_frame_rate).split('/').map(Number)
  return {
    codec: stream.codec_name,
    pixelFormat: stream.pix_fmt,
    width: stream.width,
    height: stream.height,
    fps: seconds ? frames / seconds : 0,
    // Falls back to the whole file's bitrate (a high guess, so it errs toward re-encoding).
    bitrate: Number(stream.bit_rate ?? format.bit_rate) || 0,
    duration: Number(format.duration) || 0,
    hdr: HDR_TRANSFERS.has(stream.color_transfer),
  }
}

let zscaleCheck: Promise<boolean> | undefined

/** HDR tone mapping needs zscale. Alpine's ffmpeg has it, Homebrew's doesn't. */
function hasZscale(req: PayloadRequest) {
  zscaleCheck ??= runTool('ffmpeg', ['-hide_banner', '-filters'], req).then(
    ({ stdout }) => /\bzscale\b/.test(stdout),
    () => false,
  )
  return zscaleCheck
}

/** Runs ffmpeg or ffprobe. Editors get a readable error, the log gets the details. */
async function runTool(command: 'ffmpeg' | 'ffprobe', args: string[], req: PayloadRequest) {
  try {
    return await run(command, args, { maxBuffer: 10 * MB, timeout: FFMPEG_TIMEOUT_MS, killSignal: 'SIGKILL' })
  } catch (error) {
    const { code, stderr } = error as NodeJS.ErrnoException & { stderr?: string }
    req.payload.logger.error(`Media upload: ${command} failed: ${stderr || error}`)
    if (code === 'ENOENT') {
      throw new APIError('Videos cannot be processed: ffmpeg is not installed on the server.', 500, null, true)
    }
    throw new APIError('This video could not be processed. Export it as an MP4 and try again.', 422)
  }
}

function tempPath(extension = '') {
  return path.join(os.tmpdir(), `media-${randomUUID()}${extension}`)
}
