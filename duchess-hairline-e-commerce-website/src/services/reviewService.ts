import { collection, deleteDoc, doc, getDocsFromServer, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';

export interface Review { id: string; name?: string; text?: string; image?: string; productName?: string; approved?: boolean; createdAt?: unknown; }
function requireDb(){if(!db)throw new Error('Firebase is not configured.');return db;}

/** Admin list: returns all reviews, including pending/unapproved submissions. */
export async function listReviews():Promise<Review[]>{
 const snap=await getDocsFromServer(collection(requireDb(),'reviews'));
 return sortReviews(snap.docs.map(d=>({id:d.id,...d.data()} as Review)));
}

/** Public list: query only approved reviews so Firestore rules can safely allow public reads. */
export async function listPublicReviews():Promise<Review[]>{
 const snap=await getDocsFromServer(query(collection(requireDb(),'reviews'),where('approved','==',true)));
 return sortReviews(snap.docs.map(d=>({id:d.id,...d.data()} as Review)));
}

function sortReviews(items:Review[]):Review[]{
 return items.sort((a,b)=>{
  const at=typeof (a.createdAt as any)?.toMillis==='function'?(a.createdAt as any).toMillis():0;
  const bt=typeof (b.createdAt as any)?.toMillis==='function'?(b.createdAt as any).toMillis():0;
  return bt-at;
 });
}

export async function updateReviewApproval(id:string,approved:boolean){await updateDoc(doc(requireDb(),'reviews',id),{approved,updatedAt:serverTimestamp()});}
export async function deleteReview(id:string){await deleteDoc(doc(requireDb(),'reviews',id));}
