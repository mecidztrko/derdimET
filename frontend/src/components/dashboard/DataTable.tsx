import type { ReactNode } from 'react'

export type Column<T> = { key: string; header: string; render?: (row: T) => ReactNode }

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  empty: ReactNode
  rowKey: (row: T) => string | number
}

export function DataTable<T>({ columns, rows, empty, rowKey }: Props<T>) {
  if (rows.length === 0) {
    return <div className="py-6">{empty}</div>
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
        <thead className="bg-clinical-50/60">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-semibold text-gray-600">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition hover:bg-clinical-50/40">
              {columns.map((c) => (
                <td key={c.key} className="whitespace-nowrap px-4 py-3 text-gray-800">
                  {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
