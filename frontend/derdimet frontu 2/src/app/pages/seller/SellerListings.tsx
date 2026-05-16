import { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/Tabs';
import {
  Package,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  MapPin,
  Calendar,
  TrendingUp,
  X,
  Upload,
  Beef,
} from 'lucide-react';

const mockListings = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
    title: 'Kıvırcık Kuzu - 6 Aylık',
    category: 'Küçükbaş',
    breed: 'Kıvırcık',
    age: '6 ay',
    quantity: '40 baş',
    averageWeight: '35 kg',
    pricePerKg: '₺185,00',
    totalPrice: '₺259.000',
    location: 'Konya, Ereğli',
    status: 'active' as const,
    views: 45,
    offers: 3,
    createdAt: '10 Mayıs 2026',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400',
    title: 'Siyah Alaca Dana - 18 Aylık',
    category: 'Büyükbaş',
    breed: 'Siyah Alaca',
    age: '18 ay',
    quantity: '15 baş',
    averageWeight: '450 kg',
    pricePerKg: '₺165,00',
    totalPrice: '₺1.113.750',
    location: 'Afyon, Sandıklı',
    status: 'active' as const,
    views: 67,
    offers: 5,
    createdAt: '8 Mayıs 2026',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=400',
    title: 'Merinos Kuzu - Toklu',
    category: 'Küçükbaş',
    breed: 'Merinos',
    age: '8 ay',
    quantity: '25 baş',
    averageWeight: '40 kg',
    pricePerKg: '₺180,00',
    totalPrice: '₺180.000',
    location: 'Kayseri, Bünyan',
    status: 'closed' as const,
    views: 89,
    offers: 8,
    createdAt: '1 Mayıs 2026',
    closedAt: '5 Mayıs 2026',
  },
];

export function SellerListings() {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredListings = mockListings.filter((listing) => {
    if (activeTab === 'all') return true;
    return listing.status === activeTab;
  });

  const stats = {
    all: mockListings.length,
    active: mockListings.filter((l) => l.status === 'active').length,
    closed: mockListings.filter((l) => l.status === 'closed').length,
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2">Hayvan İlanlarım</h1>
          <p className="text-muted-foreground">İlanlarınızı oluşturun ve yönetin</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="size-4 mr-2" />
          Yeni İlan Oluştur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card elevation="soft">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">Toplam İlan</p>
                <p className="text-h3 font-semibold">{stats.all}</p>
              </div>
              <Package className="size-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card elevation="soft">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">Aktif İlanlar</p>
                <p className="text-h3 font-semibold">{stats.active}</p>
              </div>
              <Eye className="size-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card elevation="soft">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-muted-foreground">Toplam Görüntülenme</p>
                <p className="text-h3 font-semibold">
                  {mockListings.reduce((sum, l) => sum + l.views, 0)}
                </p>
              </div>
              <TrendingUp className="size-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tümü ({stats.all})</TabsTrigger>
          <TabsTrigger value="active">Aktif ({stats.active})</TabsTrigger>
          <TabsTrigger value="closed">Kapandı ({stats.closed})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredListings.length === 0 ? (
            <Card elevation="soft" className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center">
                  <Package className="size-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2">Henüz ilan yok</h3>
                  <p className="text-muted-foreground max-w-md">
                    İlk hayvan ilanınızı oluşturarak kesimhanelerin tekliflerini almaya başlayın
                  </p>
                </div>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                  <Plus className="size-4 mr-2" />
                  İlk İlanınızı Oluşturun
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      {/* Image */}
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="size-32 rounded-lg object-cover flex-shrink-0"
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="truncate">{listing.title}</h3>
                              <Badge
                                variant={listing.status === 'active' ? 'success' : 'default'}
                              >
                                {listing.status === 'active' ? 'Aktif' : 'Kapandı'}
                              </Badge>
                            </div>
                            <p className="text-small text-muted-foreground flex items-center gap-1 mb-1">
                              <MapPin className="size-3" />
                              {listing.location}
                            </p>
                            <p className="text-small text-muted-foreground flex items-center gap-1">
                              <Calendar className="size-3" />
                              {listing.createdAt}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="size-5" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-caption text-muted-foreground mb-0.5">Kategori</p>
                            <p className="font-medium">{listing.category}</p>
                          </div>
                          <div>
                            <p className="text-caption text-muted-foreground mb-0.5">Miktar</p>
                            <p className="font-medium">{listing.quantity}</p>
                          </div>
                          <div>
                            <p className="text-caption text-muted-foreground mb-0.5">
                              Fiyat / kg
                            </p>
                            <p className="font-semibold text-primary">{listing.pricePerKg}</p>
                          </div>
                          <div>
                            <p className="text-caption text-muted-foreground mb-0.5">
                              Toplam Değer
                            </p>
                            <p className="font-semibold">{listing.totalPrice}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-4 text-small text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="size-4" />
                              {listing.views} görüntülenme
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="size-4" />
                              {listing.offers} teklif
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {listing.status === 'active' && (
                              <>
                                <Button variant="outline" size="sm">
                                  <Edit className="size-4 mr-2" />
                                  Düzenle
                                </Button>
                                <Button variant="ghost" size="sm">
                                  İlanı Kapat
                                </Button>
                              </>
                            )}
                            {listing.status === 'closed' && (
                              <Button variant="outline" size="sm">
                                <Eye className="size-4 mr-2" />
                                Detayları Gör
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2>Yeni Hayvan İlanı Oluştur</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateModal(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="text-small font-medium mb-2 block">
                    Hayvan Fotoğrafları
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="size-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-small text-muted-foreground">
                      Fotoğraf yüklemek için tıklayın veya sürükleyin
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-small font-medium mb-2 block">Kategori</label>
                    <select className="w-full h-10 px-3 border border-border rounded-lg bg-card">
                      <option value="">Seçiniz</option>
                      <option value="kucukbas">Küçükbaş</option>
                      <option value="buyukbas">Büyükbaş</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">Irk</label>
                    <Input placeholder="Örn: Kıvırcık, Siyah Alaca" />
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">Miktar (Baş)</label>
                    <Input type="number" placeholder="40" icon={Beef} />
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">Ortalama Ağırlık (kg)</label>
                    <Input type="number" placeholder="35" />
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">Yaş (Ay)</label>
                    <Input type="number" placeholder="6" />
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">Fiyat / kg (₺)</label>
                    <Input type="number" placeholder="185" />
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">Şehir</label>
                    <select className="w-full h-10 px-3 border border-border rounded-lg bg-card">
                      <option>Konya</option>
                      <option>Ankara</option>
                      <option>İzmir</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">İlçe</label>
                    <Input placeholder="Ereğli" />
                  </div>
                </div>

                <div>
                  <label className="text-small font-medium mb-2 block">Açıklama</label>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 border border-border rounded-lg bg-card resize-none"
                    placeholder="Hayvanlar hakkında detaylı bilgi verin..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    İptal
                  </Button>
                  <Button variant="primary" className="flex-1">
                    İlanı Yayınla
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}