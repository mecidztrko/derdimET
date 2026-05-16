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
  FileText,
  Save,
  MapPin,
  Phone,
  Mail,
  Upload,
} from 'lucide-react';

export function SellerSettings() {
  const [formData, setFormData] = useState({
    // Profile
    fullName: 'Ahmet Çiftçi',
    email: 'ahmet@example.com',
    phone: '+90 532 987 6543',
    // Farm
    farmName: 'Çiftçi Hayvancılık',
    taxNumber: '9876543210',
    address: 'Kırsal Mahalle No:45',
    city: 'Konya',
    district: 'Ereğli',
    postalCode: '42300',
  });

  const [notifications, setNotifications] = useState({
    newOffers: true,
    offerUpdates: true,
    messages: true,
    marketPrices: true,
    weeklyReport: false,
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
          <TabsTrigger value="farm">
            <Building className="size-4 mr-2" />
            Çiftlik Bilgileri
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="size-4 mr-2" />
            Bildirimler
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="size-4 mr-2" />
            Güvenlik
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="size-4 mr-2" />
            Belgeler
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6">Kişisel Bilgiler</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="size-20 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="text-h3 font-medium text-secondary">AÇ</span>
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
                  <Button variant="secondary">
                    <Save className="size-4 mr-2" />
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Farm Tab */}
        <TabsContent value="farm">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6">Çiftlik / İşletme Bilgileri</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-small font-medium mb-2 block">
                      İşletme Adı
                    </label>
                    <Input
                      value={formData.farmName}
                      onChange={(e) =>
                        setFormData({ ...formData, farmName: e.target.value })
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
                      <option>Konya</option>
                      <option>Ankara</option>
                      <option>Afyon</option>
                      <option>Kayseri</option>
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
                  <Button variant="secondary">
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
                    key: 'newOffers',
                    label: 'Yeni Teklifler',
                    description: 'İlanlarınıza yeni teklif geldiğinde bildirim al',
                  },
                  {
                    key: 'offerUpdates',
                    label: 'Teklif Güncellemeleri',
                    description: 'Teklif durumu değiştiğinde bildirim al',
                  },
                  {
                    key: 'messages',
                    label: 'Mesajlar',
                    description: 'Yeni mesaj geldiğinde bildirim al',
                  },
                  {
                    key: 'marketPrices',
                    label: 'Pazar Fiyatları',
                    description: 'Pazar fiyatlarında büyük değişiklik olduğunda bilgilendir',
                  },
                  {
                    key: 'weeklyReport',
                    label: 'Haftalık Rapor',
                    description: 'İlan performansı haftalık raporu al',
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
                      <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button variant="secondary">
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
                    <Button variant="secondary">Şifreyi Güncelle</Button>
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

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6">Belgeler ve Sertifikalar</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-primary-soft border border-primary/20 rounded-lg mb-6">
                  <p className="text-small">
                    <strong>Not:</strong> Hayvan satışlarınız için gerekli belgeleri yükleyin. 
                    Doğrulanmış satıcı olmak için Tarım Bakanlığı kayıt belgesi gereklidir.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: 'Tarım Bakanlığı Kayıt Belgesi',
                      status: 'uploaded',
                      file: 'tarim-belgesi.pdf',
                    },
                    {
                      label: 'Veteriner Sağlık Raporu',
                      status: 'uploaded',
                      file: 'saglik-raporu.pdf',
                    },
                    {
                      label: 'Vergi Levhası',
                      status: 'none',
                    },
                    {
                      label: 'İşletme Tescil Belgesi',
                      status: 'none',
                    },
                  ].map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium mb-1">{doc.label}</p>
                        {doc.status === 'uploaded' ? (
                          <p className="text-small text-success">✓ Yüklendi: {doc.file}</p>
                        ) : (
                          <p className="text-small text-muted-foreground">Henüz yüklenmedi</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="size-4 mr-2" />
                        {doc.status === 'uploaded' ? 'Değiştir' : 'Yükle'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
