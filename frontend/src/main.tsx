import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

{
  const q = new URLSearchParams(window.location.search)
  const pathOnly = window.location.pathname.split('?')[0]
  if (q.get('r') === 'dashboard') {
    window.history.replaceState(null, '', `${pathOnly}#/role-selector`)
  }
  if (q.get('r') === 'login') {
    let hash = '#/login'
    if (q.has('error')) {
      const err = q.get('error')
      hash += err != null && err !== '' ? `?error=${encodeURIComponent(err)}` : '?error=1'
    }
    window.history.replaceState(null, '', `${pathOnly}${hash}`)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
