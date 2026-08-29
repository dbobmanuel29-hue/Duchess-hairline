import { collection, getDocs, orderBy, query, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Review { id: string; name?: string; text?: string; image?: string; productName?: string; approved?: boolean; createdAt?: unknown; }
function requireDb() { if (!db) throw new Error('Firebase is not configured.'); return db; }
export async function listReviews(): Promise<Review[]> { const snap = await getDocs(query(collection(requireDb(), 'reviews'), orderBy('createdAt', 'desc'))); return snap.docs.map(d => ({ id:d.id, ...d.data() } as Review)); }
export async function updateReviewApproval(id:string, approved:boolean) { await updateDoc(doc(requireDb(),'reviews',id), { approved, updatedAt: serverTimestamp() }); }
export async function deleteReview(id:string) { await deleteDoc(doc(requireDb(),'reviews',id)); }
