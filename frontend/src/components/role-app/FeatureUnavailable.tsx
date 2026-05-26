import { Link } from 'react-router-dom'
import { Construction } from 'lucide-react'
import { Card } from './Card'
import { Button } from './Button'
import { RoleAppPage } from './RoleAppPage'

type FeatureUnavailableProps = {
  title?: string
  description?: string
  backTo?: string
  backLabel?: string
}

export function FeatureUnavailable({
  title = 'Bu bölüm henüz hazır değil',
  description = 'Backend tarafında ilgili API tamamlanmadığı için bu sayfa geçici olarak kapalıdır.',
  backTo = '/role-selector',
  backLabel = 'Panele dön',
}: FeatureUnavailableProps) {
  return (
    <RoleAppPage className="py-16">
      <Card elevation="soft" className="mx-auto max-w-lg text-center">
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center">
            <Construction className="size-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="mb-2">{title}</h2>
            <p className="text-small text-muted-foreground">{description}</p>
          </div>
          <Link to={backTo}>
            <Button variant="secondary">{backLabel}</Button>
          </Link>
        </div>
      </Card>
    </RoleAppPage>
  )
}
