import { ProfileSettingsForm } from '../../components/role-app/ProfileSettingsForm'
import { SellerFavoriteSlaughterhouses } from '../../components/role-app/SellerFavoriteSlaughterhouses'
import { SellerSalesCard } from '../../components/role-app/SellerSalesCard'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'

export function SellerSettings() {
  return (
    <RoleAppPage>
      <div className="mb-8">
        <h1 className="mb-2">Ayarlar</h1>
        <p className="text-muted-foreground">Profil ve hesap bilgilerinizi güncelleyin</p>
      </div>
      <ProfileSettingsForm />
      <SellerFavoriteSlaughterhouses />
      <SellerSalesCard />
    </RoleAppPage>
  )
}
