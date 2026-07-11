import { Link } from 'react-router-dom'

export function StartWorkout() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <h1 className="text-2xl font-semibold">What are you doing today?</h1>
      <div className="flex flex-col gap-4">
        <Link
          to="/start/class"
          className="flex flex-col gap-1 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-brand)]"
        >
          <span className="text-lg font-semibold">Report a Workout Class</span>
          <span className="text-sm text-[var(--color-ink-soft)]">
            Liftonics, St Marks Yoga, Solidcore, SoulCycle, or a class of your own.
          </span>
        </Link>
        <Link
          to="/start/strength"
          className="flex flex-col gap-1 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-brand)]"
        >
          <span className="text-lg font-semibold">Track My Workout</span>
          <span className="text-sm text-[var(--color-ink-soft)]">
            Pick a pre-designed, low ankle-impact strength workout and go.
          </span>
        </Link>
      </div>
    </div>
  )
}
