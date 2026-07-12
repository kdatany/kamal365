import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getStretchRoutineById, getStretchById } from '../data/stretches'
import { ExerciseLink } from '../components/ExerciseLink'
import { useStopwatch } from '../hooks/useStopwatch'
import { useData } from '../hooks/useData'
import { todayISO } from '../lib/date'
import type { Stretch } from '../types'

interface Step {
  stretch: Stretch
  side: 'Left' | 'Right' | null
  isLastStepForStretch: boolean
}

export function ActiveStretch() {
  const { routineId } = useParams<{ routineId: string }>()
  const routine = routineId ? getStretchRoutineById(routineId) : undefined
  const navigate = useNavigate()
  const { saveStretchSession } = useData()

  const steps: Step[] = useMemo(() => {
    if (!routine) return []
    return routine.stretchIds
      .map(getStretchById)
      .filter((s): s is Stretch => s !== undefined)
      .flatMap((stretch): Step[] =>
        stretch.eachSide
          ? [
              { stretch, side: 'Left', isLastStepForStretch: false },
              { stretch, side: 'Right', isLastStepForStretch: true },
            ]
          : [{ stretch, side: null, isLastStepForStretch: true }],
      )
  }, [routine])

  const [stepIndex, setStepIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(steps[0]?.stretch.holdSeconds ?? 0)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const elapsed = useStopwatch(true)

  const step = steps[stepIndex]

  useEffect(() => {
    setSecondsLeft(steps[stepIndex]?.stretch.holdSeconds ?? 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex])

  useEffect(() => {
    if (!step) return
    if (secondsLeft <= 0) {
      const timeout = setTimeout(() => advance(), 400)
      return () => clearTimeout(timeout)
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, stepIndex])

  if (!routine || steps.length === 0) return <Navigate to="/stretches" replace />

  function advance() {
    if (step?.isLastStepForStretch) {
      setCompleted((prev) => new Set(prev).add(step.stretch.id))
    }
    if (stepIndex + 1 >= steps.length) {
      finish()
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  async function finish() {
    if (!routine) return
    const finalCompleted = step?.isLastStepForStretch
      ? new Set(completed).add(step.stretch.id)
      : completed
    setSaving(true)
    try {
      await saveStretchSession({
        routineId: routine.id,
        routineName: routine.name,
        date: todayISO(),
        durationSeconds: elapsed,
        completedStretchIds: Array.from(finalCompleted),
        totalStretches: routine.stretchIds.length,
      })
      navigate('/')
    } finally {
      setSaving(false)
    }
  }

  if (!step) return null

  const progress = completed.size
  const totalMin = Math.floor(elapsed / 60)
  const totalSec = elapsed % 60

  return (
    <div className="flex flex-col gap-5 pt-2">
      <div className="flex items-center justify-between rounded-2xl bg-[var(--color-ink)] px-5 py-4 text-[var(--color-paper)]">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-70">Elapsed</p>
          <p className="font-display text-2xl font-semibold tabular-nums">
            {totalMin}:{totalSec.toString().padStart(2, '0')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide opacity-70">Progress</p>
          <p className="font-display text-xl font-semibold">
            {progress}/{routine.stretchIds.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
          {step.stretch.target}
          {step.side ? ` · ${step.side} side` : ''}
        </p>
        <h1 className="text-2xl font-semibold">{step.stretch.name}</h1>
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[var(--color-stretch)] text-4xl font-bold tabular-nums text-[var(--color-stretch)]">
          {secondsLeft}
        </div>
        <p className="max-w-xs text-sm text-[var(--color-ink-soft)]">{step.stretch.cue}</p>
        {step.stretch.ankleNote && (
          <p className="max-w-xs text-xs text-[var(--color-accent)]">
            🦶 {step.stretch.ankleNote}
          </p>
        )}
        <ExerciseLink href={step.stretch.link} />
      </div>

      <button
        onClick={advance}
        disabled={saving}
        className="rounded-2xl border border-[var(--color-line)] py-3 text-sm font-medium text-[var(--color-ink-soft)] hover:border-[var(--color-stretch)] hover:text-[var(--color-stretch)] disabled:opacity-60"
      >
        Skip ahead
      </button>

      <button
        onClick={finish}
        disabled={saving}
        className="rounded-2xl bg-[var(--color-stretch)] py-4 text-center text-lg font-semibold text-white shadow-lg disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Finish Now'}
      </button>
    </div>
  )
}
