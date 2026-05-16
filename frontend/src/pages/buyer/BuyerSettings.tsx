import { ProfileSettingsForm } from '../../components/role-app/ProfileSettingsForm'
import { BuyerPurchasesCard } from '../../components/role-app/BuyerPurchasesCard'

export function BuyerSettings() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Ayarlar</h1>
        <p className="text-muted-foreground">Profil ve hesap bilgilerinizi güncelleyin</p>
      </div>
      <ProfileSettingsForm />
      <BuyerPurchasesCard />
    </div>
  )
}
