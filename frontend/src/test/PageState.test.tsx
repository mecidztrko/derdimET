import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PageState } from '../components/role-app/PageState'
import { validatePassword } from '../lib/formUtils'

describe('PageState', () => {
  it('shows loading spinner', () => {
    render(<PageState loading>content</PageState>)
    expect(screen.getByRole('status', { name: 'Yükleniyor' })).toBeInTheDocument()
    expect(screen.queryByText('content')).not.toBeInTheDocument()
  })

  it('shows error with retry', async () => {
    const onRetry = vi.fn()
    render(
      <PageState error="Sunucu hatası" onRetry={onRetry}>
        content
      </PageState>,
    )
    expect(screen.getByText('Sunucu hatası')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('shows empty state', () => {
    render(
      <PageState empty emptyTitle="Boş" emptyMessage="Kayıt yok">
        content
      </PageState>,
    )
    expect(screen.getByText('Boş')).toBeInTheDocument()
    expect(screen.getByText('Kayıt yok')).toBeInTheDocument()
  })

  it('renders children when ready', () => {
    render(<PageState>İçerik hazır</PageState>)
    expect(screen.getByText('İçerik hazır')).toBeInTheDocument()
  })
})

describe('validatePassword', () => {
  it('rejects weak passwords', () => {
    expect(validatePassword('password')).toContain('büyük harf')
    expect(validatePassword('Password1')).toContain('özel karakter')
  })

  it('accepts strong passwords', () => {
    expect(validatePassword('DerdimET1!')).toBeNull()
  })
})
