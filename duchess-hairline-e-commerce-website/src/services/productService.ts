import type { Product, ProductQuery, SortOption } from '../types';
import { productSeed } from '../data/products.seed';
import { hasRemoteApi, request } from './http';
import { db, firebaseConfigured } from './firebase';
import { collection, getDocsFromServer, query } from 'firebase/firestore';

const PRODUCT_CACHE_TTL = 30_000;
let productCache: { items: Product[]; expiresAt: number } | null = null;
let productCachePromise: Promise<Product[]> | null = null;

function asBool(value: unknown): boolean { return value === true || value === 1 || value === 'true' || value === '1' || value === 'yes' || value === 'on'; }
function asPrice(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') { const parsed = Number(value.replace(/[₦,\s]/g, '')); return Number.isFinite(parsed) ? parsed : null; }
  return null;
}
function timestampMillis(value: unknown): number {
  if (!value) return 0;
  if (typeof (value as { toMillis?: () => number }).toMillis === 'function') return (value as { toMillis: () => number }).toMillis();
  if (typeof value === 'number') return value;
  if (typeof value === 'string') { const parsed = Date.parse(value); return Number.isFinite(parsed) ? parsed : 0; }
  if (typeof value === 'object' && value !== null) { const seconds = (value as { seconds?: number; _seconds?: number }).seconds ?? (value as { _seconds?: number })._seconds; if (typeof seconds === 'number') return seconds * 1000; }
  return 0;
}
function normalizeProduct(id: string, raw: Record<string, unknown>): Product {
  return {
    id, name: String(raw.name ?? 'Untitled product'), price: asPrice(raw.price ?? raw.priceValue ?? raw.priceNaira),
    category: String(raw.category ?? 'bone-straight') as Product['category'], categoryLabel: String(raw.categoryLabel ?? raw.category ?? 'Bone Straight'),
    length: raw.length == null ? null : String(raw.length), hairType: raw.hairType == null ? null : String(raw.hairType), laceType: raw.laceType == null ? null : String(raw.laceType), density: raw.density == null ? null : String(raw.density), texture: raw.texture == null ? null : String(raw.texture),
    description: String(raw.description ?? ''), images: Array.isArray(raw.images) ? raw.images.map(String).filter(Boolean) : [], video: raw.video == null ? null : String(raw.video), badge: raw.badge == null ? null : String(raw.badge),
    available: asBool(raw.available), featured: asBool(raw.featured), newArrival: asBool(raw.newArrival ?? raw.new_arrival), bestSeller: asBool(raw.bestSeller ?? raw.best_seller), createdAt: raw.createdAt ?? raw.created_at ?? null,
  };
}
function matchesSearch(product: Product, search: string): boolean {
  const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean); if (!terms.length) return true;
  const haystack = [product.name, product.category, product.categoryLabel, product.description, product.texture, product.laceType, product.hairType, product.length, product.badge].filter(Boolean).join(' ').toLowerCase().replace(/-/g, ' ');
  return terms.every(term => haystack.includes(term.replace(/-/g, ' ')));
}
function sortProducts(items: Product[], sort: SortOption = 'featured'): Product[] {
  const sorted = [...items];
  switch (sort) {
    case 'newest': return sorted.sort((a, b) => timestampMillis(b.createdAt) - timestampMillis(a.createdAt));
    case 'price-asc': return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    case 'price-desc': return sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    default: return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || timestampMillis(b.createdAt) - timestampMillis(a.createdAt));
  }
}
function applyQuery(items: Product[], queryValue: ProductQuery): Product[] {
  let result = items;
  if (queryValue.search) result = result.filter(p => matchesSearch(p, queryValue.search as string));
  if (queryValue.category === 'new-arrivals') result = result.filter(p => p.newArrival); else if (queryValue.category) result = result.filter(p => p.category === queryValue.category);
  if (queryValue.featured) result = result.filter(p => p.featured);
  if (queryValue.newArrival) result = result.filter(p => p.newArrival);
  if (queryValue.bestSeller) result = result.filter(p => p.bestSeller);
  if (queryValue.availableOnly) result = result.filter(p => p.available);
  result = sortProducts(result, queryValue.sort);
  return typeof queryValue.limit === 'number' ? result.slice(0, queryValue.limit) : result;
}
function toSearchParams(queryValue: ProductQuery): string {
  const params = new URLSearchParams(); Object.entries(queryValue).forEach(([key, value]) => { if (value !== undefined && value !== '' && value !== false) params.set(key, String(value)); });
  const qs = params.toString(); return qs ? `?${qs}` : '';
}

async function getFirebaseCatalog(): Promise<Product[]> {
  const now = Date.now();
  if (productCache && productCache.expiresAt > now) return productCache.items;
  if (productCachePromise) return productCachePromise;
  productCachePromise = (async () => {
    if (!db) return [];
    const snap = await getDocsFromServer(query(collection(db, 'products')));
    const items = snap.empty ? productSeed : snap.docs.map(d => normalizeProduct(d.id, d.data() as Record<string, unknown>));
    productCache = { items, expiresAt: Date.now() + PRODUCT_CACHE_TTL };
    return items;
  })().finally(() => { productCachePromise = null; });
  return productCachePromise;
}

export function clearProductCache() { productCache = null; }

export async function listProducts(queryValue: ProductQuery = {}): Promise<Product[]> {
  if (hasRemoteApi) return request<Product[]>(`/products${toSearchParams(queryValue)}`);
  if (firebaseConfigured) {
    try { return applyQuery(await getFirebaseCatalog(), queryValue); }
    catch (error) { console.warn('Product read failed; showing the curated catalog fallback.', error); return applyQuery(productSeed, queryValue); }
  }
  return applyQuery(productSeed, queryValue);
}
export async function getProduct(id: string): Promise<Product | null> {
  if (hasRemoteApi) return request<Product | null>(`/products/${encodeURIComponent(id)}`);
  if (firebaseConfigured && db) {
    try { return (await getFirebaseCatalog()).find(p => p.id === id) ?? productSeed.find(p => p.id === id) ?? null; }
    catch (error) { console.warn('Product read failed; using the curated catalog fallback.', error); return productSeed.find(p => p.id === id) ?? null; }
  }
  return productSeed.find(p => p.id === id) ?? null;
}
export async function listRelated(product: Product, limit = 4): Promise<Product[]> { return (await listProducts({ category: product.category, limit })).filter(p => p.id !== product.id).slice(0, limit); }
export async function searchProducts(term: string, limit = 6): Promise<Product[]> { return listProducts({ search: term, limit }); }
