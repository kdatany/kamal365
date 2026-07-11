import { create } from 'zustand'
import type { ClassSession, StrengthSession, WorkoutClass } from '../types'

interface DataState {
  loading: boolean
  classes: WorkoutClass[]
  classSessions: ClassSession[]
  strengthSessions: StrengthSession[]
  setLoading: (loading: boolean) => void
  setClasses: (classes: WorkoutClass[]) => void
  setClassSessions: (sessions: ClassSession[]) => void
  setStrengthSessions: (sessions: StrengthSession[]) => void
  reset: () => void
}

export const useDataStore = create<DataState>((set) => ({
  loading: true,
  classes: [],
  classSessions: [],
  strengthSessions: [],
  setLoading: (loading) => set({ loading }),
  setClasses: (classes) => set({ classes }),
  setClassSessions: (classSessions) => set({ classSessions }),
  setStrengthSessions: (strengthSessions) => set({ strengthSessions }),
  reset: () => set({ classes: [], classSessions: [], strengthSessions: [], loading: true }),
}))
