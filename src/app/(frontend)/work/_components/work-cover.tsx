import { DOT_TEXTURE_CLASSNAME, MediaFrame } from '@/components/story/media-frame'
import type { MediaSource } from '@/lib/cms/media'
import { cn } from '@/lib/utils'

/**
 * A case study's cover in its frame (see `MediaFrame`). Until there is a
 * recording, the dot texture darkens a little while its row is hovered
 * (`group`).
 */
export function WorkCover({ cover }: { cover?: MediaSource }) {
  return (
    <MediaFrame media={cover}>
      <div aria-hidden className={cn(DOT_TEXTURE_CLASSNAME, 'transition-colors duration-250 group-hover:text-foreground/20')} />
    </MediaFrame>
  )
}
