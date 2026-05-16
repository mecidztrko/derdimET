import { ProfileSettingsForm } from '../../components/role-app/ProfileSettingsForm'
import { SellerFavoriteSlaughterhouses } from '../../components/role-app/SellerFavoriteSlaughterhouses'
import { SellerSalesCard } from '../../components/role-app/SellerSalesCard'

export function SellerSettings() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Ayarlar</h1>
        <p className="text-muted-foreground">Profil ve hesap bilgilerinizi güncelleyin</p>
      </div>
      <ProfileSettingsForm />
      <SellerFavoriteSlaughterhouses />
      <SellerSalesCard />
    </div>
  )
}
