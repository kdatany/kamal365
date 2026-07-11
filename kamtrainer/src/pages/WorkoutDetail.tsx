import { Link, Navigate, useParams } from 'react-router-dom'
import { getWorkoutById } from '../data/workouts'
import { ExerciseLink } from '../components/ExerciseLink'

export function WorkoutDetail() {
  const { workoutId } = useParams<{ workoutId: string }>()
  const workout = workoutId ? getWorkoutById(workoutId) : undefined

  if (!workout) return <Navigate to="/library" replace />

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h1 className="text-2xl font-semibold">{workout.name}</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{workout.summary}</p>
        <p className="mt-2 text-xs font-medium text-[var(--color-ink-soft)]">
          {workout.exercises.length} exercises · ~{workout.estMinutes} min · {workout.focus}
        </p>
      </div>

      <ul className="mb-20 flex flex-col gap-3">
        {workout.exercises.map((ex, i) => (
          <li
            key={ex.id}
            className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4"
          >
            <p className="text-xs font-medium text-[var(--color-ink-soft)]">
              {i + 1}. {ex.primaryMuscle} · {ex.equipment}
            </p>
            <p className="font-semibold">{ex.name}</p>
            <p className="text-sm text-[var(--color-ink-soft)]">
              {ex.sets} sets × {ex.reps} · rest {ex.restSeconds}s
            </p>
            <p className="mt-1 text-sm">{ex.cue}</p>
            {ex.ankleNote && (
              <p className="mt-1 text-xs text-[var(--color-accent)]">🦶 {ex.ankleNote}</p>
            )}
            <ExerciseLink href={ex.link} />
          </li>
        ))}
      </ul>

      <div className="fixed inset-x-0 bottom-20 z-10 mx-auto w-full max-w-xl px-5">
        <Link
          to={`/workout/${workout.id}/active`}
          className="block rounded-2xl bg-[var(--color-brand)] py-4 text-center text-lg font-semibold text-white shadow-lg"
        >
          Start Workout
        </Link>
      </div>
    </div>
  )
}
