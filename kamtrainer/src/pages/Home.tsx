import { Link } from 'react-router-dom'
import { useData } from '../hooks/useData'
import { formatShortDate } from '../lib/date'
import type { LoggedEntry } from '../types'

export function Home() {
  const { classSessions, strengthSessions } = useData()

  const recent: LoggedEntry[] = [
    ...classSessions.map((s) => ({ kind: 'class' as const, ...s })),
    ...strengthSessions.map((s) => ({ kind: 'strength' as const, ...s })),
  ]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6)

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-center gap-4 pt-6 text-center">
        <h1 className="text-2xl font-semibold">Ready to move?</h1>
        <p className="max-w-xs text-sm text-[var(--color-ink-soft)]">
          Log a class or run one of your ankle-safe strength workouts.
        </p>
        <Link
          to="/start"
          className="w-full max-w-xs rounded-2xl bg-[var(--color-brand)] py-4 text-center text-lg font-semibold text-white shadow-md transition hover:opacity-90"
        >
          Start a Workout
        </Link>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
          Recent activity
        </h2>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--color-line)] p-6 text-center text-sm text-[var(--color-ink-soft)]">
            Nothing logged yet — start your first workout above.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recent.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3"
              >
                <div>
                  <p className="font-medium">
                    {entry.kind === 'class' ? entry.className : entry.workoutName}
                  </p>
                  <p className="text-xs text-[var(--color-ink-soft)]">
                    {entry.kind === 'class' ? 'Class' : 'Strength workout'} ·{' '}
                    {formatShortDate(entry.date)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    entry.kind === 'class'
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                      : 'bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]'
                  }`}
                >
                  {entry.kind === 'class' ? 'Class' : 'Strength'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
