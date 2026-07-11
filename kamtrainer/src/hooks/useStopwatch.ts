import { useEffect, useRef, useState } from 'react'

// Simple running elapsed-time counter in seconds, starts when `running`
// becomes true. No pause/resume — a workout session only counts up once.
export function useStopwatch(running: boolean) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    startRef.current = Date.now()
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - (startRef.current ?? Date.now())) / 1000))
    }, 250)
    return () => clearInterval(id)
  }, [running])

  return elapsed
}
