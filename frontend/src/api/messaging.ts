import { apiFetch } from './client'
import type { ChatMessageDto, ConversationItemDto } from './types'

export function listConversations(): Promise<ConversationItemDto[]> {
  return apiFetch('/api/conversations')
}

export function listMessages(conversationId: number): Promise<ChatMessageDto[]> {
  return apiFetch(`/api/conversations/${conversationId}/messages`)
}

export function sendMessage(conversationId: number, text: string): Promise<ChatMessageDto> {
  return apiFetch(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}

export function getOrCreateConversation(otherUserId: number): Promise<ConversationItemDto> {
  return apiFetch(`/api/conversations/with/${otherUserId}`, { method: 'POST' })
}
