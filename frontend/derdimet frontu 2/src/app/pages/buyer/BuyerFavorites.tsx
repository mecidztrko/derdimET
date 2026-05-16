import { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/Tabs';
import { Button } from '../../components/Button';
import { ListingCard } from '../../components/ListingCard';
import { Heart, Building2, Star, MapPin, CheckCircle2 } from 'lucide-react';

const mockFavoriteListings = [
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
];

const mockFavoriteSlaughterhouses = [
  {
    id: '1',
    name: 'Anadolu Kesimhane A.Ş.',
    location: 'İstanbul, Pendik',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
    verified: true,
    rating: 4.8,
    totalDeals: 156,
    activeListings: 12,
    specialties: ['Dana', 'Kuzu', 'Vakumlu Paketleme'],
  },
  {
    id: '2',
    name: 'Marmara Kesimevi',
    location: 'Bursa, Gemlik',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200',
    verified: true,
    rating: 4.6,
    totalDeals: 89,
    activeListings: 8,
    specialties: ['Küçükbaş', 'Organik'],
  },
  {
    id: '3',
    name: 'Trakya Kesimhane',
    location: 'Edirne, Keşan',
    logo: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=200',
    verified: true,
    rating: 4.9,
    totalDeals: 203,
    activeListings: 15,
    specialties: ['Dana', 'Soğuk Hava', 'Sertifikalı'],
  },
];

export function BuyerFavorites() {
  const [activeTab, setActiveTab] = useState('listings');

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Favorilerim</h1>
        <p className="text-muted-foreground">
          Beğendiğiniz ürünler ve kesimhaneler
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="listings">
            <Heart className="size-4 mr-2" />
            Favori İlanlar ({mockFavoriteListings.length})
          </TabsTrigger>
          <TabsTrigger value="slaughterhouses">
            <Building2 className="size-4 mr-2" />
            Favori Kesimhaneler ({mockFavoriteSlaughterhouses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          {mockFavoriteListings.length === 0 ? (
            <Card elevation="soft" className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center">
                  <Heart className="size-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2">Henüz favori ilan yok</h3>
                  <p className="text-muted-foreground">
                    Beğendiğiniz ilanları favorilerinize ekleyin
                  </p>
                </div>
                <Button variant="primary">İlanları Keşfet</Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockFavoriteListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  {...listing}
                  showSlaughterhouseLabel
                  isFavorite
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="slaughterhouses">
          {mockFavoriteSlaughterhouses.length === 0 ? (
            <Card elevation="soft" className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center">
                  <Building2 className="size-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2">Henüz favori kesimhane yok</h3>
                  <p className="text-muted-foreground">
                    Güvendiğiniz kesimhaneleri favorilerinize ekleyin
                  </p>
                </div>
                <Button variant="primary">Kesimhane Ara</Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockFavoriteSlaughterhouses.map((slaughterhouse) => (
                <Card key={slaughterhouse.id}>
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      {/* Logo */}
                      <img
                        src={slaughterhouse.logo}
                        alt={slaughterhouse.name}
                        className="size-20 rounded-lg object-cover flex-shrink-0"
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="truncate">{slaughterhouse.name}</h3>
                              {slaughterhouse.verified && (
                                <CheckCircle2 className="size-4 text-success flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-small text-muted-foreground flex items-center gap-1">
                              <MapPin className="size-3" />
                              {slaughterhouse.location}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="flex-shrink-0"
                          >
                            <Heart className="size-4 fill-destructive text-destructive" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="size-4 fill-warning text-warning" />
                            <span className="text-small font-medium">
                              {slaughterhouse.rating}
                            </span>
                          </div>
                          <span className="text-caption text-muted-foreground">
                            {slaughterhouse.totalDeals} başarılı işlem
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {slaughterhouse.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="px-2 py-0.5 bg-primary-soft text-caption rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <p className="text-small text-muted-foreground">
                            {slaughterhouse.activeListings} aktif ilan
                          </p>
                          <Button variant="outline" size="sm">
                            İlanları Gör
                          </Button>
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
    </div>
  );
}
