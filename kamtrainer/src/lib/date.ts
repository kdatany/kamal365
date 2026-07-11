import { format } from 'date-fns'

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatFriendlyDate(iso: string): string {
  return format(new Date(`${iso}T00:00:00`), 'EEEE, MMM d')
}

export function formatShortDate(iso: string): string {
  return format(new Date(`${iso}T00:00:00`), 'MMM d')
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
