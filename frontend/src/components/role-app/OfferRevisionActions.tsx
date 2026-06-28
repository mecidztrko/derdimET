import { Button } from './Button'

type OfferRevisionActionsProps = {
  pending: boolean
  onHistory: () => void
  onRevise?: () => void
}

export function OfferRevisionActions({ pending, onRevise, onHistory }: OfferRevisionActionsProps) {
  return (
    <>
      <Button variant="outline" size="sm" type="button" onClick={onHistory}>
        Geçmiş
      </Button>
      {pending && onRevise ? (
        <Button variant="secondary" size="sm" type="button" onClick={onRevise}>
          Revize et
        </Button>
      ) : null}
    </>
  )
}
