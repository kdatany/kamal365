import { useState } from 'react'
import { signInWithGoogle, isSupabaseConfigured } from '../lib/supabase'

export function LoginScreen() {
  const [error, setError] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)

  async function handleSignIn() {
    setError(null)
    setSigningIn(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed')
    } finally {
      setSigningIn(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand)] text-2xl font-bold text-white">
          K
        </div>
        <h1 className="text-3xl font-semibold">KamTrainer</h1>
        <p className="max-w-xs text-[var(--color-ink-soft)]">
          Your personal workout tracker &amp; ankle-friendly lifting assistant.
        </p>
      </div>

      {!isSupabaseConfigured ? (
        <div className="max-w-sm rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-ink-soft)]">
          Supabase isn&apos;t configured yet. Add your Supabase project URL and anon key to a{' '}
          <code className="rounded bg-[var(--color-brand-soft)] px-1 py-0.5">.env.local</code> file
          (see <code className="rounded bg-[var(--color-brand-soft)] px-1 py-0.5">.env.example</code>
          ) to enable sign-in and cloud sync.
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="flex items-center gap-3 rounded-full bg-[var(--color-ink)] px-6 py-3 font-medium text-[var(--color-paper)] shadow-sm transition hover:opacity-90 disabled:opacity-60"
        >
          {signingIn ? 'Signing in…' : 'Sign in with Google'}
        </button>
      )}

      {error && <p className="max-w-xs text-sm text-red-500">{error}</p>}
    </div>
  )
}
