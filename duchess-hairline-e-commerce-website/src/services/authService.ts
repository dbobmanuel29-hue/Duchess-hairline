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
import { ensureUserProfile } from './profileService';

export function subscribeToAuth(callback: (user: User | null) => void) {
  if (!auth) { callback(null); return () => undefined; }
  return onAuthStateChanged(auth, async user => {
    if (user) {
      try { await ensureUserProfile(user); } catch { /* Profile sync must not block login. */ }
    }
    callback(user);
  });
}

export async function isAdmin(user: User | null) {
  if (!user || !db) return false;
  const snap = await getDoc(doc(db, 'admins', user.uid));
  return snap.exists() && snap.data()?.role === 'admin' && snap.data()?.active === true;
}

export async function signInWithEmail(email: string, password: string) {
  if (!auth) throw new Error('Firebase is not configured.');
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase is not configured.');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

export async function adminSignIn(email: string, password: string) {
  const user = await signInWithEmail(email, password);
  if (!(await isAdmin(user))) {
    const uid = user.uid;
    await signOut(auth!);
    throw new Error(`Account authenticated, but it is not an admin. UID: ${uid}`);
  }
  return user;
}

export async function adminSignInWithGoogle() {
  const user = await signInWithGoogle();
  if (!(await isAdmin(user))) {
    const uid = user.uid;
    await signOut(auth!);
    throw new Error(`Google account authenticated, but it is not an admin. UID: ${uid}`);
  }
  return user;
}

export async function registerWithEmail(email: string, password: string) {
  if (!auth) throw new Error('Firebase is not configured.');
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await ensureUserProfile(credential.user);
  return { uid: credential.user.uid, email: credential.user.email ?? email.trim() };
}

export async function registerWithGoogle() {
  const user = await signInWithGoogle();
  await ensureUserProfile(user);
  return { uid: user.uid, email: user.email ?? '' };
}

export async function adminSignOut() {
  if (auth) await signOut(auth);
}
