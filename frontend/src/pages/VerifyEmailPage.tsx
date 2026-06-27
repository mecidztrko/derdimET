import { FormEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { sessionLogin } from '../api/auth'
import { getMe } from '../api/profile'
import { useMe } from '../hooks/useMe'
import { apiUrl } from '../config/apiBase'
import { AuthShell } from '../components/role-app/AuthShell'
import { Button } from '../components/role-app/Button'
import { FormAlert } from '../components/role-app/FormAlert'
import { authInputClass, authLabelClass } from '../lib/authStyles'
import { getRoleHomePath } from '../lib/roleHomePath'

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string; detail?: string }
    return data.message || data.detail || `Hata (${res.status})`
  } catch {
    return res.statusText || 'İstek başarısız'
  }
}

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refetch: refetchMe } = useMe()
  const [searchParams] = useSearchParams()
  const routeState = location.state as { email?: string; password?: string } | null
  const suggestedEmail = routeState?.email ?? searchParams.get('email') ?? ''
  const pendingPassword = routeState?.password
  const [email, setEmail] = useState(suggestedEmail)
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (suggestedEmail) setEmail(suggestedEmail)
  }, [suggestedEmail])

  async function sendCode() {
    setError(null)
    setMessage(null)
    try {
      const res = await fetch(apiUrl('/api/auth/verification/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        setError(await parseErrorMessage(res))
        return
      }
      setMessage('Doğrulama kodu gönderildi.')
    } catch {
      setError('Bağlantı hatası')
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch(apiUrl('/api/auth/verification/confirm'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      if (!res.ok) {
        setError(await parseErrorMessage(res))
        return
      }
      if (pendingPassword) {
        try {
          await sessionLogin(email, pendingPassword)
          const me = await getMe()
          refetchMe()
          navigate(getRoleHomePath(me.role), { replace: true })
          return
        } catch {
          setMessage('E-posta doğrulandı. Lütfen giriş yapın.')
          navigate('/login', { replace: true, state: { registeredEmail: email } })
          return
        }
      }
      refetchMe()
      setMessage('E-posta doğrulandı. Giriş yapabilirsiniz.')
      navigate('/login', { replace: true, state: { registeredEmail: email } })
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="E-posta doğrulama"
      subtitle={
        pendingPassword
          ? 'Kodu girin; doğrulama sonrası otomatik giriş yapılır'
          : 'Hesabınızı aktifleştirmek için kodu girin'
      }
    >
        {error ? <FormAlert variant="error" message={error} /> : null}
        {message ? <FormAlert variant="success" message={message} /> : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={authLabelClass}>E-posta</label>
            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className={authInputClass} />
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={() => void sendCode()}>
            Kod gönder
          </Button>
          <div>
            <label htmlFor="code" className={authLabelClass}>Doğrulama kodu</label>
            <input id="code" value={code} onChange={(e) => setCode(e.target.value)} required className={authInputClass} />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? 'Doğrulanıyor…' : 'Doğrula'}
          </Button>
        </form>

        <p className="mt-6 text-center text-small text-muted-foreground">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Giriş ekranına dön
          </Link>
        </p>
    </AuthShell>
  )
}
