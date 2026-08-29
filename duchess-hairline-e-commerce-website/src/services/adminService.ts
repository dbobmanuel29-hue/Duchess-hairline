import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from '../types';

function requireDb() { if (!db) throw new Error('Firebase is not configured.'); return db; }

export async function adminListProducts(): Promise<Product[]> {
  const snapshot = await getDocs(query(collection(requireDb(), 'products'), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Product));
}

export async function adminCreateProduct(product: Omit<Product, 'id'>) {
  const ref = await addDoc(collection(requireDb(), 'products'), { ...product, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return ref.id;
}

export async function adminUpdateProduct(id: string, product: Partial<Product>) {
  await updateDoc(doc(requireDb(), 'products', id), { ...product, updatedAt: serverTimestamp() });
}

export async function adminDeleteProduct(id: string) {
  await deleteDoc(doc(requireDb(), 'products', id));
}
