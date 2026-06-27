import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiUrl } from '../config/apiBase'
import type { AccountType, UserRole } from '../types/me'
import { AuthShell } from '../components/role-app/AuthShell'
import { Button } from '../components/role-app/Button'
import { FormAlert } from '../components/role-app/FormAlert'
import { authInputClass, authLabelClass } from '../lib/authStyles'
import { parseErrorMessage, validatePassword } from '../lib/formUtils'

type RegisterPayload = {
  email: string
  password: string
  name: string
  phone: string | null
  role: UserRole
  accountType: AccountType
  companyName: string | null
  taxNumber: string | null
  addressLine: string | null
  city: string | null
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState<UserRole>('MEAT_BUYER')
  const [accountType, setAccountType] = useState<AccountType>('INDIVIDUAL')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    const email = String(fd.get('email') || '').trim()
    const password = String(fd.get('password') || '')
    const password2 = String(fd.get('password2') || '')
    const name = String(fd.get('name') || '').trim()
    const phone = String(fd.get('phone') || '').trim()

    if (password !== password2) {
      setError('Şifreler eşleşmiyor')
      return
    }
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    const payload: RegisterPayload = {
      email,
      password,
      name,
      phone: phone ? phone : null,
      role,
      accountType,
      companyName:
        accountType === 'BUSINESS' ? String(fd.get('companyName') || '').trim() || null : null,
      taxNumber: accountType === 'BUSINESS' ? String(fd.get('taxNumber') || '').trim() || null : null,
      addressLine:
        accountType === 'BUSINESS' ? String(fd.get('addressLine') || '').trim() || null : null,
      city: accountType === 'BUSINESS' ? String(fd.get('city') || '').trim() || null : null,
    }

    setSubmitting(true)
    try {
      const res = await fetch(apiUrl('/api/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        setError(await parseErrorMessage(res))
        return
      }
      navigate('/verify-email', { replace: true, state: { email, password } })
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell title="Kayıt" subtitle="derdimET hesabı oluşturun">
        {error ? <FormAlert variant="error" message={error} /> : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <span className={authLabelClass}>Hesap türü</span>
            <div className="mt-2 flex gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="accountTypeUi"
                  checked={accountType === 'INDIVIDUAL'}
                  onChange={() => setAccountType('INDIVIDUAL')}
                  className="text-clinical-600 focus:ring-clinical-500"
                />
                Bireysel
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="accountTypeUi"
                  checked={accountType === 'BUSINESS'}
                  onChange={() => setAccountType('BUSINESS')}
                  className="text-clinical-600 focus:ring-clinical-500"
                />
                Kurumsal
              </label>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-600">Rol</span>
            <div className="mt-2 flex flex-col gap-2 text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="roleUi"
                  checked={role === 'MEAT_BUYER'}
                  onChange={() => setRole('MEAT_BUYER')}
                  className="text-clinical-600 focus:ring-clinical-500"
                />
                Et alıcı
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="roleUi"
                  checked={role === 'ANIMAL_SELLER'}
                  onChange={() => setRole('ANIMAL_SELLER')}
                  className="text-clinical-600 focus:ring-clinical-500"
                />
                Hayvan satıcısı
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="roleUi"
                  checked={role === 'SLAUGHTERHOUSE'}
                  onChange={() => setRole('SLAUGHTERHOUSE')}
                />
                Kesimhane
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="name" className={authLabelClass}>
              Ad soyad
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className={authInputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-600">
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={authInputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-gray-600">
              Telefon <span className="font-normal text-gray-400">(isteğe bağlı)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={authInputClass}
            />
          </div>

          {accountType === 'BUSINESS' ? (
            <>
              <div>
                <label htmlFor="companyName" className="block text-xs font-semibold text-gray-600">
                  Şirket adı
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  className={authInputClass}
                />
              </div>
              <div>
                <label htmlFor="taxNumber" className="block text-xs font-semibold text-gray-600">
                  Vergi numarası
                </label>
                <input
                  id="taxNumber"
                  name="taxNumber"
                  type="text"
                  required
                  className={authInputClass}
                />
              </div>
              <div>
                <label htmlFor="addressLine" className="block text-xs font-semibold text-gray-600">
                  Adres <span className="font-normal text-gray-400">(isteğe bağlı)</span>
                </label>
                <input
                  id="addressLine"
                  name="addressLine"
                  type="text"
                  className={authInputClass}
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-xs font-semibold text-gray-600">
                  Şehir <span className="font-normal text-gray-400">(isteğe bağlı)</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className={authInputClass}
                />
              </div>
            </>
          ) : null}

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-600">
              Şifre <span className="font-normal text-gray-400">(en az 8 karakter)</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className={authInputClass}
            />
          </div>
          <div>
            <label htmlFor="password2" className="block text-xs font-semibold text-gray-600">
              Şifre tekrar
            </label>
            <input
              id="password2"
              name="password2"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className={authInputClass}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? 'Kaydediliyor…' : 'Kayıt ol'}
          </Button>
        </form>

        <p className="mt-6 text-center text-small text-muted-foreground">
          Zaten hesabınız var mı?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Giriş yap
          </Link>
        </p>
    </AuthShell>
  )
}
