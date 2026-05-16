import { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ListingCard } from '../../components/ListingCard';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';

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
      location: 'Ankara, Polatlı',
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
const priceRanges = ['Tümü', '₺0-300', '₺300-500', '₺500-700', '₺700+'];
const cities = ['Tüm Şehirler', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Edirne', 'Samsun'];

export function BuyerSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeatType, setSelectedMeatType] = useState('Tümü');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Tümü');
  const [selectedCity, setSelectedCity] = useState('Tüm Şehirler');
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Et Ürünleri Ara</h1>
        <p className="text-muted-foreground">Kesimhanelerden taze et ilanlarını keşfedin</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-3">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Ürün adı, kesimhane, şehir ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="size-5 mr-2" />
          Filtreler
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
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
                <p className="text-small font-medium mb-3">Fiyat Aralığı (kg)</p>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <Chip
                      key={range}
                      selected={selectedPriceRange === range}
                      onClick={() => setSelectedPriceRange(range)}
                    >
                      {range}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-small font-medium mb-3">
                  <MapPin className="size-4 inline mr-1" />
                  Şehir
                </p>
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
      )}

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-small text-muted-foreground">
          {mockListings.length} ilan bulundu
        </p>
        <select className="px-3 py-1.5 text-small border border-border rounded-lg bg-card">
          <option>Sırala: Yeniden Eskiye</option>
          <option>Fiyat: Düşükten Yükseğe</option>
          <option>Fiyat: Yüksekten Düşüğe</option>
          <option>Miktar: En Fazla</option>
        </select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockListings.map((listing) => (
          <ListingCard key={listing.id} {...listing} showSlaughterhouseLabel />
        ))}
      </div>
    </div>
  );
}