import { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/Tabs';
import {
  User,
  Building,
  Bell,
  Shield,
  CreditCard,
  Save,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

export function BuyerSettings() {
  const [formData, setFormData] = useState({
    // Profile
    fullName: 'Mehmet Yılmaz',
    email: 'mehmet@example.com',
    phone: '+90 532 123 4567',
    // Company
    companyName: 'Yılmaz Et Ürünleri Ltd.',
    taxNumber: '1234567890',
    address: 'Atatürk Cad. No:123',
    city: 'İstanbul',
    district: 'Kadıköy',
    postalCode: '34000',
  });

  const [notifications, setNotifications] = useState({
    newListings: true,
    offerUpdates: true,
    messages: true,
    priceAlerts: false,
    weeklyDigest: true,
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Ayarlar</h1>
        <p className="text-muted-foreground">Profil ve hesap ayarlarınızı yönetin</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <User className="size-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building className="size-4 mr-2" />
            Firma Bilgileri
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="size-4 mr-2" />
            Bildirimler
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="size-4 mr-2" />
            Güvenlik
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="size-4 mr-2" />
            Ödeme
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6">Kişisel Bilgiler</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-h3 font-medium text-primary">MY</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Fotoğraf Yükle
                    </Button>
                    <p className="text-caption text-muted-foreground mt-2">
                      JPG veya PNG. Maksimum 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-small font-medium mb-2 block">
                      Ad Soyad
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      icon={User}
                    />
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">
                      E-posta
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      icon={Mail}
                    />
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">
                      Telefon
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      icon={Phone}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="primary">
                    <Save className="size-4 mr-2" />
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6">Firma Bilgileri</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-small font-medium mb-2 block">
                      Firma Adı
                    </label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                      icon={Building}
                    />
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">
                      Vergi Numarası
                    </label>
                    <Input
                      value={formData.taxNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, taxNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-small font-medium mb-2 block">
                      Adres
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      icon={MapPin}
                    />
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">
                      Şehir
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full h-10 px-3 border border-border rounded-lg bg-card"
                    >
                      <option>İstanbul</option>
                      <option>Ankara</option>
                      <option>İzmir</option>
                      <option>Bursa</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">
                      İlçe
                    </label>
                    <Input
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-small font-medium mb-2 block">
                      Posta Kodu
                    </label>
                    <Input
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="primary">
                    <Save className="size-4 mr-2" />
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6">Bildirim Tercihleri</h3>
              
              <div className="space-y-4">
                {[
                  {
                    key: 'newListings',
                    label: 'Yeni İlanlar',
                    description: 'Yeni et satış ilanları yayınlandığında bildirim al',
                  },
                  {
                    key: 'offerUpdates',
                    label: 'Teklif Güncellemeleri',
                    description: 'Teklifleriniz kabul edildiğinde veya reddedildiğinde bildirim al',
                  },
                  {
                    key: 'messages',
                    label: 'Mesajlar',
                    description: 'Yeni mesaj geldiğinde bildirim al',
                  },
                  {
                    key: 'priceAlerts',
                    label: 'Fiyat Uyarıları',
                    description: 'Favori ürünlerin fiyatı değiştiğinde bildirim al',
                  },
                  {
                    key: 'weeklyDigest',
                    label: 'Haftalık Özet',
                    description: 'Haftalık aktivite özeti e-postası al',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium mb-0.5">{item.label}</p>
                      <p className="text-small text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button variant="primary">
                    <Save className="size-4 mr-2" />
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6">Güvenlik Ayarları</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="mb-4">Şifre Değiştir</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-small font-medium mb-2 block">
                        Mevcut Şifre
                      </label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="text-small font-medium mb-2 block">
                        Yeni Şifre
                      </label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="text-small font-medium mb-2 block">
                        Yeni Şifre (Tekrar)
                      </label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <Button variant="primary">Şifreyi Güncelle</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h4 className="mb-4">İki Faktörlü Doğrulama</h4>
                  <p className="text-small text-muted-foreground mb-4">
                    Hesabınızı daha güvenli hale getirmek için iki faktörlü doğrulamayı etkinleştirin.
                  </p>
                  <Button variant="outline">İki Faktörlü Doğrulamayı Etkinleştir</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6">Ödeme Bilgileri</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-primary-soft border border-primary/20 rounded-lg">
                  <p className="text-small">
                    <strong>derdimET</strong> platformu şu anda ücretsizdir. 
                    İşlem bazlı komisyon modeline geçildiğinde burada ödeme bilgilerinizi yönetebileceksiniz.
                  </p>
                </div>

                <div>
                  <h4 className="mb-4">İşlem Geçmişi</h4>
                  <div className="text-center py-8 text-muted-foreground">
                    Henüz işlem kaydı bulunmuyor
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
