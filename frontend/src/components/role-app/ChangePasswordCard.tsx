import { FormEvent, useState } from 'react'
import { Lock } from 'lucide-react'
import { changePassword } from '../../api/profile'
import { ApiError } from '../../api/client'
import { validatePassword } from '../../lib/formUtils'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { FormAlert } from './FormAlert'
import { Input } from './Input'

export function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!currentPassword || !newPassword) {
      setError('Tüm alanları doldurun.')
      return
    }
    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      setError(passwordError)
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor.')
      return
    }
    setSubmitting(true)
    try {
      await changePassword(currentPassword, newPassword)
      setSuccess('Şifreniz güncellendi.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Şifre güncellenemedi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4">Şifre değiştir</h3>
        {error ? <div className="mb-4"><FormAlert variant="error" message={error} /></div> : null}
        {success ? <div className="mb-4"><FormAlert variant="success" message={success} /></div> : null}
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          <div>
            <label className="text-small font-medium mb-2 block">Mevcut şifre</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              icon={Lock}
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="text-small font-medium mb-2 block">Yeni şifre</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={Lock}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="text-small font-medium mb-2 block">Yeni şifre (tekrar)</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={Lock}
              autoComplete="new-password"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Güncelleniyor…' : 'Şifreyi güncelle'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
