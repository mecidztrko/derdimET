import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '../components/role-app/Button'
import { Chip } from '../components/role-app/Chip'
import { PageState } from '../components/role-app/PageState'
import { RoleAppPage } from '../components/role-app/RoleAppPage'
import { PageHeader } from '../components/role-app/PageHeader'
import { useApi } from '../hooks/useApi'
import {
  listNotificationInbox,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationInboxItemDto,
} from '../api/notifications'
import { formatRelativeTr } from '../api/format'

const FILTERS: Array<{ key: 'all' | NotificationInboxItemDto['type']; label: string }> = [
  { key: 'all', label: 'Tümü' },
  { key: 'OFFER', label: 'Teklif' },
  { key: 'PAYMENT', label: 'Ödeme' },
  { key: 'LISTING', label: 'İlan' },
  { key: 'MESSAGE', label: 'Mesaj' },
]

export function NotificationInboxPage() {
  const [filter, setFilter] = useState<'all' | NotificationInboxItemDto['type']>('all')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const { data, loading, error, reload } = useApi(
    () =>
      listNotificationInbox({
        type: filter === 'all' ? undefined : filter,
        unreadOnly,
      }),
    [filter, unreadOnly],
  )

  async function handleRead(id: number) {
    await markNotificationRead(id)
    reload()
  }

  async function handleReadAll() {
    await markAllNotificationsRead()
    reload()
  }

  const items = data ?? []

  return (
    <RoleAppPage>
      <PageHeader
        title="Bildirimler"
        description="Teklif, ödeme ve ilan güncellemeleri"
        actions={
          <Button variant="outline" size="sm" type="button" onClick={() => void handleReadAll()}>
            <CheckCheck className="size-4 mr-1" />
            Tümünü okundu işaretle
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </Chip>
        ))}
        <Chip active={unreadOnly} onClick={() => setUnreadOnly((v) => !v)}>
          Okunmamış
        </Chip>
      </div>

      <PageState
        loading={loading}
        error={error}
        onRetry={reload}
        empty={items.length === 0}
        emptyMessage="Henüz bildirim yok."
      >
        <div className="space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (!item.read) void handleRead(item.id)
              }}
              className={`w-full text-left rounded-xl border p-4 transition-colors ${
                item.read ? 'border-border bg-card' : 'border-primary/30 bg-primary/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <Bell className="size-4 mt-0.5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-small">{item.title}</p>
                    <span className="text-caption text-muted-foreground">{formatRelativeTr(item.createdAt)}</span>
                  </div>
                  {item.body ? (
                    <p className="text-small text-muted-foreground mt-1">{item.body}</p>
                  ) : null}
                  {item.link ? (
                    <Link
                      to={item.link}
                      className="text-small text-primary underline mt-2 inline-block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Görüntüle
                    </Link>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      </PageState>
    </RoleAppPage>
  )
}
