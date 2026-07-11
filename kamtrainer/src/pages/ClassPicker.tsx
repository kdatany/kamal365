import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../hooks/useData'
import { CLASS_COLOR_PALETTE } from '../data/classes'
import { todayISO } from '../lib/date'

export function ClassPicker() {
  const { classes, classCounts, addClass, checkInClass } = useData()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<{ name: string; count: number } | null>(null)

  async function handleCheckIn(classId: string, className: string) {
    setBusyId(classId)
    try {
      await checkInClass(classId, className, todayISO())
      const priorCount = classCounts.get(classId) ?? 0
      setConfirmed({ name: className, count: priorCount + 1 })
    } finally {
      setBusyId(null)
    }
  }

  async function handleAddAndCheckIn(e: React.FormEvent) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    setBusyId('new')
    try {
      const color = CLASS_COLOR_PALETTE[classes.length % CLASS_COLOR_PALETTE.length]
      const id = await addClass(name, color)
      await checkInClass(id, name, todayISO())
      setConfirmed({ name, count: 1 })
      setNewName('')
      setAdding(false)
    } finally {
      setBusyId(null)
    }
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-center gap-4 pt-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-3xl">
          ✓
        </div>
        <h1 className="text-xl font-semibold">Logged {confirmed.name}!</h1>
        <p className="text-[var(--color-ink-soft)]">
          That&apos;s visit <span className="font-semibold text-[var(--color-ink)]">#{confirmed.count}</span>.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-sm font-medium text-[var(--color-paper)]"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <h1 className="text-2xl font-semibold">Which class?</h1>
      <ul className="flex flex-col gap-2">
        {classes.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => handleCheckIn(c.id, c.name)}
              disabled={busyId !== null}
              className="flex w-full items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3.5 text-left transition hover:border-[var(--color-brand)] disabled:opacity-60"
            >
              <span className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: c.color }}
                  aria-hidden
                />
                <span className="font-medium">{c.name}</span>
              </span>
              <span className="text-sm text-[var(--color-ink-soft)]">
                {busyId === c.id ? 'Logging…' : `${classCounts.get(c.id) ?? 0} visits`}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {adding ? (
        <form
          onSubmit={handleAddAndCheckIn}
          className="flex flex-col gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4"
        >
          <label className="text-sm font-medium" htmlFor="new-class-name">
            New class name
          </label>
          <input
            id="new-class-name"
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Y7 Studio"
            className="rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 outline-none focus:border-[var(--color-brand)]"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busyId !== null || !newName.trim()}
              className="flex-1 rounded-full bg-[var(--color-brand)] py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busyId === 'new' ? 'Saving…' : 'Add & log today'}
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-full border border-[var(--color-line)] px-4 py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="rounded-2xl border border-dashed border-[var(--color-line)] py-3.5 text-sm font-medium text-[var(--color-ink-soft)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
        >
          + Add a new class
        </button>
      )}
    </div>
  )
}
