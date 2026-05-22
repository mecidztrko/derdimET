import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { AuthShell } from '../components/role-app/AuthShell'
import { Button } from '../components/role-app/Button'

export default function LoginPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navState =
    (location.state as { registeredEmail?: string; verifyAccessError?: string; passwordReset?: boolean } | null) ??
    null
  const registeredEmail = navState?.registeredEmail
  const passwordReset = navState?.passwordReset
  const verifyAccessError = navState?.verifyAccessError
  const authError = searchParams.has('error')

  return (
    <AuthShell title="Giriş" subtitle="derdimET hesabınıza giriş yapın">
      {authError ? (
        <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          E-posta veya şifre hatalı. Lütfen tekrar deneyin.
        </p>
      ) : null}
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
      <form action="/perform_login" method="post" className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-small font-medium mb-1.5">
            E-posta
          </label>
          <input
            id="username"
            name="username"
            type="email"
            required
            autoComplete="username"
            defaultValue={registeredEmail ?? ''}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-small outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-small font-medium mb-1.5">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-small outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <Button type="submit" variant="primary" className="w-full">
          Giriş yap
        </Button>
      </form>
      <p className="mt-3 text-right text-small">
        <Link to="/forgot-password" className="font-medium text-primary hover:underline">
          Şifremi unuttum
        </Link>
      </p>
      <p className="mt-6 text-center text-small text-muted-foreground">
        Hesabınız yok mu?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Kayıt ol
        </Link>
      </p>
      <p className="mt-2 text-center text-small text-muted-foreground">
        <Link to="/" className="font-medium text-primary hover:underline">
          Panele git
        </Link>{' '}
        (oturum açıksa)
      </p>
    </AuthShell>
  )
}
