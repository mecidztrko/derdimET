import { useState } from 'react'
import { Building2, Upload } from 'lucide-react'
import { submitBusinessVerification } from '../../api/businessVerification'
import { uploadImage } from '../../api/media'
import { ApiError } from '../../api/client'
import { useMe } from '../../hooks/useMe'
import { isBusiness } from '../../types/me'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { FormAlert } from './FormAlert'

const statusLabels: Record<string, string> = {
  NONE: 'Başvuru yapılmadı',
  PENDING: 'İnceleme bekliyor',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
}

export function BusinessVerificationCard() {
  const { user, refetch } = useMe()
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!user || !isBusiness(user.accountType)) {
    return null
  }

  const status = user.businessVerificationStatus ?? (user.businessVerified ? 'APPROVED' : 'NONE')
  const canSubmit = status === 'NONE' || status === 'REJECTED'

  async function handleFile(file: File | null) {
    if (!file) return
    setUploading(true)
    setError(null)
    setSuccess(null)
    try {
      const url = await uploadImage(file)
      setSubmitting(true)
      await submitBusinessVerification(url)
      await refetch()
      setSuccess('Kurumsal doğrulama başvurunuz alındı. İnceleme sonucu e-posta ile bildirilecektir.')
    } catch (e) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Başvuru gönderilemedi')
    } finally {
      setUploading(false)
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-start gap-3">
          <Building2 className="size-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="mb-1">Kurumsal doğrulama</h3>
            <p className="text-small text-muted-foreground">
              Vergi levhası veya ticaret sicil belgesi yükleyerek işletmenizi doğrulatabilirsiniz.
            </p>
          </div>
        </div>

        <p className="mb-4 text-sm">
          Durum:{' '}
          <span className="font-medium">{statusLabels[status] ?? status}</span>
        </p>
        {user.businessVerificationNote ? (
          <p className="mb-4 text-small text-muted-foreground">{user.businessVerificationNote}</p>
        ) : null}

        {error ? <div className="mb-4"><FormAlert variant="error" message={error} /></div> : null}
        {success ? <div className="mb-4"><FormAlert variant="success" message={success} /></div> : null}

        {canSubmit ? (
          <div>
            <input
              id="business-doc"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading || submitting}
              onClick={() => document.getElementById('business-doc')?.click()}
            >
              <Upload className="size-4 mr-2" />
              {uploading || submitting ? 'Gönderiliyor…' : 'Belge yükle ve başvur'}
            </Button>
            <p className="mt-2 text-caption text-muted-foreground">
              E-posta doğrulaması gerekebilir. JPG, PNG veya PDF yükleyebilirsiniz.
            </p>
          </div>
        ) : status === 'PENDING' ? (
          <p className="text-small text-muted-foreground">Başvurunuz inceleniyor.</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
