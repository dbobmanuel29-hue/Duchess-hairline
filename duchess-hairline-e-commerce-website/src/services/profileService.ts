import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './firebase';

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoURL: string;
  provider: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export async function ensureUserProfile(user: User) {
  if (!db) return;
  const ref = doc(db, 'users', user.uid);
  const existing = await getDoc(ref);
  const provider = user.providerData[0]?.providerId ?? 'password';
  const base = {
    uid: user.uid,
    name: user.displayName ?? '',
    email: user.email ?? '',
    phone: user.phoneNumber ?? '',
    photoURL: user.photoURL ?? '',
    provider,
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, existing.exists() ? base : { ...base, createdAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid: string) {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? ({ uid: snap.id, ...snap.data() } as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Pick<UserProfile, 'name' | 'phone'>) {
  if (!db) throw new Error('Firebase is not configured.');
  await setDoc(doc(db, 'users', uid), { name: data.name.trim(), phone: data.phone.trim(), updatedAt: serverTimestamp() }, { merge: true });
}
