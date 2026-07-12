import { Link } from 'react-router-dom'

export function SectionToggle({ active }: { active: 'strength' | 'stretches' }) {
  const base = 'flex-1 rounded-full py-2 text-center text-sm font-medium transition'
  const on = 'bg-[var(--color-ink)] text-[var(--color-paper)]'
  const off = 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'

  return (
    <div className="flex gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] p-1">
      <Link to="/library" className={`${base} ${active === 'strength' ? on : off}`}>
        Strength Workouts
      </Link>
      <Link to="/stretches" className={`${base} ${active === 'stretches' ? on : off}`}>
        Stretches
      </Link>
    </div>
  )
}
