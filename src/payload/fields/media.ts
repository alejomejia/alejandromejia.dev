import type { Condition, Field, UploadField, Where } from 'payload'

const IMAGE: Where = { mimeType: { contains: 'image/' } }
const IMAGE_OR_VIDEO: Where = { or: [IMAGE, { mimeType: { contains: 'video/' } }] }

type ImageOrVideoOptions = {
  required?: boolean
  /** Hint under the upload, saying where it shows on the site. */
  description?: string
  /**
   * Adds a block-level cover for videos. Every video already has its own
   * (its first frame, set on upload), so only add it where a block needs a
   * different one.
   */
  cover?: boolean
  /**
   * Adds the "Load first" switch, defaulting to this value. Leave it out for
   * media that never sits at the top of a page.
   */
  loadFirst?: boolean
}

/**
 * An image or video from Media, as the fields of a group. Read the group with
 * `cmsImageOrVideo()` and render it with `<CoverMedia>`.
 *
 * @example
 * { name: 'background', type: 'group', fields: imageOrVideo({ required: true, loadFirst: true }) }
 */
export function imageOrVideo({
  required = false,
  description,
  cover = false,
  loadFirst,
}: ImageOrVideoOptions = {}): Field[] {
  const fields: Field[] = [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Image or video',
      required,
      // Hides other files in the picker, and is checked again on save.
      filterOptions: IMAGE_OR_VIDEO,
      admin: { description },
    },
  ]

  if (cover) {
    fields.push({
      // Stored as `poster`, the HTML name for a video's cover.
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Video cover',
      filterOptions: IMAGE,
      admin: {
        description:
          'Only used with a video. Every video gets an automatic cover from its first frame; leave this empty to use it, or upload or pick an image to use a different cover here. Shown while the video loads and to visitors who turn off motion.',
      },
    })
  }

  if (loadFirst !== undefined) {
    fields.push({
      name: 'loadFirst',
      type: 'checkbox',
      label: 'Load first',
      defaultValue: loadFirst,
      admin: {
        description:
          'Turn on when this is the first thing visitors see at the top of the page: it loads before everything else, so the page appears faster. Use it on one image or video per page. Dev note: marks the LCP (Largest Contentful Paint) element. Images load eagerly at high fetch priority, videos preload in full.',
      },
    })
  }

  return fields
}

type ImageOptions = {
  name: string
  label: string
  required?: boolean
  /** Hint under the upload, saying where the image shows on the site. */
  description?: string
  /** Width inside a `row`, e.g. `'50%'`. */
  width?: string
  /** Shows the field only when this returns true, e.g. for one format of a document. */
  condition?: Condition
}

/**
 * One image from Media (videos are hidden from the picker). Read it with
 * `cmsImage()`.
 *
 * @example image({ name: 'image', label: 'Image', required: true })
 */
export function image({ name, label, required = false, description, width, condition }: ImageOptions): UploadField {
  return {
    name,
    type: 'upload',
    relationTo: 'media',
    label,
    required,
    filterOptions: IMAGE,
    admin: { description, width, condition },
  }
}

type ImagesOptions = {
  name: string
  label: string
  required?: boolean
  /** Hint under the upload, saying where the images show on the site. */
  description?: string
  /** Fewest images it takes. Set it to `maxRows` too for an exact count. */
  minRows?: number
  /** Most images it takes; the bulk uploader is capped at it too. */
  maxRows?: number
}

/**
 * Several images from Media in one field, in order. Editors drop many files
 * at once (Payload's bulk uploader), tick several in the library picker and
 * drag them to reorder, instead of filling one upload per image. Read it
 * with `cmsImages()`.
 *
 * @example images({ name: 'images', label: 'Images', required: true, minRows: 10, maxRows: 10 })
 */
export function images({ name, label, required = false, description, minRows, maxRows }: ImagesOptions): UploadField {
  return {
    name,
    type: 'upload',
    relationTo: 'media',
    hasMany: true,
    label,
    required,
    minRows,
    maxRows,
    filterOptions: IMAGE,
    admin: { description },
  }
}
