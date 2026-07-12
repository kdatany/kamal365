import type { LoggedEntry } from '../types'

type Kind = LoggedEntry['kind']

export const ENTRY_DOT_COLOR: Record<Kind, string> = {
  class: 'var(--color-accent)',
  strength: 'var(--color-brand)',
  stretch: 'var(--color-stretch)',
}

export const ENTRY_BADGE_CLASS: Record<Kind, string> = {
  class: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
  strength: 'bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]',
  stretch: 'bg-[var(--color-stretch-soft)] text-[var(--color-stretch)]',
}

export const ENTRY_BADGE_LABEL: Record<Kind, string> = {
  class: 'Class',
  strength: 'Strength',
  stretch: 'Stretch',
}

export function entryTitle(entry: LoggedEntry): string {
  switch (entry.kind) {
    case 'class':
      return entry.className
    case 'strength':
      return entry.workoutName
    case 'stretch':
      return entry.routineName
  }
}
