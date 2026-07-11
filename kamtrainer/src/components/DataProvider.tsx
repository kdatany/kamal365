import { useEffect, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDataStore } from '../store/dataStore'

// Loads the signed-in user's data from Supabase whenever the user changes,
// and clears it on sign-out.
export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { refresh, reset } = useDataStore()

  useEffect(() => {
    if (!user) {
      reset()
      return
    }
    refresh(user.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return children
}
