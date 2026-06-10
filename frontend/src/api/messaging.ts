import { apiFetch } from './client'
import type { ChatMessageDto, ConversationItemDto, ConversationOfferDto } from './types'

export function listConversations(): Promise<ConversationItemDto[]> {
  return apiFetch('/api/conversations')
}

export function listMessages(conversationId: number): Promise<ChatMessageDto[]> {
  return apiFetch(`/api/conversations/${conversationId}/messages`)
}

export function listConversationOffers(conversationId: number): Promise<ConversationOfferDto[]> {
  return apiFetch(`/api/conversations/${conversationId}/offers`)
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
