import { MessagesInbox } from '../../components/role-app/MessagesInbox'

export function SellerMessages() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Mesajlar</h1>
        <p className="text-muted-foreground">Kesimhaneler ve alıcılarla iletişim</p>
      </div>
      <MessagesInbox />
    </div>
  )
}
