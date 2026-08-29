import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
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

async function requireAdmin(user: User) {
  if (!(await isAdmin(user))) {
    const uid = user.uid;
    await signOut(auth!);
    throw new Error(`Account authenticated, but it is not an admin. UID: ${uid}`);
  }
  return user;
}

export async function adminSignIn(email: string, password: string) {
  if (!auth) throw new Error('Firebase is not configured.');
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return requireAdmin(credential.user);
}

export async function adminSignInWithGoogle() {
  if (!auth) throw new Error('Firebase is not configured.');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);
  return requireAdmin(credential.user);
}

export async function registerWithEmail(email: string, password: string) {
  if (!auth) throw new Error('Firebase is not configured.');
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const uid = credential.user.uid;
  await signOut(auth);
  return { uid, email: credential.user.email ?? email.trim() };
}

export async function registerWithGoogle() {
  if (!auth) throw new Error('Firebase is not configured.');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);
  const result = { uid: credential.user.uid, email: credential.user.email ?? '' };
  await signOut(auth);
  return result;
}

export async function adminSignOut() {
  if (auth) await signOut(auth);
}
