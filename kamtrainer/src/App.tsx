import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { DataProvider } from './components/DataProvider'
import { LoginScreen } from './components/LoginScreen'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { StartWorkout } from './pages/StartWorkout'
import { ClassPicker } from './pages/ClassPicker'
import { WorkoutLibrary } from './pages/WorkoutLibrary'
import { WorkoutDetail } from './pages/WorkoutDetail'
import { ActiveWorkout } from './pages/ActiveWorkout'
import { Calendar } from './pages/Calendar'
import { Coach } from './pages/Coach'
import { isSupabaseConfigured } from './lib/supabase'

function AppRoutes() {
  const { user, authLoading } = useAuth()

  if (isSupabaseConfigured && authLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-[var(--color-ink-soft)]">
        Loading…
      </div>
    )
  }

  if (isSupabaseConfigured && !user) {
    return <LoginScreen />
  }

  return (
    <DataProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<StartWorkout />} />
          <Route path="/start/class" element={<ClassPicker />} />
          <Route path="/start/strength" element={<WorkoutLibrary />} />
          <Route path="/library" element={<WorkoutLibrary />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/workout/:workoutId" element={<WorkoutDetail />} />
          <Route path="/workout/:workoutId/active" element={<ActiveWorkout />} />
          <Route path="/calendar" element={<Calendar />} />
        </Route>
      </Routes>
    </DataProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
