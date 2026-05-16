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
  Factory,
} from 'lucide-react';

export function SlaughterhouseSettings() {
  const [formData, setFormData] = useState({
    // Profile
    fullName: 'Ahmet Kesici',
    email: 'info@anadolukesimhane.com',
    phone: '+90 532 456 7890',
    // Company
    companyName: 'Anadolu Kesimhane A.Ş.',
    taxNumber: '1234567890',
    address: 'Organize Sanayi Bölgesi 5. Cadde No:23',
    city: 'İstanbul',
    district: 'Pendik',
    postalCode: '34890',
    capacity: '500',
    certifications: 'ISO 9001, HACCP, Helal Sertifika',
  });

  const [notifications, setNotifications] = useState({
    newAnimalListings: true,
    animalOfferResponses: true,
    meatOffers: true,
    messages: true,
    priceChanges: false,
    monthlyReport: true,
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Ayarlar</h1>
        <p className="text-muted-foreground">İşletme ve hesap ayarlarınızı yönetin</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <User className="size-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="facility">
            <Factory className="size-4 mr-2" />
            Kesimhane Bilgileri
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
                  <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <Factory className="size-10 text-primary" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Logo Yükle
                    </Button>
                    <p className="text-caption text-muted-foreground mt-2">
                      JPG veya PNG. Maksimum 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-small font-medium mb-2 block">
                      Yetkili Ad Soyad
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

        {/* Facility Tab */}
        <TabsContent value="facility">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6">Kesimhane / Tesis Bilgileri</h3>
              
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
                      Günlük Kesim Kapasitesi (baş)
                    </label>
                    <Input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: e.target.value })
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
                  <div className="md:col-span-2">
                    <label className="text-small font-medium mb-2 block">
                      Sertifikalar
                    </label>
                    <Input
                      value={formData.certifications}
                      onChange={(e) =>
                        setFormData({ ...formData, certifications: e.target.value })
                      }
                      placeholder="ISO 9001, HACCP, Helal Sertifika"
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
                    key: 'newAnimalListings',
                    label: 'Yeni Hayvan İlanları',
                    description: 'Yeni hayvan satış ilanları yayınlandığında bildirim al',
                  },
                  {
                    key: 'animalOfferResponses',
                    label: 'Hayvan Alım Teklif Yanıtları',
                    description: 'Satıcılar tekliflerinizi yanıtladığında bildirim al',
                  },
                  {
                    key: 'meatOffers',
                    label: 'Et Satış Teklifleri',
                    description: 'Et ilanlarınıza teklif geldiğinde bildirim al',
                  },
                  {
                    key: 'messages',
                    label: 'Mesajlar',
                    description: 'Yeni mesaj geldiğinde bildirim al',
                  },
                  {
                    key: 'priceChanges',
                    label: 'Pazar Fiyat Değişimleri',
                    description: 'Hayvan ve et fiyatlarında büyük değişiklikler olduğunda bildirim al',
                  },
                  {
                    key: 'monthlyReport',
                    label: 'Aylık Rapor',
                    description: 'Aylık performans raporu e-postası al',
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

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6">Belgeler ve Sertifikalar</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-primary-soft border border-primary/20 rounded-lg mb-6">
                  <p className="text-small">
                    <strong>Not:</strong> Kesimhane faaliyetleriniz için gerekli belgeleri yükleyin. 
                    Doğrulanmış kesimhane olmak için Tarım Bakanlığı izin belgesi zorunludur.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: 'Tarım Bakanlığı Faaliyet İzni',
                      status: 'uploaded',
                      file: 'tarim-faaliyet-izni.pdf',
                    },
                    {
                      label: 'ISO 9001 Kalite Sertifikası',
                      status: 'uploaded',
                      file: 'iso-9001.pdf',
                    },
                    {
                      label: 'HACCP Sertifikası',
                      status: 'uploaded',
                      file: 'haccp.pdf',
                    },
                    {
                      label: 'Helal Gıda Sertifikası',
                      status: 'uploaded',
                      file: 'helal-sertifika.pdf',
                    },
                    {
                      label: 'Veteriner Sağlık Raporu',
                      status: 'none',
                    },
                    {
                      label: 'Çevre İzin Belgesi',
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
