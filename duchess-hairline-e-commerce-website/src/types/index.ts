export interface Product {
  id: string;
  name: string;
  price: number | null;
  category: CategorySlug;
  categoryLabel: string;
  length: string | null;
  hairType: string | null;
  laceType: string | null;
  density: string | null;
  texture: string | null;
  description: string;
  images: string[];
  video: string | null;
  badge: string | null;
  available: boolean;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  /** Firestore/server creation timestamp used to surface newly added products first. */
  createdAt?: unknown;
}

export type CategorySlug =
  | 'bone-straight'
  | 'closure-wigs'
  | 'frontal-wigs'
  | 'curly-wigs'
  | 'body-wave'
  | 'water-wave'
  | 'bob-wigs';

export interface Category {
  slug: CategorySlug | 'new-arrivals';
  name: string;
  description: string;
  image: string;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export interface ProductQuery {
  category?: string;
  search?: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  availableOnly?: boolean;
  sort?: SortOption;
  limit?: number;
}

export interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}
