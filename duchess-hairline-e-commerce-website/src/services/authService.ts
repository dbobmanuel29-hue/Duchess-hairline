import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export function subscribeToAuth(callback: (user: User | null) => void) {
  if (!auth) { callback(null); return () => undefined; }
  return onAuthStateChanged(auth, callback);
}

export async function isAdmin(user: User | null) {
  if (!user || !db) return false;
  const snap = await getDoc(doc(db, 'admins', user.uid));
  return snap.exists() && snap.data()?.role === 'admin' && snap.data()?.active === true;
}

export async function adminSignIn(email: string, password: string) {
  if (!auth) throw new Error('Firebase is not configured.');
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  if (!(await isAdmin(credential.user))) {
    await signOut(auth);
    throw new Error('This account is not authorized to access the Duchess Hairline admin dashboard.');
  }
  return credential;
}

export async function adminSignOut() {
  if (auth) await signOut(auth);
}
