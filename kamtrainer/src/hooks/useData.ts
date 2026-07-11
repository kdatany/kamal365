import { useMemo } from 'react'
import { useAuth } from './useAuth'
import { useDataStore } from '../store/dataStore'
import { PRESET_CLASSES } from '../data/classes'
import { addCustomClass, logClassSession, logStrengthSession } from '../lib/dataService'
import type { LoggedEntry, StrengthSession, WorkoutClass } from '../types'

export function useData() {
  const { user } = useAuth()
  const { classes, classSessions, strengthSessions, loading } = useDataStore()

  const allClasses: WorkoutClass[] = useMemo(() => {
    const customNames = new Set(classes.map((c) => c.name.toLowerCase()))
    const presets = PRESET_CLASSES.filter((p) => !customNames.has(p.name.toLowerCase()))
    return [...presets, ...classes]
  }, [classes])

  const classCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const session of classSessions) {
      counts.set(session.classId, (counts.get(session.classId) ?? 0) + 1)
    }
    return counts
  }, [classSessions])

  const entriesByDate = useMemo(() => {
    const map = new Map<string, LoggedEntry[]>()
    for (const s of classSessions) {
      const list = map.get(s.date) ?? []
      list.push({ kind: 'class', ...s })
      map.set(s.date, list)
    }
    for (const s of strengthSessions) {
      const list = map.get(s.date) ?? []
      list.push({ kind: 'strength', ...s })
      map.set(s.date, list)
    }
    return map
  }, [classSessions, strengthSessions])

  async function addClass(name: string, color: string) {
    if (!user) throw new Error('Not signed in')
    return addCustomClass(user.uid, name, color)
  }

  async function checkInClass(classId: string, className: string, date: string) {
    if (!user) throw new Error('Not signed in')
    return logClassSession(user.uid, classId, className, date)
  }

  async function saveStrengthSession(session: Omit<StrengthSession, 'id' | 'createdAt'>) {
    if (!user) throw new Error('Not signed in')
    return logStrengthSession(user.uid, session)
  }

  return {
    loading,
    classes: allClasses,
    classSessions,
    strengthSessions,
    classCounts,
    entriesByDate,
    addClass,
    checkInClass,
    saveStrengthSession,
  }
}
