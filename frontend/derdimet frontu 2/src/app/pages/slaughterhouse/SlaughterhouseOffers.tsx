import { Card } from '../../components/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/Tabs';
import { TrendingUp } from 'lucide-react';

export function SlaughterhouseOffers() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Teklifler</h1>
        <p className="text-muted-foreground">Verdiğiniz ve aldığınız teklifler</p>
      </div>

      <Tabs defaultValue="given">
        <TabsList className="mb-6">
          <TabsTrigger value="given">Verilen Teklifler</TabsTrigger>
          <TabsTrigger value="received">Alınan Teklifler</TabsTrigger>
        </TabsList>

        <TabsContent value="given">
          <Card elevation="soft" className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center">
                <TrendingUp className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="mb-2">Hayvan satıcılarına verilen teklifler</h3>
                <p className="text-muted-foreground max-w-md">
                  Hayvan ilanlarına verdiğiniz teklifler burada görünür
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="received">
          <Card elevation="soft" className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="size-16 rounded-full bg-primary-soft flex items-center justify-center">
                <TrendingUp className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="mb-2">Et alıcılarından alınan teklifler</h3>
                <p className="text-muted-foreground max-w-md">
                  Et satış ilanlarınıza gelen teklifler burada görünür
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
