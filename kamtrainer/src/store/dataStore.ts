import { create } from 'zustand'
import type { ClassSession, StretchSession, StrengthSession, WorkoutClass } from '../types'
import {
  fetchClasses,
  fetchClassSessions,
  fetchStrengthSessions,
  fetchStretchSessions,
} from '../lib/dataService'

interface DataState {
  loading: boolean
  classes: WorkoutClass[]
  classSessions: ClassSession[]
  strengthSessions: StrengthSession[]
  stretchSessions: StretchSession[]
  refresh: (uid: string) => Promise<void>
  reset: () => void
}

export const useDataStore = create<DataState>((set) => ({
  loading: true,
  classes: [],
  classSessions: [],
  strengthSessions: [],
  stretchSessions: [],
  refresh: async (uid: string) => {
    set({ loading: true })
    const [classes, classSessions, strengthSessions, stretchSessions] = await Promise.all([
      fetchClasses(uid),
      fetchClassSessions(uid),
      fetchStrengthSessions(uid),
      fetchStretchSessions(uid),
    ])
    set({ classes, classSessions, strengthSessions, stretchSessions, loading: false })
  },
  reset: () =>
    set({ classes: [], classSessions: [], strengthSessions: [], stretchSessions: [], loading: true }),
}))
