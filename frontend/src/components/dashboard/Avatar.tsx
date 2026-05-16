type Props = {
  src: string | null | undefined
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'h-9 w-9 text-sm', md: 'h-12 w-12 text-base', lg: 'h-20 w-20 text-2xl' }

function initials(name: string) {
  const p = name.trim().split(/\s+/)
  if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase() || '?'
}

export function Avatar({ src, name, size = 'md' }: Props) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`${sizes[size]} rounded-2xl object-cover ring-2 ring-white shadow-md`}
      />
    )
  }
  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-2xl bg-gradient-to-br from-clinical-400 to-clinical-600 font-display font-semibold text-white shadow-md ring-2 ring-white`}
      aria-hidden
    >
      {initials(name)}
    </div>
  )
}
