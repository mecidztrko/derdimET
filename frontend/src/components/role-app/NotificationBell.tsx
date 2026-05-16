import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { Button } from './Button'
import { useNotificationSummary } from '../../hooks/useNotificationSummary'
import { useMe } from '../../hooks/useMe'
import { isBuyer, isSeller, isSlaughterhouse } from '../../types/me'

type Row = { label: string; count: number; href: string }

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const { user } = useMe()
  const { total, data, loading, reload } = useNotificationSummary()

  useEffect(() => {
    const id = window.setInterval(() => void reload(), 60_000)
    return () => window.clearInterval(id)
  }, [reload])

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const rows: Row[] = (() => {
    if (!data || !user) return []
    if (isBuyer(user.role)) {
      return [{ label: 'Bekleyen et teklifleri', count: data.pendingOffers, href: '/buyer/offers' }]
    }
    if (isSeller(user.role)) {
      return [{ label: 'İlanlarıma gelen teklifler', count: data.pendingIncoming, href: '/seller/offers' }]
    }
    if (isSlaughterhouse(user.role)) {
      return [
        { label: 'Alıcı et teklifleri', count: data.pendingOffers, href: '/slaughterhouse/sell-meat' },
        {
          label: 'Alış talebi satıcı teklifleri',
          count: data.pendingPurchaseOffers,
          href: '/slaughterhouse/purchase-requests',
        },
      ]
    }
    return []
  })()

  const hasRows = rows.some((r) => r.count > 0)

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="relative"
        aria-label="Bekleyen bildirimler"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="size-5" />
        {total > 0 ? (
          <span className="absolute top-1.5 right-1.5 size-2 bg-destructive rounded-full" />
        ) : null}
      </Button>

      {open ? (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-border bg-card shadow-lg z-50 py-2">
          <p className="px-4 py-2 text-small font-medium border-b border-border">Bekleyen işlemler</p>
          {loading && !data ? (
            <p className="px-4 py-3 text-caption text-muted-foreground">Yükleniyor…</p>
          ) : hasRows ? (
            <ul className="py-1">
              {rows
                .filter((r) => r.count > 0)
                .map((r) => (
                  <li key={r.href}>
                    <Link
                      to={r.href}
                      className="flex items-center justify-between gap-2 px-4 py-2.5 text-small hover:bg-muted/60"
                      onClick={() => setOpen(false)}
                    >
                      <span>{r.label}</span>
                      <span className="tabular-nums font-medium text-primary">{r.count}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-caption text-muted-foreground">Bekleyen teklif yok.</p>
          )}
          {data?.primaryLink && hasRows ? (
            <div className="border-t border-border px-4 py-2">
              <Link
                to={data.primaryLink}
                className="text-caption text-primary hover:underline"
                onClick={() => setOpen(false)}
              >
                Öncelikli sayfaya git →
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
