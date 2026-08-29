import { collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Review { id: string; name?: string; text?: string; image?: string; productName?: string; approved?: boolean; createdAt?: unknown; }
function requireDb(){if(!db)throw new Error('Firebase is not configured.');return db;}

export async function listReviews():Promise<Review[]>{
 const snap=await getDocs(collection(requireDb(),'reviews'));
 return snap.docs.map(d=>({id:d.id,...d.data()} as Review)).sort((a,b)=>{
  const at=typeof (a.createdAt as any)?.toMillis==='function'?(a.createdAt as any).toMillis():0;
  const bt=typeof (b.createdAt as any)?.toMillis==='function'?(b.createdAt as any).toMillis():0;
  return bt-at;
 });
}
export async function updateReviewApproval(id:string,approved:boolean){await updateDoc(doc(requireDb(),'reviews',id),{approved,updatedAt:serverTimestamp()});}
export async function deleteReview(id:string){await deleteDoc(doc(requireDb(),'reviews',id));}
