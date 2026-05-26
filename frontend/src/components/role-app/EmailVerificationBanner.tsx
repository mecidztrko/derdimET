import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { useMe } from '../../hooks/useMe'

export function EmailVerificationBanner() {
  const { user } = useMe()
  if (!user || user.emailVerified) return null

  return (
    <div className="bg-warning/10 border-b border-warning/30 px-4 py-2.5">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 px-4 text-small sm:px-6">
        <p className="flex items-center gap-2 text-foreground">
          <Mail className="size-4 text-warning shrink-0" />
          E-posta adresiniz henüz doğrulanmadı. Bazı işlemler kısıtlı olabilir.
        </p>
        <Link
          to="/verify-email"
          state={{ email: user.email }}
          className="font-medium text-primary hover:underline whitespace-nowrap"
        >
          Doğrulama kodu gir
        </Link>
      </div>
    </div>
  )
}
