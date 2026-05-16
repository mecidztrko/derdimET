import { Package, TrendingUp, ShoppingCart, ListChecks, DollarSign, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';

const recentSellerListings = [
  {
    id: '1',
    seller: 'Ali Yılmaz',
    category: 'Küçükbaş',
    breed: 'Kıvırcık Kuzu',
    count: 40,
    avgWeight: '42 kg',
    age: '6 aylık',
    price: '₺185,00 / kg',
    location: 'Konya, Ereğli',
  },
  {
    id: '2',
    seller: 'Mehmet Demir',
    category: 'Büyükbaş',
    breed: 'Siyah Alaca Dana',
    count: 15,
    avgWeight: '480 kg',
    age: '18 aylık',
    price: '₺165,00 / kg',
    location: 'Afyon, Sandıklı',
  },
  {
    id: '3',
    seller: 'Hasan Çelik',
    category: 'Küçükbaş',
    breed: 'Merinos Kuzu',
    count: 60,
    avgWeight: '38 kg',
    age: '5 aylık',
    price: '₺180,00 / kg',
    location: 'Kayseri, Bünyan',
  },
  {
    id: '4',
    seller: 'İbrahim Kaya',
    category: 'Küçükbaş',
    breed: 'Akkaraman',
    count: 50,
    avgWeight: '45 kg',
    age: '7 aylık',
    price: '₺190,00 / kg',
    location: 'Ankara, Haymana',
  },
];

const myMeatListings = [
  {
    id: '1',
    meatType: 'Dana Biftek',
    quantity: '500 kg',
    price: '₺420,00 / kg',
    offerCount: 12,
    status: 'open' as const,
  },
  {
    id: '2',
    meatType: 'Kuzu But',
    quantity: '200 kg',
    price: '₺580,00 / kg',
    offerCount: 5,
    status: 'open' as const,
  },
];

const recentBuyerOffers = [
  {
    id: '1',
    buyer: 'Beyaz Et Kasap',
    listingType: 'Dana Biftek',
    offeredPrice: '₺415,00 / kg',
    quantity: '100 kg',
    status: 'pending' as const,
  },
  {
    id: '2',
    buyer: 'Lezzet Restaurant',
    listingType: 'Kuzu But',
    offeredPrice: '₺575,00 / kg',
    quantity: '50 kg',
    status: 'pending' as const,
  },
];

export function SlaughterhouseDashboard() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2">Kontrol Paneli</h1>
          <p className="text-muted-foreground">Alım ve satış işlemlerinize genel bakış</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Hayvan Alım Teklifleri"
            value="7"
            icon={TrendingUp}
            trend={{ value: '3 beklemede', positive: true }}
          />
          <StatCard
            title="Aktif Et Satış İlanları"
            value="2"
            icon={Package}
          />
          <StatCard
            title="Et Alıcılarından Teklifler"
            value="17"
            icon={ListChecks}
            trend={{ value: '5 yeni', positive: true }}
          />
          <StatCard
            title="Bu Ay Ciro"
            value="₺485K"
            icon={DollarSign}
            trend={{ value: '+18%', positive: true }}
          />
        </div>

        {/* Split Brain - Buying & Selling Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* LEFT SIDE - BUYING (Animals) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mb-1">Alım Tarafı</h2>
                <p className="text-small text-muted-foreground">Hayvan satıcılarından alım</p>
              </div>
            </div>

            {/* Animal Seller Listings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Hayvan Satıcı İlanları</CardTitle>
                  <Button variant="ghost" size="sm">
                    Tümü <ChevronRight className="size-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSellerListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="p-3 rounded-lg bg-card-alt hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-small">{listing.seller}</p>
                            <Badge variant="open">AÇIK</Badge>
                          </div>
                          <p className="text-small mb-1">{listing.breed}</p>
                          <p className="text-caption text-muted-foreground">
                            {listing.category} · {listing.count} baş · {listing.avgWeight} · {listing.age}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-small font-medium">{listing.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <p className="text-caption text-muted-foreground">{listing.location}</p>
                        <Button variant="primary" size="sm">
                          Teklif Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My Offers to Sellers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Verdiğim Teklifler</CardTitle>
                  <Button variant="ghost" size="sm">
                    Tümü <ChevronRight className="size-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-small mb-1">Ali Yılmaz - Kıvırcık Kuzu</p>
                        <p className="text-caption text-muted-foreground">
                          40 baş · Teklif: ₺183,00 / kg
                        </p>
                      </div>
                      <Badge variant="pending">BEKLEMEDE</Badge>
                    </div>
                    <p className="text-caption text-muted-foreground">2 gün önce</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-small mb-1">Mehmet Demir - Siyah Alaca</p>
                        <p className="text-caption text-muted-foreground">
                          15 baş · Teklif: ₺162,00 / kg
                        </p>
                      </div>
                      <Badge variant="accepted">KABUL EDİLDİ</Badge>
                    </div>
                    <p className="text-caption text-muted-foreground">4 gün önce</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE - SELLING (Meat) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mb-1">Satış Tarafı</h2>
                <p className="text-small text-muted-foreground">Et satışı</p>
              </div>
              <Button variant="primary" size="sm">
                + Et Satış İlanı
              </Button>
            </div>

            {/* My Meat Listings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Et Satış İlanlarım</CardTitle>
                  <Button variant="ghost" size="sm">
                    Tümü <ChevronRight className="size-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myMeatListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-small">{listing.meatType}</p>
                            <Badge variant="open">AÇIK</Badge>
                          </div>
                          <p className="text-caption text-muted-foreground">{listing.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-small font-medium">{listing.price}</p>
                          <p className="text-caption text-muted-foreground">
                            {listing.offerCount} teklif
                          </p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full">
                        Teklifleri Görüntüle
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Buyer Offers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Son Alınan Teklifler</CardTitle>
                  <Button variant="ghost" size="sm">
                    Tümü <ChevronRight className="size-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBuyerOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-3 rounded-lg bg-card-alt hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-small mb-1">{offer.buyer}</p>
                          <p className="text-caption text-muted-foreground">
                            {offer.listingType} · {offer.quantity}
                          </p>
                        </div>
                        <Badge variant="pending">BEKLEMEDE</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-small font-medium">{offer.offeredPrice}</p>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm">
                            Reddet
                          </Button>
                          <Button variant="primary" size="sm">
                            Kabul Et
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="size-2 rounded-full bg-secondary mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-small">
                    <span className="font-medium">Beyaz Et Kasap</span> Dana Biftek ilanınıza teklif verdi
                    <span className="text-muted-foreground"> · Et Satış Tarafı</span>
                  </p>
                  <p className="text-caption text-muted-foreground">15 dakika önce</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="size-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-small">
                    <span className="font-medium">Ali Yılmaz</span> ilanına teklif verdiniz (₺183,00 / kg)
                    <span className="text-muted-foreground"> · Hayvan Alım Tarafı</span>
                  </p>
                  <p className="text-caption text-muted-foreground">2 saat önce</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="size-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-small">
                    Yeni et satış ilanı oluşturdunuz: <span className="font-medium">Kuzu But (200 kg)</span>
                    <span className="text-muted-foreground"> · Et Satış Tarafı</span>
                  </p>
                  <p className="text-caption text-muted-foreground">1 gün önce</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="size-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-small">
                    <span className="font-medium">Mehmet Demir</span> teklifinizi kabul etti
                    <span className="text-muted-foreground"> · Hayvan Alım Tarafı</span>
                  </p>
                  <p className="text-caption text-muted-foreground">4 gün önce</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
