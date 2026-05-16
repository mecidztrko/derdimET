import { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/Tabs';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Clock, CheckCircle2, XCircle, TrendingUp, MapPin, Package, Building2, CheckCheck } from 'lucide-react';

const mockOffers = [
  {
    id: '1',
    listing: {
      title: 'Kıvırcık Kuzu - 6 Aylık',
      myListing: true,
      quantity: '40 baş',
      pricePerKg: '₺185,00',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
    },
    slaughterhouse: {
      name: 'Anadolu Kesimhane A.Ş.',
      location: 'İstanbul, Pendik',
      verified: true,
    },
    offerPrice: '₺180,00',
    quantity: '30 baş',
    status: 'pending' as const,
    date: '15 Mayıs 2026',
    message: 'Tüm sürü için toplam fiyat anlaşmasına açığız.',
  },
  {
    id: '2',
    listing: {
      title: 'Kıvırcık Kuzu - 6 Aylık',
      myListing: true,
      quantity: '40 baş',
      pricePerKg: '₺185,00',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
    },
    slaughterhouse: {
      name: 'Marmara Kesimevi',
      location: 'Bursa, Gemlik',
      verified: true,
    },
    offerPrice: '₺185,00',
    quantity: '40 baş',
    status: 'accepted' as const,
    date: '14 Mayıs 2026',
  },
  {
    id: '3',
    listing: {
      title: 'Siyah Alaca Dana - 18 Aylık',
      myListing: true,
      quantity: '15 baş',
      pricePerKg: '₺165,00',
      image: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400',
    },
    slaughterhouse: {
      name: 'Trakya Kesimhane',
      location: 'Edirne, Keşan',
      verified: true,
    },
    offerPrice: '₺160,00',
    quantity: '10 baş',
    status: 'pending' as const,
    date: '13 Mayıs 2026',
  },
  {
    id: '4',
    listing: {
      title: 'Siyah Alaca Dana - 18 Aylık',
      myListing: true,
      quantity: '15 baş',
      pricePerKg: '₺165,00',
      image: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400',
    },
    slaughterhouse: {
      name: 'Ege Et Kesimhane',
      location: 'İzmir, Torbalı',
      verified: false,
    },
    offerPrice: '₺155,00',
    quantity: '15 baş',
    status: 'rejected' as const,
    date: '12 Mayıs 2026',
    rejectionReason: 'Fiyat hedefimizle uyuşmuyor',
  },
];

const statusConfig = {
  pending: {
    label: 'Beklemede',
    icon: Clock,
    color: 'warning' as const,
  },
  accepted: {
    label: 'Kabul Ettim',
    icon: CheckCheck,
    color: 'success' as const,
  },
  rejected: {
    label: 'Reddettim',
    icon: XCircle,
    color: 'destructive' as const,
  },
};

export function SellerOffers() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredOffers = mockOffers.filter((offer) => {
    if (activeTab === 'all') return true;
    return offer.status === activeTab;
  });

  const stats = {
    all: mockOffers.length,
    pending: mockOffers.filter((o) => o.status === 'pending').length,
    accepted: mockOffers.filter((o) => o.status === 'accepted').length,
    rejected: mockOffers.filter((o) => o.status === 'rejected').length,
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Gelen Teklifler</h1>
        <p className="text-muted-foreground">
          Kesimhanelerden ilanlarınıza gelen teklifleri yönetin
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card elevation="soft">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">Toplam Teklif</p>
                <p className="text-h3 font-semibold">{stats.all}</p>
              </div>
              <TrendingUp className="size-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card elevation="soft">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">Beklemede</p>
                <p className="text-h3 font-semibold">{stats.pending}</p>
              </div>
              <Clock className="size-8 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card elevation="soft">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">Kabul Edilen</p>
                <p className="text-h3 font-semibold">{stats.accepted}</p>
              </div>
              <CheckCircle2 className="size-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card elevation="soft">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">Reddedilen</p>
                <p className="text-h3 font-semibold">{stats.rejected}</p>
              </div>
              <XCircle className="size-8 text-destructive opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tümü ({stats.all})</TabsTrigger>
          <TabsTrigger value="pending">Beklemede ({stats.pending})</TabsTrigger>
          <TabsTrigger value="accepted">Kabul Edilen ({stats.accepted})</TabsTrigger>
          <TabsTrigger value="rejected">Reddedilen ({stats.rejected})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="space-y-4">
            {filteredOffers.length === 0 ? (
              <Card elevation="soft" className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center">
                    <TrendingUp className="size-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2">Teklif bulunamadı</h3>
                    <p className="text-muted-foreground">
                      Bu kategoride henüz teklif bulunmuyor
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              filteredOffers.map((offer) => {
                const status = statusConfig[offer.status];
                const StatusIcon = status.icon;

                return (
                  <Card key={offer.id}>
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        {/* Image */}
                        <img
                          src={offer.listing.image}
                          alt={offer.listing.title}
                          className="size-24 rounded-lg object-cover flex-shrink-0"
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="mb-1 truncate">{offer.listing.title}</h3>
                              <p className="text-small text-muted-foreground mb-1 flex items-center gap-1">
                                <Building2 className="size-3" />
                                {offer.slaughterhouse.name}
                              </p>
                              <p className="text-small text-muted-foreground flex items-center gap-1">
                                <MapPin className="size-3" />
                                {offer.slaughterhouse.location}
                              </p>
                            </div>
                            <Badge variant={status.color} className="flex items-center gap-1.5">
                              <StatusIcon className="size-3.5" />
                              {status.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-caption text-muted-foreground mb-0.5">
                                Teklif Fiyatı
                              </p>
                              <p className="font-semibold text-primary">{offer.offerPrice} / kg</p>
                            </div>
                            <div>
                              <p className="text-caption text-muted-foreground mb-0.5">
                                İlan Fiyatınız
                              </p>
                              <p className="font-medium text-muted-foreground">
                                {offer.listing.pricePerKg} / kg
                              </p>
                            </div>
                            <div>
                              <p className="text-caption text-muted-foreground mb-0.5 flex items-center gap-1">
                                <Package className="size-3" />
                                Miktar
                              </p>
                              <p className="font-medium">{offer.quantity}</p>
                            </div>
                          </div>

                          {offer.message && offer.status === 'pending' && (
                            <div className="mb-3 p-3 bg-primary-soft border border-primary/10 rounded-lg">
                              <p className="text-small">
                                <span className="font-medium">Mesaj:</span> {offer.message}
                              </p>
                            </div>
                          )}

                          {offer.status === 'rejected' && offer.rejectionReason && (
                            <div className="mb-3 p-3 bg-muted border border-border rounded-lg">
                              <p className="text-small text-muted-foreground">
                                <span className="font-medium">Ret Nedeni:</span>{' '}
                                {offer.rejectionReason}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <p className="text-caption text-muted-foreground">{offer.date}</p>
                            <div className="flex gap-2">
                              {offer.status === 'pending' && (
                                <>
                                  <Button variant="primary" size="sm">
                                    <CheckCircle2 className="size-4 mr-2" />
                                    Kabul Et
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <XCircle className="size-4 mr-2" />
                                    Reddet
                                  </Button>
                                </>
                              )}
                              {offer.status === 'accepted' && (
                                <Button variant="primary" size="sm">
                                  Detayları Gör
                                </Button>
                              )}
                              <Button variant="ghost" size="sm">
                                Mesaj Gönder
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}