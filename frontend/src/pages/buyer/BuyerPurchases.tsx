import { BuyerPurchasesCard } from '../../components/role-app/BuyerPurchasesCard'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'

export function BuyerPurchases() {
  return (
    <RoleAppPage>
      <div className="mb-8">
        <h1 className="mb-2">Siparişlerim</h1>
        <p className="text-muted-foreground">Kabul edilen et tekliflerinden oluşan tamamlanan alımlar</p>
      </div>
      <BuyerPurchasesCard />
    </RoleAppPage>
  )
}
