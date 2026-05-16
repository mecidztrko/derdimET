import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { Button } from './Button'
import { EmailVerificationNotice } from './EmailVerificationNotice'

type RespondToOfferButtonsProps = {
  acting: boolean
  onAccept: () => void
  onReject: () => void
  acceptLabel?: string
  rejectLabel?: string
  className?: string
}

export function RespondToOfferButtons({
  acting,
  onAccept,
  onReject,
  acceptLabel = 'Kabul et',
  rejectLabel = 'Reddet',
  className = '',
}: RespondToOfferButtonsProps) {
  const { blocked } = useEmailVerificationGate()

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {blocked ? <EmailVerificationNotice /> : null}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="flex-1" disabled={acting || blocked} onClick={onReject}>
          {rejectLabel}
        </Button>
        <Button variant="primary" size="sm" className="flex-1" disabled={acting || blocked} onClick={onAccept}>
          {acceptLabel}
        </Button>
      </div>
    </div>
  )
}

