import { formatDateTr } from '../../api/format'

export function OfferRevisionMeta({
  revisionNumber,
  expiresAt,
}: {
  revisionNumber?: number | null
  expiresAt?: string | null
}) {
  const parts: string[] = []
  if (revisionNumber != null) parts.push(`Revizyon ${revisionNumber}`)
  if (expiresAt) parts.push(`Son: ${formatDateTr(expiresAt)}`)
  if (parts.length === 0) return null
  return <p className="text-caption text-muted-foreground">{parts.join(' · ')}</p>
}
