import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile, type User } from 'firebase/auth';
import { db, auth } from './firebase';

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

  // Firestore is the source of truth for editable profile fields. Firebase Auth
  // may not contain a phone number and can contain an older display name, so do
  // not overwrite saved profile data when the user logs in again.
  const authFields = {
    uid: user.uid,
    email: user.email ?? '',
    provider,
  };

  if (!existing.exists()) {
    await setDoc(ref, {
      ...authFields,
      name: user.displayName ?? '',
      phone: user.phoneNumber ?? '',
      photoURL: user.photoURL ?? '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return;
  }

  const current = existing.data() as Partial<UserProfile>;
  const changed = current.uid !== authFields.uid
    || current.email !== authFields.email
    || current.provider !== authFields.provider;

  // Only synchronize identity fields that are owned by authentication. Never
  // replace the user's saved name, phone number, or profile photo on login.
  if (changed) {
    await setDoc(ref, { ...authFields, updatedAt: serverTimestamp() }, { merge: true });
  }

  // Keep the Firebase Auth display name/photo in sync with the saved profile
  // so the current session also reflects the values stored in Firestore.
  if (auth?.currentUser?.uid === user.uid) {
    const savedName = typeof current.name === 'string' ? current.name : '';
    const savedPhotoURL = typeof current.photoURL === 'string' ? current.photoURL : '';
    if ((user.displayName ?? '') !== savedName || (user.photoURL ?? '') !== savedPhotoURL) {
      await updateProfile(auth.currentUser, {
        displayName: savedName || null,
        photoURL: savedPhotoURL || null,
      });
    }
  }
}

export async function getUserProfile(uid: string) {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? ({ uid: snap.id, ...snap.data() } as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Pick<UserProfile, 'name' | 'phone' | 'photoURL'>) {
  if (!db) throw new Error('Firebase is not configured.');
  const name = data.name.trim();
  const phone = data.phone.trim();
  const photoURL = data.photoURL || '';

  await setDoc(doc(db, 'users', uid), {
    name,
    phone,
    photoURL,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  if (auth?.currentUser?.uid === uid) {
    await updateProfile(auth.currentUser, { displayName: name || null, photoURL: photoURL || null });
  }
}
