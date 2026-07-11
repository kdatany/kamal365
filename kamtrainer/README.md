# KamTrainer

A personal workout tracker & ankle-friendly lifting assistant. Log gym classes
(Liftonics, St Marks Yoga, Solidcore, SoulCycle, or your own), run pre-designed
low ankle-impact strength workouts with a live timer and exercise checklist,
and see everything on a calendar. Data syncs to your account via Firebase and
works offline.

## Stack

- Vite + React + TypeScript
- React Router (multi-page)
- Tailwind CSS v4
- Zustand for local state
- Firebase Auth (Google sign-in) + Firestore (with offline persistence)

## Setup

```sh
npm install
```

### Firebase (required for sign-in & cloud sync)

1. Create a free project at <https://console.firebase.google.com>.
2. In **Build > Authentication > Sign-in method**, enable **Google**.
3. In **Build > Firestore Database**, create a database (production mode is fine —
   rules are provided below).
4. In **Project settings > General > Your apps**, add a **Web app** and copy
   the config values.
5. Copy `.env.example` to `.env.local` and fill in the values:

   ```sh
   cp .env.example .env.local
   ```

6. Deploy the included security rules (or paste `firestore.rules` into the
   Firestore console's Rules tab) so each user can only read/write their own
   data:

   ```sh
   firebase deploy --only firestore:rules
   ```

Without a configured `.env.local`, the app still runs and the workout
library/calendar UI is browsable, but sign-in is skipped and nothing can be
saved (all actions need a signed-in user).

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
