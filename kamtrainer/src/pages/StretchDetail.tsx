import { Link, Navigate, useParams } from 'react-router-dom'
import { getStretchRoutineById, getStretchById } from '../data/stretches'
import { ExerciseLink } from '../components/ExerciseLink'

export function StretchDetail() {
  const { routineId } = useParams<{ routineId: string }>()
  const routine = routineId ? getStretchRoutineById(routineId) : undefined

  if (!routine) return <Navigate to="/stretches" replace />

  const stretches = routine.stretchIds.map(getStretchById).filter((s) => s !== undefined)

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h1 className="text-2xl font-semibold">{routine.name}</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{routine.summary}</p>
        <p className="mt-2 text-xs font-medium text-[var(--color-ink-soft)]">
          {stretches.length} stretches · ~{routine.estMinutes} min · {routine.focus}
        </p>
      </div>

      <ul className="mb-20 flex flex-col gap-3">
        {stretches.map((s, i) => (
          <li
            key={s.id}
            className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4"
          >
            <p className="text-xs font-medium text-[var(--color-ink-soft)]">
              {i + 1}. {s.target}
            </p>
            <p className="font-semibold">{s.name}</p>
            <p className="text-sm text-[var(--color-ink-soft)]">
              {s.holdSeconds}s{s.eachSide ? ' each side' : ' hold'}
            </p>
            <p className="mt-1 text-sm">{s.cue}</p>
            {s.ankleNote && (
              <p className="mt-1 text-xs text-[var(--color-accent)]">🦶 {s.ankleNote}</p>
            )}
            <ExerciseLink href={s.link} />
          </li>
        ))}
      </ul>

      <div className="fixed inset-x-0 bottom-20 z-10 mx-auto w-full max-w-xl px-5">
        <Link
          to={`/stretch/${routine.id}/active`}
          className="block rounded-2xl bg-[var(--color-stretch)] py-4 text-center text-lg font-semibold text-white shadow-lg"
        >
          Start Stretching
        </Link>
      </div>
    </div>
  )
}
