import { create } from 'zustand'
import type { ClassSession, StrengthSession, WorkoutClass } from '../types'
import { fetchClasses, fetchClassSessions, fetchStrengthSessions } from '../lib/dataService'

interface DataState {
  loading: boolean
  classes: WorkoutClass[]
  classSessions: ClassSession[]
  strengthSessions: StrengthSession[]
  refresh: (uid: string) => Promise<void>
  reset: () => void
}

export const useDataStore = create<DataState>((set) => ({
  loading: true,
  classes: [],
  classSessions: [],
  strengthSessions: [],
  refresh: async (uid: string) => {
    set({ loading: true })
    const [classes, classSessions, strengthSessions] = await Promise.all([
      fetchClasses(uid),
      fetchClassSessions(uid),
      fetchStrengthSessions(uid),
    ])
    set({ classes, classSessions, strengthSessions, loading: false })
  },
  reset: () => set({ classes: [], classSessions: [], strengthSessions: [], loading: true }),
}))
