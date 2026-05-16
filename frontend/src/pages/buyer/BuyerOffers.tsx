import { useMemo, useState } from 'react'
import { Card, CardContent } from '../../components/role-app/Card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { Badge } from '../../components/role-app/Badge'
import { PageState } from '../../components/role-app/PageState'
import { Clock, CheckCircle2, XCircle, TrendingUp, Package } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import * as buyerApi from '../../api/buyer'
import { formatDateTr, formatKg, formatTry, resolveMediaUrl } from '../../api/format'
import { MessageUserButton } from '../../components/role-app/MessageUserButton'
import type { MeatOfferItemDto } from '../../api/types'

const statusConfig = {
  pending: { label: 'Beklemede', icon: Clock, color: 'warning' as const },
  accepted: { label: 'Kabul Edildi', icon: CheckCircle2, color: 'success' as const },
  rejected: { label: 'Reddedildi', icon: XCircle, color: 'destructive' as const },
}

function mapStatus(s: string): keyof typeof statusConfig {
  if (s === 'ACCEPTED') return 'accepted'
  if (s === 'REJECTED') return 'rejected'
  return 'pending'
}

export function BuyerOffers() {
  const [activeTab, setActiveTab] = useState('all')
  const { data, loading, error, reload } = useApi(() => buyerApi.listMyMeatOffers(), [])

  const offers = data ?? []

  const filteredOffers = useMemo(() => {
    if (activeTab === 'all') return offers
    return offers.filter((o) => mapStatus(o.status) === activeTab)
  }, [offers, activeTab])

  const stats = useMemo(
    () => ({
      all: offers.length,
      pending: offers.filter((o) => o.status === 'PENDING').length,
      accepted: offers.filter((o) => o.status === 'ACCEPTED').length,
      rejected: offers.filter((o) => o.status === 'REJECTED').length,
    }),
    [offers],
  )

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Tekliflerim</h1>
        <p className="text-muted-foreground">Verdiğiniz tekliflerin durumunu takip edin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatMini label="Toplam Teklif" value={stats.all} icon={TrendingUp} />
        <StatMini label="Beklemede" value={stats.pending} icon={Clock} />
        <StatMini label="Kabul Edildi" value={stats.accepted} icon={CheckCircle2} />
        <StatMini label="Reddedildi" value={stats.rejected} icon={XCircle} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tümü ({stats.all})</TabsTrigger>
          <TabsTrigger value="pending">Beklemede ({stats.pending})</TabsTrigger>
          <TabsTrigger value="accepted">Kabul Edildi ({stats.accepted})</TabsTrigger>
          <TabsTrigger value="rejected">Reddedildi ({stats.rejected})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <PageState
            loading={loading}
            error={error}
            onRetry={reload}
            empty={filteredOffers.length === 0}
            emptyMessage="Bu kategoride teklif bulunmuyor."
          >
            <div className="space-y-4">
              {filteredOffers.map((offer) => (
                <OfferRow key={offer.offerId} offer={offer} />
              ))}
            </div>
          </PageState>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatMini({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card elevation="soft">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-caption text-muted-foreground">{label}</p>
            <p className="text-h3 font-semibold">{value}</p>
          </div>
          <Icon className="size-8 text-primary opacity-20" />
        </div>
      </CardContent>
    </Card>
  )
}

function OfferRow({ offer }: { offer: MeatOfferItemDto }) {
  const statusKey = mapStatus(offer.status)
  const status = statusConfig[statusKey]
  const StatusIcon = status.icon
  const title = offer.title || offer.meatType || 'Et ilanı'

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex gap-4">
          <img
            src={resolveMediaUrl(null)}
            alt={title}
            className="size-24 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="mb-1 truncate">{title}</h3>
                <p className="text-small text-muted-foreground mb-1">
                  {offer.slaughterhouseName || 'Kesimhane'}
                </p>
              </div>
              <Badge variant={status.color} className="flex items-center gap-1.5">
                <StatusIcon className="size-3.5" />
                {status.label}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-caption text-muted-foreground mb-0.5">Teklif fiyatınız</p>
                <p className="font-semibold">{formatTry(offer.pricePerKg)} / kg</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground mb-0.5">İlan miktarı</p>
                <p className="font-medium">{formatKg(offer.requestedQuantity)}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground mb-0.5 flex items-center gap-1">
                  <Package className="size-3" />
                  Teklif miktarı
                </p>
                <p className="font-medium">{formatKg(offer.quantity)}</p>
              </div>
            </div>
            {offer.note ? (
              <p className="text-small text-muted-foreground mb-2">{offer.note}</p>
            ) : null}
            <p className="text-caption text-muted-foreground">{formatDateTr(offer.createdAt)}</p>
            <div className="mt-3">
              <MessageUserButton
                otherUserId={offer.slaughterhouseId}
                contextLabel={title}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
