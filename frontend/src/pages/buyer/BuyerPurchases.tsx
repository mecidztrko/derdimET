import { BuyerPurchasesCard } from '../../components/role-app/BuyerPurchasesCard'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

export function BuyerPurchases() {
  return (
    <RoleAppPage>
      <PageHeader title="Siparişlerim" description="Tamamlanan alışverişleriniz" />
      <BuyerPurchasesCard />
    </RoleAppPage>
  )
}
