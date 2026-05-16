import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { ApiError } from '../../api/client'
import { getOrCreateConversation } from '../../api/messaging'
import { useMe } from '../../hooks/useMe'
import { EMAIL_VERIFICATION_REQUIRED, requiresEmailVerification } from '../../lib/emailVerification'
import { messagesPathForRole } from '../../lib/messagesPath'
import { Button } from './Button'

type MessageUserButtonProps = {
  otherUserId: number | null | undefined
  contextLabel?: string
  label?: string
  size?: 'sm' | 'default'
}

export function MessageUserButton({
  otherUserId,
  contextLabel,
  label = 'Mesaj',
  size = 'sm',
}: MessageUserButtonProps) {
  const navigate = useNavigate()
  const { user } = useMe()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const blocked = requiresEmailVerification(user)

  if (!otherUserId) return null

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (blocked) {
      setError(EMAIL_VERIFICATION_REQUIRED)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const conv = await getOrCreateConversation(otherUserId!)
      navigate(messagesPathForRole(user?.role ?? ''), {
        state: { conversationId: conv.conversationId, contextLabel },
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sohbet başlatılamadı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
    <Button
      type="button"
      variant="outline"
      size={size}
      disabled={loading || blocked}
      title={blocked ? EMAIL_VERIFICATION_REQUIRED : undefined}
      onClick={(e) => void handleClick(e)}
    >
      <MessageCircle className="size-4 mr-1" />
      {loading ? '…' : label}
    </Button>
    {error ? <span className="text-xs text-destructive max-w-[14rem]">{error}</span> : null}
    </span>
  )
}
