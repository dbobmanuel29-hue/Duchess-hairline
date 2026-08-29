import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { productSeed } from '../data/products.seed';
import type { Product } from '../types';

function requireDb() { if (!db) throw new Error('Firebase is not configured.'); return db; }

async function seedCatalogIfEmpty() {
  const firestore = requireDb();
  const existing = await getDocs(collection(firestore, 'products'));
  if (!existing.empty) return;
  await Promise.all(productSeed.map(product => addDoc(collection(firestore, 'products'), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })));
}

export async function adminListProducts(): Promise<Product[]> {
  const firestore = requireDb();
  let snapshot = await getDocs(query(collection(firestore, 'products'), orderBy('createdAt', 'desc')));
  if (snapshot.empty) {
    await seedCatalogIfEmpty();
    snapshot = await getDocs(collection(firestore, 'products'));
  }
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() } as Product));
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
