import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { useMe } from '../../hooks/useMe'
import { requiresEmailVerification } from '../../lib/emailVerification'

type EmailVerificationNoticeProps = {
  className?: string
}

export function EmailVerificationNotice({ className = '' }: EmailVerificationNoticeProps) {
  const { user } = useMe()
  if (!requiresEmailVerification(user)) return null

  return (
    <p
      className={`flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-foreground ${className}`}
      role="status"
    >
      <Mail className="size-4 text-warning shrink-0 mt-0.5" />
      <span>
        E-posta doğrulaması gerekli.{' '}
        <Link
          to="/verify-email"
          state={{ email: user!.email }}
          className="font-medium text-primary hover:underline"
        >
          Kodu girin
        </Link>
      </span>
    </p>
  )
}
