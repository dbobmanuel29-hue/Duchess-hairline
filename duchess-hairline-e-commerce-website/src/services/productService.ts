import type { Product, ProductQuery, SortOption } from '../types';
import { productSeed } from '../data/products.seed';
import { hasRemoteApi, request } from './http';

function matchesSearch(product: Product, search: string): boolean {
  const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = [
    product.name,
    product.category,
    product.categoryLabel,
    product.description,
    product.texture,
    product.laceType,
    product.hairType,
    product.length,
    product.badge,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/-/g, ' ');

  return terms.every((term) => haystack.includes(term.replace(/-/g, ' ')));
}

function sortProducts(items: Product[], sort: SortOption = 'featured'): Product[] {
  const sorted = [...items];

  switch (sort) {
    case 'newest':
      return [...sorted.filter((p) => p.newArrival), ...sorted.filter((p) => !p.newArrival)];
    case 'price-asc':
      return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    case 'price-desc':
      return sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    case 'featured':
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

function applyQuery(items: Product[], query: ProductQuery): Product[] {
  let result = items;

  if (query.search) result = result.filter((p) => matchesSearch(p, query.search as string));

  if (query.category === 'new-arrivals') result = result.filter((p) => p.newArrival);
  else if (query.category) result = result.filter((p) => p.category === query.category);

  if (query.featured) result = result.filter((p) => p.featured);
  if (query.newArrival) result = result.filter((p) => p.newArrival);
  if (query.bestSeller) result = result.filter((p) => p.bestSeller);
  if (query.availableOnly) result = result.filter((p) => p.available);

  result = sortProducts(result, query.sort);
  return typeof query.limit === 'number' ? result.slice(0, query.limit) : result;
}

function toSearchParams(query: ProductQuery): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== false) params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function listProducts(query: ProductQuery = {}): Promise<Product[]> {
  if (hasRemoteApi) return request<Product[]>(`/products${toSearchParams(query)}`);
  return applyQuery(productSeed, query);
}

export async function getProduct(id: string): Promise<Product | null> {
  if (hasRemoteApi) return request<Product | null>(`/products/${encodeURIComponent(id)}`);
  return productSeed.find((p) => p.id === id) ?? null;
}

export async function listRelated(product: Product, limit = 4): Promise<Product[]> {
  if (hasRemoteApi) {
    return request<Product[]>(`/products/${encodeURIComponent(product.id)}/related?limit=${limit}`);
  }
  return productSeed.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}

export async function searchProducts(term: string, limit = 6): Promise<Product[]> {
  return listProducts({ search: term, limit });
}
