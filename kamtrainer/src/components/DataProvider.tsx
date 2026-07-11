import { useEffect, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDataStore } from '../store/dataStore'
import {
  ensureUserDoc,
  subscribeToClassSessions,
  subscribeToClasses,
  subscribeToStrengthSessions,
} from '../lib/dataService'

// Wires Firestore realtime listeners into the global data store whenever
// the signed-in user changes, and tears them down on sign-out.
export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { setClasses, setClassSessions, setStrengthSessions, setLoading, reset } = useDataStore()

  useEffect(() => {
    if (!user) {
      reset()
      return
    }

    setLoading(true)
    ensureUserDoc(user.uid, user.email)

    const unsubClasses = subscribeToClasses(user.uid, setClasses)
    const unsubClassSessions = subscribeToClassSessions(user.uid, setClassSessions)
    const unsubStrengthSessions = subscribeToStrengthSessions(user.uid, (sessions) => {
      setStrengthSessions(sessions)
      setLoading(false)
    })

    return () => {
      unsubClasses()
      unsubClassSessions()
      unsubStrengthSessions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return children
}
