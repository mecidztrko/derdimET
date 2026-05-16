type Props = {
  label: string
  value: string
  hint?: string
}

export function StatCard({ label, value, hint }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white/95 p-5 shadow-sm transition hover:border-clinical-200 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-gray-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
