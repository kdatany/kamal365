import { useRef, useState, type FormEvent } from 'react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'Suggest a good move for sore shoulders',
  'Give me a quick 20-minute glute routine',
  'What can I do instead of calf raises?',
]

export function Coach() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  async function send(text: string) {
    const question = text.trim()
    if (!question || loading) return

    const next = [...messages, { role: 'user' as const, content: question }]
    setMessages(next)
    setInput('')
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const contentType = res.headers.get('content-type') ?? ''
      if (!contentType.includes('application/json')) {
        throw new Error(
          'Coach is unavailable here — the chat endpoint only runs on a deployed site (or `netlify dev`), not a plain `vite dev` server.',
        )
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
      })
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="flex h-[calc(100svh-9rem)] flex-col gap-3 pt-2">
      <div>
        <h1 className="text-2xl font-semibold">Ask the Coach</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Ask for a specific move or a whole routine — answers stay ankle-safe by default.
        </p>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-[var(--color-ink-soft)]">Try asking:</p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm hover:border-[var(--color-brand)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((m, i) => (
              <li
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === 'user'
                    ? 'ml-auto bg-[var(--color-brand)] text-white'
                    : 'mr-auto bg-[var(--color-brand-soft)] text-[var(--color-ink)]'
                }`}
              >
                {m.content}
              </li>
            ))}
            {loading && (
              <li className="mr-auto rounded-2xl bg-[var(--color-brand-soft)] px-4 py-2.5 text-sm text-[var(--color-ink-soft)]">
                Thinking…
              </li>
            )}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for a move or routine…"
          className="flex-1 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  )
}
