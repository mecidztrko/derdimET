import { FeatureUnavailable } from './FeatureUnavailable'

type FeatureRouteProps = {
  enabled: boolean
  children: React.ReactNode
  fallbackTo?: string
  unavailableTitle?: string
  unavailableDescription?: string
}

/** enabled=false ise bilgi sayfası; doğrudan URL ile gelinirse yönlendirme yerine mesaj gösterilir */
export function FeatureRoute({
  enabled,
  children,
  fallbackTo = '/role-selector',
  unavailableTitle,
  unavailableDescription,
}: FeatureRouteProps) {
  if (!enabled) {
    return (
      <FeatureUnavailable
        title={unavailableTitle}
        description={unavailableDescription}
        backTo={fallbackTo}
      />
    )
  }
  return <>{children}</>
}
