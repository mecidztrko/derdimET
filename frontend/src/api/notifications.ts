import { apiFetch } from './client'

export type NotificationSummaryDto = {
  pendingOffers: number
  pendingIncoming: number
  pendingPurchaseOffers: number
  unreadMessages: number
  primaryLink: string
}

export type NotificationInboxItemDto = {
  id: number
  type: 'OFFER' | 'MESSAGE' | 'LISTING' | 'PAYMENT' | 'SYSTEM'
  title: string
  body: string | null
  link: string | null
  read: boolean
  createdAt: string
}

export function getNotificationSummary(): Promise<NotificationSummaryDto> {
  return apiFetch('/api/notifications/summary')
}

export function listNotificationInbox(params?: {
  type?: NotificationInboxItemDto['type']
  unreadOnly?: boolean
}): Promise<NotificationInboxItemDto[]> {
  const q = new URLSearchParams()
  if (params?.type) q.set('type', params.type)
  if (params?.unreadOnly) q.set('unreadOnly', 'true')
  const suffix = q.toString() ? `?${q}` : ''
  return apiFetch(`/api/notifications/inbox${suffix}`)
}

export function getInboxUnreadCount(): Promise<{ count: number }> {
  return apiFetch('/api/notifications/inbox/unread-count')
}

export function markNotificationRead(id: number): Promise<void> {
  return apiFetch(`/api/notifications/inbox/${id}/read`, { method: 'POST' })
}

export function markAllNotificationsRead(): Promise<{ updated: number }> {
  return apiFetch('/api/notifications/inbox/read-all', { method: 'POST' })
}
