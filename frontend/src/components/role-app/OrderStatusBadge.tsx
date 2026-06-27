import { Badge } from './Badge'
import { orderStatusLabel } from '../../api/format'

export function orderStatusBadgeVariant(
  status: string,
): 'success' | 'pending' | 'destructive' | 'default' {
  if (status === 'COMPLETED') return 'success'
  if (status === 'PAYMENT_PENDING' || status === 'PENDING') return 'pending'
  if (status === 'PAYMENT_CONFIRMED') return 'default'
  if (status === 'CANCELLED') return 'destructive'
  return 'default'
}

export function OrderStatusBadge({ status }: { status: string }) {
  return <Badge variant={orderStatusBadgeVariant(status)}>{orderStatusLabel(status)}</Badge>
}
