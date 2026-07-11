# KamTrainer

A personal workout tracker & ankle-friendly lifting assistant. Log gym classes
(Liftonics, St Marks Yoga, Solidcore, SoulCycle, or your own), run pre-designed
low ankle-impact strength workouts with a live timer and exercise checklist,
and see everything on a calendar. Data syncs to your account via Supabase.

## Stack

- Vite + React + TypeScript
- React Router (multi-page)
- Tailwind CSS v4
- Zustand for local state
- Supabase Auth (Google sign-in) + Postgres

## Setup

```sh
npm install
```

### Supabase (required for sign-in & cloud sync)

1. Create a free project at <https://supabase.com/dashboard>.
2. In **Authentication > Providers**, enable **Google** and fill in an OAuth
   client ID/secret (Google Cloud Console -> Credentials -> OAuth client ID,
   with the Supabase callback URL from that same provider screen added as an
   authorized redirect URI).
3. In **Authentication > URL Configuration**, add your dev URL
   (`http://localhost:5173`) and your deployed URL (e.g. your Netlify domain)
   to **Redirect URLs**.
4. Open the **SQL Editor**, paste the contents of `supabase/schema.sql`, and
   run it. This creates the `classes`, `class_sessions`, and
   `strength_sessions` tables with row-level security so each user can only
   read/write their own rows.
5. In **Project settings > API**, copy the **Project URL** and **anon public**
   key.
6. Copy `.env.example` to `.env.local` and fill in the values:

   ```sh
   cp .env.example .env.local
   ```

Without a configured `.env.local`, the app still runs and the workout
library/calendar UI is browsable, but sign-in is skipped and nothing can be
saved (all actions need a signed-in user).

Note: unlike Firestore, the Supabase JS client doesn't queue writes while
offline — actions made without a connection will fail until you're back
online. Data still refetches automatically whenever the app reloads or you
sign in.

## Develop

```sh
npm run dev
```

## Build

```sh
npm run build
```

## How the ankle-safe workouts were designed

The strength workouts in `src/data/workouts.ts` deliberately avoid squats,
lunges, step-ups, jumping/plyometrics, and running — these load the ankle
through a deep dorsiflexed range or with impact. Volume instead comes from
seated/machine work (leg press, leg extension, leg curl, adduction/abduction,
chest press, rows, pulldowns, presses) and hip-hinge movements (hip thrust,
cable pull-through, glute kickback) where the ankle stays neutral. See the
"What we intentionally skip & why" note on the Workouts page in-app for the
sourcing.
