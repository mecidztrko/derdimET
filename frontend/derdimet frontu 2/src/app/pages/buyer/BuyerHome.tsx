import { Heart, TrendingUp, Package, Building2 } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { StatCard } from '../../components/StatCard';
import { ListingCard } from '../../components/ListingCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/Tabs';
import { Button } from '../../components/Button';
import { useState } from 'react';

// Meat Sale Listings - posted by SLAUGHTERHOUSES, viewed by BUYERS
const mockListings = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1760368104193-c960eb4a5c75?w=600',
    title: 'Dana Biftek - Vakumlu Paket',
    seller: {
      name: 'Anadolu Kesimhane A.Ş.',
      location: 'İstanbul, Pendik',
      verified: true,
    },
    price: '₺420,00',
    unit: 'kg',
    quantity: '500 kg',
    status: 'open' as const,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1777799095908-978e9f70a872?w=600',
    title: 'Kuzu But - Taze Kesim',
    seller: {
      name: 'Marmara Kesimevi',
      location: 'Bursa, Gemlik',
      verified: true,
    },
    price: '₺580,00',
    unit: 'kg',
    quantity: '200 kg',
    status: 'open' as const,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1591510669755-5e6dbb1ca33d?w=600',
    title: 'Dana Kıyma - Yağsız',
    seller: {
      name: 'Ege Et Kesimhane',
      location: 'İzmir, Torbalı',
      verified: false,
    },
    price: '₺360,00',
    unit: 'kg',
    quantity: '1 ton',
    status: 'open' as const,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1621800973369-61cd1211f042?w=600',
    title: 'Kuzu Pirzola - Paketli',
    seller: {
      name: 'Ankara Kombinası Ltd.',
      location: 'Ankara, Polatl',
      verified: true,
    },
    price: '₺650,00',
    unit: 'kg',
    quantity: '300 kg',
    status: 'open' as const,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1659881981676-33ab127152c0?w=600',
    title: 'Dana Antrikot - Soğuk Hava',
    seller: {
      name: 'Trakya Kesimhane',
      location: 'Edirne, Keşan',
      verified: true,
    },
    price: '₺480,00',
    unit: 'kg',
    quantity: '400 kg',
    status: 'open' as const,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1777613112369-d4d36ee8e737?w=600',
    title: 'Kuzu Kol - Küçükbaş',
    seller: {
      name: 'Karadeniz Et Kombinası',
      location: 'Samsun, Bafra',
      verified: false,
    },
    price: '₺520,00',
    unit: 'kg',
    quantity: '250 kg',
    status: 'open' as const,
  },
];

const meatTypes = ['Tümü', 'Dana', 'Kuzu', 'Kıyma', 'Biftek', 'Pirzola', 'But', 'Antrikot'];
const animalCategories = ['Tüm Kategoriler', 'Küçükbaş', 'Büyükbaş'];
const cities = ['Tüm Şehirler', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Edirne', 'Samsun'];

export function BuyerHome() {
  const [selectedMeatType, setSelectedMeatType] = useState('Tümü');
  const [selectedAnimalCategory, setSelectedAnimalCategory] = useState('Tüm Kategoriler');
  const [selectedCity, setSelectedCity] = useState('Tüm Şehirler');

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2">Hoş geldiniz, Mehmet</h1>
          <p className="text-muted-foreground">Kesimhanelerden taze et satış ilanları</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Verilen Teklifler"
            value="12"
            icon={TrendingUp}
            trend={{ value: '3 beklemede', positive: true }}
          />
          <StatCard
            title="Favori Kesimhaneler"
            value="8"
            icon={Building2}
          />
          <StatCard
            title="Bu Ay Alımlar"
            value="2.4 ton"
            icon={Package}
            trend={{ value: '+15% geçen aya göre', positive: true }}
          />
        </div>

        {/* Main Content - Tabs */}
        <Tabs defaultValue="listings">
          <TabsList className="mb-6">
            <TabsTrigger value="listings">Taze Et İlanları</TabsTrigger>
            <TabsTrigger value="recommended">Önerilen Kesimhaneler</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {/* Filters */}
            <Card className="mb-6" elevation="soft">
              <CardContent className="py-5">
                <div className="space-y-4">
                  <div>
                    <p className="text-small font-medium mb-3">Et Türü</p>
                    <div className="flex flex-wrap gap-2">
                      {meatTypes.map((type) => (
                        <Chip
                          key={type}
                          selected={selectedMeatType === type}
                          onClick={() => setSelectedMeatType(type)}
                        >
                          {type}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-small font-medium mb-3">Hayvan Kategorisi</p>
                    <div className="flex flex-wrap gap-2">
                      {animalCategories.map((category) => (
                        <Chip
                          key={category}
                          selected={selectedAnimalCategory === category}
                          onClick={() => setSelectedAnimalCategory(category)}
                        >
                          {category}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-small font-medium mb-3">Şehir</p>
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

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockListings.map((listing) => (
                <ListingCard key={listing.id} {...listing} showSlaughterhouseLabel />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommended">
            <Card elevation="soft" className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center">
                  <Building2 className="size-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2">Favori kesimhaneleriniz</h3>
                  <p className="text-muted-foreground max-w-md">
                    Satın alma geçmişinize göre güvendiğiniz kesimhaneleri burada göreceksiniz
                  </p>
                </div>
                <Button variant="secondary">Kesimhane Ara</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
