import type { Handler } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'
import { workouts, AVOIDED_MOVEMENTS } from '../../src/data/workouts'

const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 2000

const workoutSummary = workouts
  .map((w) => `- ${w.name} (${w.focus}): ${w.exercises.map((e) => e.name).join(', ')}`)
  .join('\n')

const SYSTEM_PROMPT = `You are the workout assistant inside KamTrainer, a personal workout tracker.

The app's strength-training philosophy is to avoid loading the ankle through a deep dorsiflexed range or with impact. Skip: ${AVOIDED_MOVEMENTS.join(', ')}.
Prefer machine/cable work and hip-hinge movements where the ankle stays neutral.

The app already has these built-in workouts the user can start directly from the Workouts tab:
${workoutSummary}

When the user asks for a move or a routine:
- Recommend specific exercises with sets/reps, staying consistent with the ankle-safe philosophy above unless the user explicitly asks for something else (e.g. they mention no ankle issues, or ask about cardio/mobility).
- If one of the app's existing workouts already fits, point them to it by name.
- If they want something new, give a concise, ready-to-do routine (exercise, sets x reps, brief cue) rather than a generic essay.
- Keep answers short and practical — this is a quick in-gym reference, not an article.
- You're not a medical professional; for pain or injury concerns, suggest they check with a physical therapist or doctor.`

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }),
    }
  }

  let messages: { role: 'user' | 'assistant'; content: string }[]
  try {
    const body = JSON.parse(event.body ?? '{}')
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      throw new Error('messages must be a non-empty array')
    }
    messages = body.messages
      .slice(-MAX_MESSAGES)
      .map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content ?? '').slice(0, MAX_MESSAGE_LENGTH),
      }))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) }
  }

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium' },
      system: SYSTEM_PROMPT,
      messages,
    })

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim()

    if (!reply) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'The assistant did not return a response.' }),
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    }
  } catch (err) {
    console.error('chat function error', err)
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Failed to reach the assistant. Try again in a moment.' }),
    }
  }
}
