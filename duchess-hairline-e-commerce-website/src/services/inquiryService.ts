import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type InquiryStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
export interface Inquiry { id: string; uid?: string; name?: string; phone?: string; email?: string; productId?: string; productName?: string; message?: string; source?: string; status: InquiryStatus; createdAt?: unknown; }

function requireDb() { if (!db) throw new Error('Firebase is not configured.'); return db; }

export async function createInquiry(data: Omit<Inquiry, 'id' | 'status' | 'createdAt' | 'uid' | 'email'>) {
  if (!auth?.currentUser) throw new Error('Please sign in before sending a client request.');
  const user = auth.currentUser;
  const ref = await addDoc(collection(requireDb(), 'inquiries'), {
    ...data,
    uid: user.uid,
    email: user.email ?? '',
    name: data.name?.trim() || user.displayName || 'Customer',
    status: 'new',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listInquiries(): Promise<Inquiry[]> {
  const snap = await getDocs(query(collection(requireDb(), 'inquiries'), orderBy('createdAt', 'desc')));
  return snap.docs.map(item => ({ id: item.id, ...item.data() } as Inquiry));
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  await updateDoc(doc(requireDb(), 'inquiries', id), { status, updatedAt: serverTimestamp() });
}
