import { Navigate } from 'react-router-dom'
import { useMe } from '../../hooks/useMe'
import { getRoleHomePath } from '../../lib/roleHomePath'
import { PageLoader } from './PageLoader'

export function AppEntryRedirect() {
  const { user, loading, error } = useMe()
  if (loading) return <PageLoader />
  if (error === 'unauthorized' || !user) return <Navigate to="/login" replace />
  return <Navigate to={getRoleHomePath(user.role)} replace />
}
