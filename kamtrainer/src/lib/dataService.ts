import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import type { ClassSession, StrengthSession, WorkoutClass } from '../types'

function userCollection(uid: string, name: string) {
  return collection(db, 'users', uid, name)
}

export function subscribeToClasses(uid: string, cb: (classes: WorkoutClass[]) => void) {
  const q = query(userCollection(uid, 'classes'), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data() as Omit<WorkoutClass, 'id'>
        return { id: d.id, ...data }
      }),
    )
  })
}

export function subscribeToClassSessions(uid: string, cb: (sessions: ClassSession[]) => void) {
  const q = query(userCollection(uid, 'classSessions'), orderBy('date', 'desc'))
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data() as Omit<ClassSession, 'id'>
        return { id: d.id, ...data }
      }),
    )
  })
}

export function subscribeToStrengthSessions(
  uid: string,
  cb: (sessions: StrengthSession[]) => void,
) {
  const q = query(userCollection(uid, 'strengthSessions'), orderBy('date', 'desc'))
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data() as Omit<StrengthSession, 'id'>
        return { id: d.id, ...data }
      }),
    )
  })
}

export async function addCustomClass(uid: string, name: string, color: string) {
  const ref = await addDoc(userCollection(uid, 'classes'), {
    name,
    preset: false,
    color,
    createdAt: new Date().toISOString(),
  })
  return ref.id
}

export async function logClassSession(
  uid: string,
  classId: string,
  className: string,
  date: string,
) {
  await addDoc(userCollection(uid, 'classSessions'), {
    classId,
    className,
    date,
    createdAt: new Date().toISOString(),
    serverCreatedAt: serverTimestamp(),
  })
}

export async function logStrengthSession(
  uid: string,
  session: Omit<StrengthSession, 'id' | 'createdAt'>,
) {
  await addDoc(userCollection(uid, 'strengthSessions'), {
    ...session,
    createdAt: new Date().toISOString(),
    serverCreatedAt: serverTimestamp(),
  })
}

// Ensures a Firestore user doc exists (handy for security rules keyed on it).
export async function ensureUserDoc(uid: string, email: string | null) {
  await setDoc(doc(db, 'users', uid), { email, lastSeen: new Date().toISOString() }, { merge: true })
}
