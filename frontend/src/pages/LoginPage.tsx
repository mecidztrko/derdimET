import { FormEvent, useState } from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import { sessionLogin } from '../api/auth'
import { ApiError } from '../api/client'
import { getMe } from '../api/profile'
import { AuthShell } from '../components/role-app/AuthShell'
import { Button } from '../components/role-app/Button'
import { FormAlert } from '../components/role-app/FormAlert'
import { authInputClass, authLabelClass } from '../lib/authStyles'
import { getRoleHomePath } from '../lib/roleHomePath'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navState =
    (location.state as { registeredEmail?: string; verifyAccessError?: string; passwordReset?: boolean } | null) ??
    null
  const registeredEmail = navState?.registeredEmail
  const passwordReset = navState?.passwordReset
  const verifyAccessError = navState?.verifyAccessError
  const authError = searchParams.has('error')

  const [email, setEmail] = useState(registeredEmail ?? '')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(
    authError ? 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.' : null,
  )

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    try {
      await sessionLogin(email.trim(), password)
      const me = await getMe()
      navigate(getRoleHomePath(me.role), { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setFormError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.')
      } else if (err instanceof ApiError) {
        setFormError(err.message)
      } else {
        setFormError('Bağlantı hatası. Lütfen tekrar deneyin.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell title="Giriş" subtitle="DerdimEt'e hoş geldiniz">
      {formError ? <FormAlert variant="error" message={formError} /> : null}
      {verifyAccessError ? (
        <p className="mb-4 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm" role="alert">
          {verifyAccessError}
        </p>
      ) : null}
      {registeredEmail ? (
        <p className="mb-4 rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-sm text-success" role="status">
          {passwordReset ? (
            <>
              Şifreniz güncellendi. <span className="font-medium">{registeredEmail}</span> ile giriş yapabilirsiniz.
            </>
          ) : (
            <>
              Kayıt tamamlandı. <span className="font-medium">{registeredEmail}</span> ile giriş yapabilirsiniz.
            </>
          )}
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className={authLabelClass}>
            E-posta
          </label>
          <input
            id="username"
            name="username"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
          />
        </div>
        <div>
          <label htmlFor="password" className={authLabelClass}>
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
          />
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
          {submitting ? 'Giriş yapılıyor…' : 'Giriş yap'}
        </Button>
      </form>
      <p className="mt-3 text-right text-sm">
        <Link to="/forgot-password" className="font-medium text-primary hover:underline">
          Şifremi unuttum
        </Link>
      </p>
      <p className="mt-6 text-center text-sm text-gray-600">
        Hesabınız yok mu?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Kayıt ol
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-gray-500">
        <Link to="/" className="font-medium text-primary hover:underline">
          Panele git
        </Link>{' '}
        (oturum açıksa)
      </p>
    </AuthShell>
  )
}
