import { Badge } from './Badge'
import { offerStatusLabel } from '../../api/format'

export function offerStatusBadgeVariant(
  status: string,
): 'pending' | 'accepted' | 'rejected' | 'default' {
  if (status === 'PENDING') return 'pending'
  if (status === 'ACCEPTED') return 'accepted'
  if (status === 'REJECTED') return 'rejected'
  return 'default'
}

export function OfferStatusBadge({ status }: { status: string }) {
  return <Badge variant={offerStatusBadgeVariant(status)}>{offerStatusLabel(status)}</Badge>
}
