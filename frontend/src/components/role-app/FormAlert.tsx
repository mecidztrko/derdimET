type FormAlertProps = {
  variant: 'error' | 'success'
  message: string
}

export function FormAlert({ variant, message }: FormAlertProps) {
  const styles =
    variant === 'error'
      ? 'border-red-200 bg-red-50 text-red-800'
      : 'border-emerald-200 bg-emerald-50 text-emerald-800'
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`} role="alert">
      {message}
    </div>
  )
}
