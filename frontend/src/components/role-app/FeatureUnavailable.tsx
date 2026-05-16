import { Link } from 'react-router-dom'
import { Construction } from 'lucide-react'
import { Card } from './Card'
import { Button } from './Button'

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
    <div className="max-w-[1440px] mx-auto px-6 py-16">
      <Card elevation="soft" className="max-w-lg mx-auto text-center">
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
    </div>
  )
}
