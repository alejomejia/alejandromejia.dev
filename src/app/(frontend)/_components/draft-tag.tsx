/** Marks an unpublished entry where drafts are listed (draft mode, the dev server). */
export function DraftTag({ status, label }: { status?: 'draft' | 'published' | null; label: string }) {
  if (status !== 'draft') return null
  return <span className="font-mono text-micro text-subtle">{label}</span>
}
