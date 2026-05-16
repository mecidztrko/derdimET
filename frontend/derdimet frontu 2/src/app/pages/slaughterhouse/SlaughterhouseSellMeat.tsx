import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Package, Plus } from 'lucide-react';

export function SlaughterhouseSellMeat() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2">Et Satış İlanları</h1>
          <p className="text-muted-foreground">Et alıcılarına yayınladığınız ilanlar</p>
        </div>
        <Button variant="primary">
          <Plus className="size-4 mr-2" />
          Yeni Et İlanı Oluştur
        </Button>
      </div>

      <Card elevation="soft" className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center">
            <Package className="size-8 text-primary" />
          </div>
          <div>
            <h3 className="mb-2">Henüz ilan yok</h3>
            <p className="text-muted-foreground max-w-md">
              Et satış ilanı oluşturarak et alıcılarının tekliflerini almaya başlayın
            </p>
          </div>
          <Button variant="primary">
            <Plus className="size-4 mr-2" />
            İlk İlanınızı Oluşturun
          </Button>
        </div>
      </Card>
    </div>
  );
}
