import { FormEvent, useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { createReview, getUserReviewSummary, listUserReviews, type ReviewDto } from '../../api/reviews'
import { ApiError } from '../../api/client'
import { useMe } from '../../hooks/useMe'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { FormAlert } from './FormAlert'

type UserReviewsSectionProps = {
  userId: number | null | undefined
  allowCreate?: boolean
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('tr-TR')
  } catch {
    return iso
  }
}

export function UserReviewsSection({ userId, allowCreate = false }: UserReviewsSectionProps) {
  const { user } = useMe()
  const [reviews, setReviews] = useState<ReviewDto[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const canReview =
    allowCreate &&
    userId != null &&
    user != null &&
    user.id !== userId

  useEffect(() => {
    if (userId == null) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    Promise.all([getUserReviewSummary(userId), listUserReviews(userId)])
      .then(([summary, list]) => {
        setAverageRating(summary.averageRating)
        setReviewCount(summary.reviewCount)
        setReviews(list)
      })
      .catch((e) => {
        setError(e instanceof ApiError ? e.message : 'Değerlendirmeler yüklenemedi')
      })
      .finally(() => setLoading(false))
  }, [userId, formSuccess])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (userId == null) return
    setFormError(null)
    setFormSuccess(null)
    setSubmitting(true)
    try {
      await createReview({
        targetUserId: userId,
        rating,
        comment: comment.trim() || undefined,
      })
      setComment('')
      setFormSuccess('Değerlendirmeniz kaydedildi.')
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Değerlendirme gönderilemedi')
    } finally {
      setSubmitting(false)
    }
  }

  if (userId == null) return null

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-2">Değerlendirmeler</h3>
        {loading ? (
          <p className="text-small text-muted-foreground">Yükleniyor…</p>
        ) : error ? (
          <FormAlert variant="error" message={error} />
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2">
              <Star className="size-5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-small text-muted-foreground">({reviewCount} değerlendirme)</span>
            </div>
            {reviews.length === 0 ? (
              <p className="text-small text-muted-foreground mb-4">Henüz değerlendirme yok.</p>
            ) : (
              <ul className="mb-4 space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-lg border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-sm">{r.reviewerName ?? 'Kullanıcı'}</span>
                      <span className="text-caption text-muted-foreground">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="text-caption text-amber-600 mb-1">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                    {r.comment ? <p className="text-small text-muted-foreground">{r.comment}</p> : null}
                  </li>
                ))}
              </ul>
            )}
            {canReview ? (
              <form onSubmit={(e) => void onSubmit(e)} className="space-y-3 border-t border-border pt-4">
                <p className="text-small font-medium">Değerlendirme yaz</p>
                {formError ? <FormAlert variant="error" message={formError} /> : null}
                {formSuccess ? <FormAlert variant="success" message={formSuccess} /> : null}
                <div>
                  <label className="text-caption text-muted-foreground">Puan</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} yıldız</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-caption text-muted-foreground">Yorum (isteğe bağlı)</label>
                  <textarea
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[80px]"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={2000}
                  />
                </div>
                <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                  {submitting ? 'Gönderiliyor…' : 'Gönder'}
                </Button>
              </form>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  )
}
