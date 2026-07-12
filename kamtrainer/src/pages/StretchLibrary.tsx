import { Link } from 'react-router-dom'
import { stretchRoutines, stretches, STRETCH_CATEGORIES } from '../data/stretches'
import { ExerciseLink } from '../components/ExerciseLink'
import { SectionToggle } from '../components/SectionToggle'

const ROUTINE_EMOJI: Record<string, string> = {
  'post-lift-cooldown': '🧊',
  'upper-body-reset': '🙆',
  'hips-hamstrings-release': '🦵',
  'desk-break': '💺',
}

export function StretchLibrary() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <SectionToggle active="stretches" />

      <div>
        <h1 className="text-2xl font-semibold">Stretches</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Run a guided routine with a hold-timer, or browse the full catalog below for a specific
          stretch.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {stretchRoutines.map((r) => (
          <li key={r.id}>
            <Link
              to={`/stretch/${r.id}`}
              className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-brand)]"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--color-stretch-soft)] text-2xl">
                {ROUTINE_EMOJI[r.id] ?? '🧘'}
              </span>
              <div className="flex-1">
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-[var(--color-ink-soft)]">{r.focus}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                  {r.stretchIds.length} stretches · ~{r.estMinutes} min
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
          Full catalog
        </h2>
        <div className="flex flex-col gap-5">
          {STRETCH_CATEGORIES.map((category) => {
            const items = stretches.filter((s) => s.category === category)
            if (items.length === 0) return null
            return (
              <div key={category}>
                <h3 className="mb-2 text-sm font-semibold text-[var(--color-ink)]">{category}</h3>
                <ul className="flex flex-col gap-2">
                  {items.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3"
                    >
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-[var(--color-ink-soft)]">
                        {s.target} · {s.holdSeconds}s{s.eachSide ? ' each side' : ' hold'}
                      </p>
                      <p className="mt-1 text-sm">{s.cue}</p>
                      {s.ankleNote && (
                        <p className="mt-1 text-xs text-[var(--color-accent)]">🦶 {s.ankleNote}</p>
                      )}
                      <ExerciseLink href={s.link} />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
