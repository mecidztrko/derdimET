import { MessagesInbox } from '../../components/role-app/MessagesInbox'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

export function SellerMessages() {
  return (
    <RoleAppPage fill className="flex min-h-0 flex-col">
      <div className="mb-6 shrink-0">
        <PageHeader title="Mesajlar" description="İş ortaklarınızla iletişim kurun" />
      </div>
      <MessagesInbox className="min-h-0 flex-1" />
    </RoleAppPage>
  )
}
