import { useEffect, useMemo, useRef, useState } from 'react';
import type { Product, ProductQuery } from '../types';
import { getProduct, listProducts, listRelated } from '../services/productService';

export function useProducts(query: ProductQuery = {}) {
  const key = JSON.stringify(query);
  const stableQuery = useMemo(() => JSON.parse(key) as ProductQuery, [key]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    listProducts(stableQuery)
      .then((result) => {
        if (!active) return;
        setProducts(result);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError('We could not load the collection. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [stableQuery]);

  return { products, loading, error };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setRelated([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    getProduct(id)
      .then(async (found) => {
        if (!active) return;
        setProduct(found);
        if (found) {
          const relatedItems = await listRelated(found, 5);
          if (active) setRelated(relatedItems.slice(0, 4));
        } else {
          setRelated([]);
        }
      })
      .catch(() => {
        if (!active) return;
        setProduct(null);
        setRelated([]);
        setError('We could not load this wig. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return { product, related, loading, error, notFound: !loading && !error && !product };
}

export function useProductSearch(term: string, delay = 180) {
  const [results, setResults] = useState<Product[]>([]);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearTimeout(timer.current);

    if (!term.trim()) {
      setResults([]);
      return;
    }

    timer.current = window.setTimeout(() => {
      listProducts({ search: term, limit: 6 })
        .then(setResults)
        .catch(() => setResults([]));
    }, delay);

    return () => window.clearTimeout(timer.current);
  }, [term, delay]);

  return results;
}
