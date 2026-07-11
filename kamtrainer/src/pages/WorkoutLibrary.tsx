import { Link } from 'react-router-dom'
import { workouts, AVOIDED_MOVEMENTS } from '../data/workouts'

const WORKOUT_EMOJI: Record<string, string> = {
  'lower-ankle-safe': '🦵',
  'upper-push': '💪',
  'upper-pull': '🏋️',
  'glutes-core': '🍑',
  'full-body-circuit': '🔁',
}

export function WorkoutLibrary() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <div>
        <h1 className="text-2xl font-semibold">Ankle-Safe Workouts</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Pick a session. All exercises are machine/cable or hip-hinge based, keeping the ankle
          neutral and out of deep flexion or impact.
        </p>
      </div>

      <details className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-sm">
        <summary className="cursor-pointer font-medium">What we intentionally skip &amp; why</summary>
        <ul className="mt-2 list-disc pl-5 text-[var(--color-ink-soft)]">
          {AVOIDED_MOVEMENTS.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p className="mt-2 text-[var(--color-ink-soft)]">
          These load the ankle through a deep dorsiflexed range or with impact. Volume instead
          comes from seated/machine and hip-hinge movements.
        </p>
      </details>

      <ul className="flex flex-col gap-3">
        {workouts.map((w) => (
          <li key={w.id}>
            <Link
              to={`/workout/${w.id}`}
              className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-brand)]"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-2xl">
                {WORKOUT_EMOJI[w.id] ?? '🏋️'}
              </span>
              <div className="flex-1">
                <p className="font-semibold">{w.name}</p>
                <p className="text-sm text-[var(--color-ink-soft)]">{w.focus}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                  {w.exercises.length} exercises · ~{w.estMinutes} min
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
