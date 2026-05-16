type Tab = { id: string; label: string }

type Props = {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
}

export function SectionTabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1 rounded-2xl border border-gray-100 bg-gray-50/90 p-1.5">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            active === t.id
              ? 'bg-white text-clinical-700 shadow-sm ring-1 ring-gray-100'
              : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
