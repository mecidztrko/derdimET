import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { ApiError } from '../../api/client'
import { getOrCreateConversation } from '../../api/messaging'
import { useMe } from '../../hooks/useMe'
import { EMAIL_VERIFICATION_REQUIRED, requiresEmailVerification } from '../../lib/emailVerification'
import { messagesPathForRole } from '../../lib/messagesPath'
import { Button } from './Button'
import { cn } from '../../lib/cn'

type MessageUserButtonProps = {
  otherUserId: number | null | undefined
  contextLabel?: string
  label?: string
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function MessageUserButton({
  otherUserId,
  contextLabel,
  label = 'Mesaj',
  size = 'sm',
  className,
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

  const fullWidth = className?.includes('w-full')

  return (
    <span
      className={cn('flex flex-col gap-1', fullWidth ? 'w-full' : 'inline-flex items-start')}
    >
      <Button
        type="button"
        variant="outline"
        size={size}
        className={className}
        disabled={loading || blocked}
        title={blocked ? EMAIL_VERIFICATION_REQUIRED : undefined}
        onClick={(e) => void handleClick(e)}
      >
        <MessageCircle className="size-4 mr-1" />
        {loading ? '…' : label}
      </Button>
      {error ? (
        <span className={cn('text-xs text-destructive', fullWidth ? 'w-full' : 'max-w-[14rem]')}>
          {error}
        </span>
      ) : null}
    </span>
  )
}
