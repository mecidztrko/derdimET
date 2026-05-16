import { useNavigate } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, Beef, Factory } from 'lucide-react';

export function RoleSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="size-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">dE</span>
            </div>
            <h1 className="font-heading">derdimET</h1>
          </div>
          <p className="text-muted-foreground">
            Çiftlikten sofraya dürüst bir pazar yeri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Buyer Card */}
          <Card
            elevation="hover"
            className="cursor-pointer group"
            onClick={() => navigate('/buyer')}
          >
            <div className="flex flex-col items-center text-center p-8">
              <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="size-8 text-primary" />
              </div>
              <h3 className="mb-2">Et Alıcısı</h3>
              <p className="text-small text-muted-foreground mb-6">
                Kasap, restoran veya market. Kesimhanelerden et satın alırsınız.
              </p>
              <Button variant="primary" className="w-full">
                Et Alıcısı Olarak Gir
              </Button>
            </div>
          </Card>

          {/* Seller Card */}
          <Card
            elevation="hover"
            className="cursor-pointer group"
            onClick={() => navigate('/seller')}
          >
            <div className="flex flex-col items-center text-center p-8">
              <div className="size-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Beef className="size-8 text-secondary" />
              </div>
              <h3 className="mb-2">Hayvan Satıcısı</h3>
              <p className="text-small text-muted-foreground mb-6">
                Çiftçi veya besici. Kesimhanelere canlı hayvan satarsınız.
              </p>
              <Button variant="primary" className="w-full">
                Hayvan Satıcısı Olarak Gir
              </Button>
            </div>
          </Card>

          {/* Slaughterhouse Card */}
          <Card
            elevation="hover"
            className="cursor-pointer group"
            onClick={() => navigate('/slaughterhouse')}
          >
            <div className="flex flex-col items-center text-center p-8">
              <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Factory className="size-8 text-primary" />
              </div>
              <h3 className="mb-2">Kesimhane</h3>
              <p className="text-small text-muted-foreground mb-6">
                Çiftçilerden hayvan alıp işleyerek et alıcılarına satarsınız.
              </p>
              <Button variant="primary" className="w-full">
                Kesimhane Olarak Gir
              </Button>
            </div>
          </Card>
        </div>

        <Card variant="alt" elevation="none" className="mt-8 text-center">
          <div className="py-6">
            <p className="text-small text-muted-foreground">
              <span className="font-medium">Demo Amaçlı:</span> Gerçek bir uygulamada önce kayıt olur, sonra rolünüzü seçersiniz.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
