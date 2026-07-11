// Movement pattern used to pick a reusable illustration for an exercise.
export type MovementPattern =
  | 'legPress'
  | 'legExtension'
  | 'legCurl'
  | 'hipThrust'
  | 'hipHinge'
  | 'adduction'
  | 'abduction'
  | 'chestPress'
  | 'row'
  | 'latPulldown'
  | 'shoulderPress'
  | 'lateralRaise'
  | 'bicepCurl'
  | 'tricepPushdown'
  | 'plank'
  | 'deadBug'
  | 'cablePullThrough'
  | 'gluteKickback'
  | 'calfRaise'

export interface WorkoutExercise {
  id: string
  name: string
  sets: number
  reps: string // e.g. "10-12" or "30s hold"
  restSeconds: number
  primaryMuscle: string
  equipment: string
  pattern: MovementPattern
  cue: string
  ankleNote?: string
}

export interface StrengthWorkout {
  id: string
  name: string
  focus: string
  estMinutes: number
  summary: string
  exercises: WorkoutExercise[]
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

export type LoggedEntry =
  | ({ kind: 'class' } & ClassSession)
  | ({ kind: 'strength' } & StrengthSession)
