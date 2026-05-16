import { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import {
  ShoppingCart,
  MapPin,
  Calendar,
  TrendingUp,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Beef,
  X,
} from 'lucide-react';

const mockAnimalListings = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
    seller: {
      name: 'Ali Yılmaz',
      location: 'Konya, Ereğli',
      verified: true,
    },
    title: 'Kıvırcık Kuzu - 6 Aylık',
    breed: 'Kıvırcık',
    category: 'Küçükbaş',
    quantity: '40 baş',
    averageWeight: '35 kg',
    age: '6 ay',
    pricePerKg: '₺185,00',
    totalValue: '₺259.000',
    createdAt: '2 gün önce',
    views: 12,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400',
    seller: {
      name: 'Mehmet Demir',
      location: 'Afyon, Sandıklı',
      verified: true,
    },
    title: 'Siyah Alaca Dana - 18 Aylık',
    breed: 'Siyah Alaca',
    category: 'Büyükbaş',
    quantity: '15 baş',
    averageWeight: '450 kg',
    age: '18 ay',
    pricePerKg: '₺165,00',
    totalValue: '₺1.113.750',
    createdAt: '1 gün önce',
    views: 8,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=400',
    seller: {
      name: 'Hasan Çelik',
      location: 'Kayseri, Bünyan',
      verified: false,
    },
    title: 'Merinos Kuzu - Toklu',
    breed: 'Merinos',
    category: 'Küçükbaş',
    quantity: '60 baş',
    averageWeight: '40 kg',
    age: '8 ay',
    pricePerKg: '₺180,00',
    totalValue: '₺432.000',
    createdAt: '3 gün önce',
    views: 15,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400',
    seller: {
      name: 'Fatma Arslan',
      location: 'Sivas, Kangal',
      verified: true,
    },
    title: 'Yerli Irkı Dana - Genç',
    breed: 'Yerli Irk',
    category: 'Büyükbaş',
    quantity: '12 baş',
    averageWeight: '380 kg',
    age: '16 ay',
    pricePerKg: '₺170,00',
    totalValue: '₺775.200',
    createdAt: '4 gün önce',
    views: 10,
  },
];

const categories = ['Tümü', 'Küçükbaş', 'Büyükbaş'];
const cities = ['Tüm Şehirler', 'Konya', 'Ankara', 'Afyon', 'Kayseri', 'Sivas'];
const priceRanges = ['Tümü', '₺0-150', '₺150-175', '₺175-200', '₺200+'];

export function SlaughterhouseBuyAnimals() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedCity, setSelectedCity] = useState('Tüm Şehirler');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Tümü');
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<typeof mockAnimalListings[0] | null>(null);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Hayvan Satın Al</h1>
        <p className="text-muted-foreground">
          Hayvan satıcılarının ilanlarını inceleyin ve teklif verin
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-3">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Irk, satıcı, şehir ara..."
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
                <p className="text-small font-medium mb-3">Kategori</p>
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
          {mockAnimalListings.length} ilan bulundu
        </p>
        <select className="px-3 py-1.5 text-small border border-border rounded-lg bg-card">
          <option>Sırala: Yeniden Eskiye</option>
          <option>Fiyat: Düşükten Yükseğe</option>
          <option>Fiyat: Yüksekten Düşüğe</option>
          <option>Miktar: En Fazla</option>
        </select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAnimalListings.map((listing) => (
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
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 truncate">{listing.title}</h3>
                      <p className="text-small text-muted-foreground mb-1">
                        {listing.seller.name}
                        {listing.seller.verified && (
                          <CheckCircle2 className="size-3 inline ml-1 text-success" />
                        )}
                      </p>
                      <p className="text-small text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3" />
                        {listing.seller.location}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-caption text-muted-foreground mb-0.5">Miktar</p>
                      <p className="font-medium">{listing.quantity}</p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground mb-0.5">Ort. Ağırlık</p>
                      <p className="font-medium">{listing.averageWeight}</p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground mb-0.5">Yaş</p>
                      <p className="font-medium">{listing.age}</p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground mb-0.5">Fiyat / kg</p>
                      <p className="font-semibold text-primary">{listing.pricePerKg}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-3 text-caption text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {listing.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="size-3" />
                        {listing.views} görüntüleme
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedListing(listing);
                        setShowOfferModal(true);
                      }}
                    >
                      Teklif Ver
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Offer Modal */}
      {showOfferModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2>Teklif Ver</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowOfferModal(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Listing Info */}
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium mb-1">{selectedListing.title}</p>
                  <p className="text-small text-muted-foreground mb-2">
                    {selectedListing.seller.name} · {selectedListing.seller.location}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-small">
                    <div>
                      <span className="text-muted-foreground">Miktar:</span>{' '}
                      <span className="font-medium">{selectedListing.quantity}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">İlan Fiyatı:</span>{' '}
                      <span className="font-medium">{selectedListing.pricePerKg}</span>
                    </div>
                  </div>
                </div>

                {/* Offer Form */}
                <div>
                  <label className="text-small font-medium mb-2 block">
                    Teklif Miktarı (Baş)
                  </label>
                  <Input type="number" placeholder="40" icon={Beef} />
                </div>

                <div>
                  <label className="text-small font-medium mb-2 block">
                    Teklif Fiyatı (₺ / kg)
                  </label>
                  <Input type="number" placeholder="185" />
                </div>

                <div>
                  <label className="text-small font-medium mb-2 block">
                    Mesaj (İsteğe Bağlı)
                  </label>
                  <textarea
                    className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-card resize-none"
                    placeholder="Satıcıya not bırakın..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowOfferModal(false)}
                  >
                    İptal
                  </Button>
                  <Button variant="primary" className="flex-1">
                    Teklifi Gönder
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