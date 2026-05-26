import { ProfileSettingsForm } from '../../components/role-app/ProfileSettingsForm'
import { BuyerPurchasesCard } from '../../components/role-app/BuyerPurchasesCard'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'

export function BuyerSettings() {
  return (
    <RoleAppPage>
      <div className="mb-8">
        <h1 className="mb-2">Ayarlar</h1>
        <p className="text-muted-foreground">Profil ve hesap bilgilerinizi güncelleyin</p>
      </div>
      <ProfileSettingsForm />
      <BuyerPurchasesCard />
    </RoleAppPage>
  )
}
