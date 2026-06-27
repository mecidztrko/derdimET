import { useCallback, useEffect, useState } from 'react'
import { Building2, Check, ExternalLink, X } from 'lucide-react'
import {
  approveBusinessVerification,
  listPendingBusinessVerifications,
  rejectBusinessVerification,
  type AdminBusinessVerificationDto,
} from '../../api/admin'
import { ApiError } from '../../api/client'
import { Button } from '../role-app/Button'
import { FormAlert } from '../role-app/FormAlert'

export function AdminBusinessVerificationPanel() {
  const [items, setItems] = useState<AdminBusinessVerificationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionUserId, setActionUserId] = useState<number | null>(null)
  const [rejectNotes, setRejectNotes] = useState<Record<number, string>>({})

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await listPendingBusinessVerifications())
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Başvurular yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleApprove(userId: number) {
    setActionUserId(userId)
    setError(null)
    try {
      await approveBusinessVerification(userId)
      await load()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Onaylama başarısız')
    } finally {
      setActionUserId(null)
    }
  }

  async function handleReject(userId: number) {
    setActionUserId(userId)
    setError(null)
    try {
      await rejectBusinessVerification(userId, rejectNotes[userId]?.trim() || undefined)
      setRejectNotes((prev) => {
        const next = { ...prev }
        delete next[userId]
        return next
      })
      await load()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Reddetme başarısız')
    } finally {
      setActionUserId(null)
    }
  }

  if (loading) {
    return <p className="text-small text-muted-foreground">Kurumsal doğrulama başvuruları yükleniyor…</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="size-5 text-primary" />
        <h2 className="font-medium">Kurumsal doğrulama başvuruları</h2>
      </div>
      {error && <FormAlert variant="error">{error}</FormAlert>}
      {items.length === 0 ? (
        <p className="text-small text-muted-foreground">Bekleyen başvuru yok.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.userId} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.companyName ?? item.name}</p>
                  <p className="text-small text-muted-foreground">
                    {item.email} · {item.role}
                    {item.taxNumber ? ` · VKN: ${item.taxNumber}` : ''}
                  </p>
                  {item.documentUrl && (
                    <a
                      href={item.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-small text-primary mt-2 underline"
                    >
                      Belgeyi görüntüle
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={actionUserId === item.userId}
                    onClick={() => void handleApprove(item.userId)}
                  >
                    <Check className="size-4 mr-1" />
                    Onayla
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={actionUserId === item.userId}
                    onClick={() => void handleReject(item.userId)}
                  >
                    <X className="size-4 mr-1" />
                    Reddet
                  </Button>
                </div>
              </div>
              <input
                value={rejectNotes[item.userId] ?? ''}
                onChange={(e) =>
                  setRejectNotes((prev) => ({ ...prev, [item.userId]: e.target.value }))
                }
                placeholder="Red notu (isteğe bağlı)"
                className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-small bg-background"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
