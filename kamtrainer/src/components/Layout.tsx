import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { signOut } from '../lib/firebase'

const navItems = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { to: '/library', label: 'Workouts', icon: DumbbellIcon },
]

export function Layout() {
  const { user } = useAuth()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col bg-[var(--color-paper)]">
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-brand)] text-base font-bold text-white">
            K
          </div>
          <span className="font-display text-lg font-semibold">KamTrainer</span>
        </div>
        {user && (
          <button
            onClick={() => signOut()}
            className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          >
            Sign out
          </button>
        )}
      </header>

      <main className="flex-1 px-5 pb-28 pt-2">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-xl border-t border-[var(--color-line)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'text-[var(--color-brand)]'
                    : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" strokeLinecap="round" />
    </svg>
  )
}

function DumbbellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 9v6M2.5 10.5v3M20 9v6M21.5 10.5v3M7 12h10" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="8" width="3" height="8" rx="1" />
      <rect x="17" y="8" width="3" height="8" rx="1" />
    </svg>
  )
}
