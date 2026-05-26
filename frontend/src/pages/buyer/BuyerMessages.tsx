import { MessagesInbox } from '../../components/role-app/MessagesInbox'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'

export function BuyerMessages() {
  return (
    <RoleAppPage fill className="flex min-h-0 flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="mb-2">Mesajlar</h1>
        <p className="text-muted-foreground">İş ortaklarınızla iletişim kurun</p>
      </div>
      <MessagesInbox className="min-h-0 flex-1" />
    </RoleAppPage>
  )
}
