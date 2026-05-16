import { Package, TrendingUp, Beef, Plus } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card, CardContent } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { StatCard } from '../../components/StatCard';
import { ListingCard } from '../../components/ListingCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/Tabs';
import { useState } from 'react';

// Animal Listings - posted by OTHER SELLERS, viewed by SELLERS (read-only for inspiration)
const otherSellerListings = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600',
    title: 'Kıvırcık Kuzu - 6 Aylık',
    seller: {
      name: 'Ali Yılmaz',
      location: 'Konya, Ereğli',
      verified: true,
    },
    price: '₺185,00',
    unit: 'kg',
    quantity: '40 baş',
    status: 'open' as const,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=600',
    title: 'Siyah Alaca Dana - 18 Aylık',
    seller: {
      name: 'Mehmet Demir',
      location: 'Afyon, Sandıklı',
      verified: true,
    },
    price: '₺165,00',
    unit: 'kg',
    quantity: '15 baş',
    status: 'open' as const,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=600',
    title: 'Merinos Kuzu - Toklu',
    seller: {
      name: 'Hasan Çelik',
      location: 'Kayseri, Bünyan',
      verified: false,
    },
    price: '₺180,00',
    unit: 'kg',
    quantity: '60 baş',
    status: 'open' as const,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600',
    title: 'Yerli Irkı Dana - Genç',
    seller: {
      name: 'Fatma Arslan',
      location: 'Sivas, Kangal',
      verified: true,
    },
    price: '₺170,00',
    unit: 'kg',
    quantity: '12 baş',
    status: 'open' as const,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1583594185671-0a5e9eeaa4a4?w=600',
    title: 'Akkaraman Kuzu - 7 Aylık',
    seller: {
      name: 'İbrahim Kaya',
      location: 'Ankara, Haymana',
      verified: true,
    },
    price: '₺190,00',
    unit: 'kg',
    quantity: '50 baş',
    status: 'open' as const,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=600',
    title: 'Montofon Dana - Besi',
    seller: {
      name: 'Ahmet Öz',
      location: 'Erzurum, Aşkale',
      verified: false,
    },
    price: '₺172,00',
    unit: 'kg',
    quantity: '10 baş',
    status: 'open' as const,
  },
];

const categories = ['Tümü', 'Küçükbaş', 'Büyükbaş'];
const cities = ['Tüm Şehirler', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Edirne', 'Samsun'];

export function SellerHome() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedCity, setSelectedCity] = useState('Tüm Şehirler');

  const filteredListings = otherSellerListings.filter((listing) => {
    if (selectedCategory !== 'Tümü') {
      // Filter by category if needed - for now show all
    }
    return true;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2">Hoş geldiniz, Ahmet</h1>
          <p className="text-muted-foreground">Hayvan ilanları ve pazar durumu</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Aktif İlanlarım"
            value="3"
            icon={Package}
            trend={{ value: '8 kesimhane görüntüledi', positive: true }}
          />
          <StatCard
            title="Alınan Teklifler"
            value="12"
            icon={TrendingUp}
            trend={{ value: '5 beklemede', positive: true }}
          />
          <StatCard
            title="Bu Ay Satışlar"
            value="120 baş"
            icon={Beef}
            trend={{ value: '+22% geçen aya göre', positive: true }}
          />
        </div>

        {/* Main Content - Tabs */}
        <Tabs defaultValue="browse">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="browse">Pazar Durumu</TabsTrigger>
              <TabsTrigger value="mylistings">İlanlarım</TabsTrigger>
              <TabsTrigger value="offers">Tekliflerim</TabsTrigger>
            </TabsList>
            <Button variant="primary" size="sm">
              <Plus className="size-4 mr-2" />
              Yeni İlan Oluştur
            </Button>
          </div>

          <TabsContent value="browse">
            {/* Filters */}
            <Card className="mb-6" elevation="soft">
              <CardContent className="py-5">
                <div className="space-y-4">
                  <div>
                    <p className="text-small font-medium mb-3">Hayvan Kategorisi</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Chip
                          key={category}
                          selected={selectedCategory === category}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-small font-medium mb-3">Bölge</p>
                    <div className="flex flex-wrap gap-2">
                      {cities.map((city) => (
                        <Chip
                          key={city}
                          selected={selectedCity === city}
                          onClick={() => setSelectedCity(city)}
                        >
                          {city}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Banner */}
            <Card variant="alt" elevation="none" className="mb-6">
              <CardContent className="py-4">
                <p className="text-small">
                  <span className="font-medium">💡 Pazar Durumu:</span> Diğer hayvan satıcılarının aktif ilanlarını görüntüleyebilirsiniz.
                  Bu ilanlar sadece pazar fiyatlarını takip etmek ve fikir edinmek içindir.
                </p>
              </CardContent>
            </Card>

            {/* Other Sellers' Listings */}
            <div className="mb-4">
              <h3 className="mb-1">Piyasadaki Hayvan İlanları</h3>
              <p className="text-small text-muted-foreground mb-6">
                {filteredListings.length} aktif ilan bulundu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="relative">
                  <ListingCard {...listing} />
                  <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-[var(--radius-card)] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="text-center px-4">
                      <p className="text-small font-medium text-muted-foreground">
                        Sadece görüntüleme
                      </p>
                      <p className="text-caption text-muted-foreground mt-1">
                        Diğer satıcıların ilanları
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mylistings">
            <Card elevation="soft" className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center">
                  <Package className="size-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2">Kendi ilanlarınız</h3>
                  <p className="text-muted-foreground max-w-md">
                    Oluşturduğunuz hayvan satış ilanlarınızı burada göreceksiniz.
                    Kesimhaneler ilanlarınızı görüntüleyip teklif verebilir.
                  </p>
                </div>
                <Button variant="primary">
                  <Plus className="size-4 mr-2" />
                  İlk İlanınızı Oluşturun
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="offers">
            <Card elevation="soft" className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center">
                  <TrendingUp className="size-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2">Gelen teklifler</h3>
                  <p className="text-muted-foreground max-w-md">
                    Kesimhanelerden ilanlarınıza gelen teklifleri burada göreceksiniz.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
