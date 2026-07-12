import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getWorkoutById } from '../data/workouts'
import { ExerciseLink } from '../components/ExerciseLink'
import { useStopwatch } from '../hooks/useStopwatch'
import { useData } from '../hooks/useData'
import { todayISO, formatDuration } from '../lib/date'

export function ActiveWorkout() {
  const { workoutId } = useParams<{ workoutId: string }>()
  const workout = workoutId ? getWorkoutById(workoutId) : undefined
  const navigate = useNavigate()
  const { saveStrengthSession } = useData()

  const [done, setDone] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const elapsed = useStopwatch(true)

  if (!workout) return <Navigate to="/library" replace />

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function finish() {
    if (!workout) return
    setSaving(true)
    setError(null)
    try {
      await saveStrengthSession({
        workoutId: workout.id,
        workoutName: workout.name,
        date: todayISO(),
        durationSeconds: elapsed,
        completedExerciseIds: Array.from(done),
        totalExercises: workout.exercises.length,
      })
      navigate('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save this workout. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const allDone = done.size === workout.exercises.length

  return (
    <div className="flex flex-col gap-5 pt-2">
      <div className="flex items-center justify-between rounded-2xl bg-[var(--color-ink)] px-5 py-4 text-[var(--color-paper)]">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-70">Elapsed</p>
          <p className="font-display text-3xl font-semibold tabular-nums">
            {formatDuration(elapsed)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide opacity-70">Progress</p>
          <p className="font-display text-2xl font-semibold">
            {done.size}/{workout.exercises.length}
          </p>
        </div>
      </div>

      <h1 className="text-xl font-semibold">{workout.name}</h1>

      <ul className="mb-20 flex flex-col gap-3">
        {workout.exercises.map((ex) => {
          const isDone = done.has(ex.id)
          return (
            <li
              key={ex.id}
              className={`flex gap-4 rounded-2xl border p-4 transition ${
                isDone
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                  : 'border-[var(--color-line)] bg-[var(--color-surface)]'
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold">{ex.name}</p>
                <p className="text-sm text-[var(--color-ink-soft)]">
                  {ex.sets} sets × {ex.reps} · rest {ex.restSeconds}s
                </p>
                <p className="mt-1 text-sm">{ex.cue}</p>
                <ExerciseLink href={ex.link} />
              </div>
              <button
                onClick={() => toggle(ex.id)}
                aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                className={`flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full border-2 text-sm font-bold transition ${
                  isDone
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                    : 'border-[var(--color-line)] text-transparent'
                }`}
              >
                ✓
              </button>
            </li>
          )
        })}
      </ul>

      <div className="fixed inset-x-0 bottom-20 z-10 mx-auto flex w-full max-w-xl flex-col gap-2 px-5">
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-500 shadow-lg">
            {error}
          </p>
        )}
        <button
          onClick={finish}
          disabled={saving}
          className="w-full rounded-2xl bg-[var(--color-brand)] py-4 text-center text-lg font-semibold text-white shadow-lg disabled:opacity-60"
        >
          {saving
            ? 'Saving…'
            : allDone
              ? 'Finish Workout 🎉'
              : `Finish Workout (${done.size}/${workout.exercises.length} done)`}
        </button>
      </div>
    </div>
  )
}
