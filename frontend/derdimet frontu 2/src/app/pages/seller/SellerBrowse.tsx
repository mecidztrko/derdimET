import { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { ListingCard } from '../../components/ListingCard';
import { Eye, Info } from 'lucide-react';

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
const priceRanges = ['Tümü', '₺0-150', '₺150-175', '₺175-200', '₺200+'];
const cities = ['Tüm Şehirler', 'Konya', 'Ankara', 'İzmir', 'Afyon', 'Kayseri', 'Sivas'];

export function SellerBrowse() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Tümü');
  const [selectedCity, setSelectedCity] = useState('Tüm Şehirler');

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Pazar Durumu</h1>
        <p className="text-muted-foreground">
          Diğer satıcıların ilanlarını inceleyerek pazar fiyatlarını takip edin
        </p>
      </div>

      {/* Info Banner */}
      <Card variant="alt" elevation="none" className="mb-6">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <Info className="size-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-small font-medium mb-1">
                Bu sayfada sadece görüntüleme yapabilirsiniz
              </p>
              <p className="text-small text-muted-foreground">
                Diğer hayvan satıcılarının aktif ilanlarını görüntüleyebilirsiniz. 
                Bu ilanlar sadece pazar fiyatlarını takip etmek ve fikir edinmek içindir. 
                Satıcılar birbirlerine teklif veremez - sadece kesimhaneler teklif verebilir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Listings Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-small text-muted-foreground">
          {otherSellerListings.length} aktif ilan bulundu
        </p>
        <select className="px-3 py-1.5 text-small border border-border rounded-lg bg-card">
          <option>Sırala: Yeniden Eskiye</option>
          <option>Fiyat: Düşükten Yükseğe</option>
          <option>Fiyat: Yüksekten Düşüğe</option>
          <option>Miktar: En Fazla</option>
        </select>
      </div>

      {/* Listings Grid with Overlay */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherSellerListings.map((listing) => (
          <div key={listing.id} className="relative group">
            <ListingCard {...listing} />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-card/90 backdrop-blur-sm rounded-[var(--radius-card)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="text-center px-4">
                <Eye className="size-8 text-primary mx-auto mb-2" />
                <p className="text-small font-medium">
                  Sadece Görüntüleme
                </p>
                <p className="text-caption text-muted-foreground mt-1">
                  Diğer satıcıların ilanları
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
