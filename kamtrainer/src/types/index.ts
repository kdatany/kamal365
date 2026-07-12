export interface WorkoutExercise {
  id: string
  name: string
  sets: number
  reps: string // e.g. "10-12" or "30s hold"
  restSeconds: number
  primaryMuscle: string
  equipment: string
  cue: string
  ankleNote?: string
  // External page with real photos/video of the move (MuscleWiki, StrengthLog, etc.)
  link: string
}

export interface StrengthWorkout {
  id: string
  name: string
  focus: string
  estMinutes: number
  summary: string
  exercises: WorkoutExercise[]
}

export type StretchCategory =
  | 'Neck & Shoulders'
  | 'Chest & Upper Back'
  | 'Arms & Wrists'
  | 'Core & Low Back'
  | 'Hips & Glutes'
  | 'Hamstrings & Quads'
  | 'Calves & Ankles'

export interface Stretch {
  id: string
  name: string
  category: StretchCategory
  target: string
  holdSeconds: number
  eachSide: boolean
  cue: string
  ankleNote?: string
  // External page with real photos/video of the stretch (ExRx.net, MuscleWiki, etc.)
  link: string
}

export interface StretchRoutine {
  id: string
  name: string
  focus: string
  estMinutes: number
  summary: string
  stretchIds: string[]
}

// A gym class the user attends (preset or custom).
export interface WorkoutClass {
  id: string
  name: string
  preset: boolean
  color: string
  createdAt: string // ISO
}

// One check-in to a workout class.
export interface ClassSession {
  id: string
  classId: string
  className: string
  date: string // ISO date (yyyy-MM-dd)
  createdAt: string // ISO datetime
}

// One completed strength workout.
export interface StrengthSession {
  id: string
  workoutId: string
  workoutName: string
  date: string // ISO date (yyyy-MM-dd)
  createdAt: string // ISO datetime
  durationSeconds: number
  completedExerciseIds: string[]
  totalExercises: number
}

// One completed stretch routine.
export interface StretchSession {
  id: string
  routineId: string
  routineName: string
  date: string // ISO date (yyyy-MM-dd)
  createdAt: string // ISO datetime
  durationSeconds: number
  completedStretchIds: string[]
  totalStretches: number
}

export type LoggedEntry =
  | ({ kind: 'class' } & ClassSession)
  | ({ kind: 'strength' } & StrengthSession)
  | ({ kind: 'stretch' } & StretchSession)
