import { useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { useData } from '../hooks/useData'
import { todayISO, formatDuration } from '../lib/date'
import { ENTRY_BADGE_CLASS, ENTRY_BADGE_LABEL, ENTRY_DOT_COLOR, entryTitle } from '../lib/entryDisplay'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function Calendar() {
  const { entriesByDate } = useData()
  const [month, setMonth] = useState(() => new Date())
  const [selected, setSelected] = useState(() => todayISO())

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month))
    const end = endOfWeek(endOfMonth(month))
    return eachDayOfInterval({ start, end })
  }, [month])

  const selectedEntries = entriesByDate.get(selected) ?? []

  return (
    <div className="flex flex-col gap-5 pt-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="rounded-full border border-[var(--color-line)] px-3 py-1.5 text-sm"
          aria-label="Previous month"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold">{format(month, 'MMMM yyyy')}</h1>
        <button
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="rounded-full border border-[var(--color-line)] px-3 py-1.5 text-sm"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[var(--color-ink-soft)]">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const iso = format(day, 'yyyy-MM-dd')
          const entries = entriesByDate.get(iso) ?? []
          const inMonth = isSameMonth(day, month)
          const isSelected = isSameDay(day, new Date(`${selected}T00:00:00`))
          return (
            <button
              key={iso}
              onClick={() => setSelected(iso)}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl text-sm transition ${
                isSelected
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
                  : isToday(day)
                    ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]'
                    : inMonth
                      ? 'text-[var(--color-ink)] hover:bg-[var(--color-surface)]'
                      : 'text-[var(--color-line)]'
              }`}
            >
              {format(day, 'd')}
              <span className="flex gap-0.5">
                {entries.slice(0, 3).map((e, i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: ENTRY_DOT_COLOR[e.kind] }}
                  />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
          {format(new Date(`${selected}T00:00:00`), 'EEEE, MMM d')}
        </h2>
        {selectedEntries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--color-line)] p-5 text-center text-sm text-[var(--color-ink-soft)]">
            No workouts logged.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {selectedEntries.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3"
              >
                <div>
                  <p className="font-medium">{entryTitle(e)}</p>
                  {e.kind === 'strength' && (
                    <p className="text-xs text-[var(--color-ink-soft)]">
                      {e.completedExerciseIds.length}/{e.totalExercises} exercises ·{' '}
                      {formatDuration(e.durationSeconds)}
                    </p>
                  )}
                  {e.kind === 'stretch' && (
                    <p className="text-xs text-[var(--color-ink-soft)]">
                      {e.completedStretchIds.length}/{e.totalStretches} stretches ·{' '}
                      {formatDuration(e.durationSeconds)}
                    </p>
                  )}
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${ENTRY_BADGE_CLASS[e.kind]}`}>
                  {ENTRY_BADGE_LABEL[e.kind]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
