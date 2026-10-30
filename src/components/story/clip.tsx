import { MediaFrame } from './media-frame'
import type { ClipProps } from './story.types'

/** A muted, looping recording in its frame, with an optional caption and the private-project label. */
export function Clip({ media, frame = 'none', private: isPrivate, caption, privateLabel }: ClipProps & { privateLabel: string }) {
  return (
    <figure className="flex flex-col gap-pad-xs">
      <MediaFrame media={media} chrome={frame === 'browser'} />
      {(caption || isPrivate) && (
        <figcaption className="flex flex-wrap justify-between gap-x-4 text-caption text-foreground/60">
          {caption && <span className="text-pretty">{caption}</span>}
          {isPrivate && <span className="font-mono text-micro text-foreground/40">{privateLabel}</span>}
        </figcaption>
      )}
    </figure>
  )
}
