import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardContent } from './Card'
import { Input } from './Input'
import { Button } from './Button'
import { PageState } from './PageState'
import { ArrowLeft, MessageCircle, Search, Send } from 'lucide-react'
import { ApiError } from '../../api/client'
import { useApi } from '../../hooks/useApi'
import { useMe } from '../../hooks/useMe'
import * as messagingApi from '../../api/messaging'
import { EMAIL_VERIFICATION_REQUIRED, requiresEmailVerification } from '../../lib/emailVerification'
import { EmailVerificationNotice } from './EmailVerificationNotice'
import type { ChatMessageDto } from '../../api/types'
import { formatRelativeTr } from '../../api/format'

type MessagesLocationState = {
  conversationId?: number
  otherUserId?: number
  contextLabel?: string
}

export function MessagesInbox() {
  const { user } = useMe()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [sending, setSending] = useState(false)
  const [contextLabel, setContextLabel] = useState<string | null>(null)
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const messagingBlocked = requiresEmailVerification(user)

  const convQuery = useApi(() => messagingApi.listConversations(), [])
  const conversations = convQuery.data ?? []
  const filtered = conversations.filter((c) =>
    (c.otherUserName ?? c.otherUserEmail ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const selected = conversations.find((c) => c.conversationId === selectedId) ?? filtered[0] ?? null

  useEffect(() => {
    if (!selectedId && filtered[0]?.conversationId) setSelectedId(filtered[0].conversationId)
  }, [filtered, selectedId])

  useEffect(() => {
    const state = location.state as MessagesLocationState | null
    if (!state) {
      setContextLabel(null)
      return
    }
    setContextLabel(state.contextLabel ?? null)
    if (state.conversationId) {
      setSelectedId(state.conversationId)
      setMobileShowChat(true)
      return
    }
    if (state.otherUserId && !messagingBlocked) {
      void messagingApi.getOrCreateConversation(state.otherUserId).then((conv) => {
        setSelectedId(conv.conversationId)
        setMobileShowChat(true)
        convQuery.reload()
      })
    }
  }, [location.state, messagingBlocked])

  const loadMessages = useCallback(async (conversationId: number) => {
    setMessagesLoading(true)
    try {
      setMessages(await messagingApi.listMessages(conversationId))
    } catch {
      setMessages([])
    } finally {
      setMessagesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selected?.conversationId) loadMessages(selected.conversationId)
  }, [selected?.conversationId, loadMessages])

  async function handleSend() {
    if (!selected?.conversationId || !messageInput.trim()) return
    if (messagingBlocked) {
      setSendError(EMAIL_VERIFICATION_REQUIRED)
      return
    }
    setSending(true)
    setSendError(null)
    try {
      const msg = await messagingApi.sendMessage(selected.conversationId, messageInput.trim())
      setMessages((prev) => [...prev, msg])
      setMessageInput('')
      convQuery.reload()
    } catch (err) {
      setSendError(err instanceof ApiError ? err.message : 'Mesaj gönderilemedi')
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="h-[calc(100vh-280px)] min-h-[600px]">
      <CardContent className="p-0 h-full">
        <PageState loading={convQuery.loading} error={convQuery.error} onRetry={convQuery.reload}>
          <div className="flex h-full">
            <div
              className={`w-full md:w-80 border-r border-border flex-col ${
                mobileShowChat ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div className="p-4 border-b border-border">
                <Input
                  type="search"
                  placeholder="Kişi ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">Konuşma yok</p>
                ) : (
                  filtered.map((c) => (
                    <button
                      key={c.conversationId}
                      type="button"
                      onClick={() => {
                        setSelectedId(c.conversationId)
                        setMobileShowChat(true)
                      }}
                      className={`w-full p-4 border-b border-border hover:bg-muted/50 text-left ${
                        selected?.conversationId === c.conversationId ? 'bg-primary-soft' : ''
                      }`}
                    >
                      <p className="font-medium truncate">
                        {c.otherUserName || c.otherUserEmail || 'Kullanıcı'}
                      </p>
                      <p className="text-caption text-muted-foreground">
                        {formatRelativeTr(c.lastMessageAt)}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className={`flex-1 flex-col ${mobileShowChat ? 'flex' : 'hidden md:flex'}`}>
              {selected ? (
                <>
                  <div className="p-4 border-b border-border flex items-start gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="md:hidden flex-shrink-0"
                      aria-label="Konuşma listesine dön"
                      onClick={() => setMobileShowChat(false)}
                    >
                      <ArrowLeft className="size-5" />
                    </Button>
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {selected.otherUserName || selected.otherUserEmail || 'Kullanıcı'}
                      </p>
                      {contextLabel ? (
                        <p className="text-caption text-muted-foreground mt-1">İlgili: {contextLabel}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                      <p className="text-sm text-muted-foreground">Yükleniyor…</p>
                    ) : (
                      messages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2.5 text-small ${
                              m.senderId === user?.id ? 'bg-primary text-white' : 'bg-muted'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t border-border space-y-2">
                    {messagingBlocked ? <EmailVerificationNotice /> : null}
                    {sendError ? <p className="text-xs text-destructive">{sendError}</p> : null}
                    <div className="flex gap-2">
                      <Input
                        placeholder={messagingBlocked ? 'Önce e-postanızı doğrulayın' : 'Mesajınızı yazın...'}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') void handleSend()
                        }}
                        disabled={messagingBlocked}
                        className="flex-1"
                      />
                      <Button
                        variant="primary"
                        onClick={() => void handleSend()}
                        disabled={sending || messagingBlocked}
                      >
                        <Send className="size-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-muted-foreground">
                  Bir konuşma seçin
                </div>
              )}
            </div>
            {!mobileShowChat && !selected ? (
              <div className="flex md:hidden flex-1 items-center justify-center text-muted-foreground">
                <MessageCircle className="size-12" />
              </div>
            ) : null}
          </div>
        </PageState>
      </CardContent>
    </Card>
  )
}
