import { supabase } from './supabase'
import type { ClassSession, StrengthSession, WorkoutClass } from '../types'

interface ClassRow {
  id: string
  name: string
  color: string
  preset: boolean
  created_at: string
}

interface ClassSessionRow {
  id: string
  class_id: string
  class_name: string
  date: string
  created_at: string
}

interface StrengthSessionRow {
  id: string
  workout_id: string
  workout_name: string
  date: string
  duration_seconds: number
  completed_exercise_ids: string[]
  total_exercises: number
  created_at: string
}

function toClass(row: ClassRow): WorkoutClass {
  return { id: row.id, name: row.name, color: row.color, preset: row.preset, createdAt: row.created_at }
}

function toClassSession(row: ClassSessionRow): ClassSession {
  return {
    id: row.id,
    classId: row.class_id,
    className: row.class_name,
    date: row.date,
    createdAt: row.created_at,
  }
}

function toStrengthSession(row: StrengthSessionRow): StrengthSession {
  return {
    id: row.id,
    workoutId: row.workout_id,
    workoutName: row.workout_name,
    date: row.date,
    createdAt: row.created_at,
    durationSeconds: row.duration_seconds,
    completedExerciseIds: row.completed_exercise_ids,
    totalExercises: row.total_exercises,
  }
}

export async function fetchClasses(uid: string): Promise<WorkoutClass[]> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as ClassRow[]).map(toClass)
}

export async function fetchClassSessions(uid: string): Promise<ClassSession[]> {
  const { data, error } = await supabase
    .from('class_sessions')
    .select('*')
    .eq('user_id', uid)
    .order('date', { ascending: false })
  if (error) throw error
  return (data as ClassSessionRow[]).map(toClassSession)
}

export async function fetchStrengthSessions(uid: string): Promise<StrengthSession[]> {
  const { data, error } = await supabase
    .from('strength_sessions')
    .select('*')
    .eq('user_id', uid)
    .order('date', { ascending: false })
  if (error) throw error
  return (data as StrengthSessionRow[]).map(toStrengthSession)
}

export async function addCustomClass(uid: string, name: string, color: string): Promise<string> {
  const { data, error } = await supabase
    .from('classes')
    .insert({ user_id: uid, name, color, preset: false })
    .select('id')
    .single()
  if (error) throw error
  return (data as { id: string }).id
}

export async function logClassSession(
  uid: string,
  classId: string,
  className: string,
  date: string,
) {
  const { error } = await supabase
    .from('class_sessions')
    .insert({ user_id: uid, class_id: classId, class_name: className, date })
  if (error) throw error
}

export async function logStrengthSession(
  uid: string,
  session: Omit<StrengthSession, 'id' | 'createdAt'>,
) {
  const { error } = await supabase.from('strength_sessions').insert({
    user_id: uid,
    workout_id: session.workoutId,
    workout_name: session.workoutName,
    date: session.date,
    duration_seconds: session.durationSeconds,
    completed_exercise_ids: session.completedExerciseIds,
    total_exercises: session.totalExercises,
  })
  if (error) throw error
}
