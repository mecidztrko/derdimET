import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiUrl } from '../config/apiBase'
import { AuthShell } from '../components/role-app/AuthShell'
import { Button } from '../components/role-app/Button'
import { authInputClass, authLabelClass } from '../lib/authStyles'

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string; detail?: string }
    return data.message || data.detail || `Hata (${res.status})`
  } catch {
    return res.statusText || 'İstek başarısız'
  }
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function sendCode() {
    setError(null)
    setMessage(null)
    try {
      const res = await fetch(apiUrl('/api/auth/password/forgot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        setError(await parseErrorMessage(res))
        return
      }
      setMessage('Kod gönderildi. (Geliştirme ortamında kod backend loglarında görünür)')
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
      const res = await fetch(apiUrl('/api/auth/password/reset'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      })
      if (!res.ok) {
        setError(await parseErrorMessage(res))
        return
      }
      navigate('/login', { replace: true, state: { registeredEmail: email } })
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell title="Şifremi unuttum" subtitle="E-posta ile doğrulayıp yeni şifre belirleyin">
        {error ? (
          <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>
        ) : null}
        {message ? (
          <p className="mb-4 rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-sm text-success">{message}</p>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={authLabelClass}>
              E-posta
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className={authInputClass}
            />
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={() => void sendCode()}>
            Kod gönder
          </Button>
          <div>
            <label htmlFor="code" className={authLabelClass}>
              Kod
            </label>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className={authInputClass}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className={authLabelClass}>
              Yeni şifre
            </label>
            <input
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              minLength={8}
              required
              className={authInputClass}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? 'Güncelleniyor…' : 'Şifreyi güncelle'}
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
