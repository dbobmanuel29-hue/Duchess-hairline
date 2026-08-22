import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { ProductQuery, SortOption } from '../types';
import { business, routes } from '../config/business';
import { categories, findCategory } from '../config/categories';
import { media } from '../config/media';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import SeoHead from '../components/SeoHead';

const QUICK_SEARCHES = ['bone straight', 'curly', 'bob', 'frontal', 'closure', 'body wave'];

const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Featured',
  newest: 'Newest',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
};

export default function Collection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') ?? '';
  const search = searchParams.get('search') ?? '';
  const featured = searchParams.get('featured') === 'true';
  const newArrival = searchParams.get('new') === 'true';

  const [sort, setSort] = useState<SortOption>('featured');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [inputValue, setInputValue] = useState(search);

  // Keep the visible input in step with the URL (back button, quick chips).
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  const query = useMemo<ProductQuery>(
    () => ({ category, search, featured, newArrival, bestSeller, availableOnly, sort }),
    [category, search, featured, newArrival, bestSeller, availableOnly, sort],
  );

  const { products, loading, error } = useProducts(query);

  const hasActiveFilter = Boolean(category || search || featured || newArrival || bestSeller || availableOnly);

  const updateParams = (changes: Record<string, string | boolean | undefined>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (!value) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    setSearchParams(next, { replace: true });
  };

  const applySearch = (value: string) => {
    setInputValue(value);
    updateParams({ search: value.trim() || undefined });
  };

  const toggleCategory = (slug: string) => {
    updateParams({ category: category === slug ? undefined : slug });
  };

  const resetAll = () => {
    setSort('featured');
    setAvailableOnly(false);
    setBestSeller(false);
    setInputValue('');
    setSearchParams({}, { replace: true });
  };

  const heading = search
    ? `Results for “${search}”`
    : featured
      ? 'The Duchess Edit'
      : newArrival || category === 'new-arrivals'
        ? 'New Arrivals'
        : findCategory(category)?.name ?? 'The Collection';

  return (
    <main className="pt-16 md:pt-20 pb-mobile-nav min-h-screen">
      <SeoHead
        title={`${heading} — ${business.name}`}
        description="Browse bone straight, closure, frontal, curly, wave and bob wigs from Duchess Hairline in Port Harcourt. Order on WhatsApp."
      />

      {!hasActiveFilter && (
        <section className="relative overflow-hidden bg-deep-black min-h-[320px] md:min-h-[460px] flex items-end">
          <img
            src={media.heroWide}
            alt="The Duchess Hairline collection"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/50 to-transparent" />
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pb-12 md:pb-16">
            <p className="label-text text-white/50 mb-3">
              {business.address.city} · {business.address.country}
            </p>
            <h1 className="editorial-heading text-white mb-5">THE COLLECTION</h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              Bone straight, closures, frontals, curls, waves and bobs — browse the current edit and order on WhatsApp.
            </p>
          </div>
        </section>
      )}

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="pt-10 md:pt-14 text-center">
          {hasActiveFilter && <p className="label-text text-charcoal/50 mb-3">{business.name}</p>}
          <h2 className="section-heading text-deep-black uppercase tracking-wide">{heading}</h2>
          <p className="text-sm text-charcoal/60 mt-3">
            {loading
              ? 'Loading the collection…'
              : `${products.length} ${products.length === 1 ? 'wig' : 'wigs'} available`}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-8 mb-8">
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              applySearch(inputValue);
            }}
            className="flex items-center border border-beige/60 bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" className="ml-4 shrink-0" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={inputValue}
              onChange={(event) => applySearch(event.target.value)}
              placeholder="Search bone straight, curly, bob, frontal…"
              aria-label="Search the collection"
              className="w-full min-w-0 px-4 py-3.5 text-sm bg-transparent outline-none text-deep-black placeholder:text-charcoal/40"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => applySearch('')}
                className="px-3 py-3 text-charcoal/40 hover:text-charcoal transition-colors"
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {QUICK_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => applySearch(term)}
                className="label-text px-3 py-1.5 border border-beige/60 text-charcoal/70 hover:border-deep-black hover:text-deep-black transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button
            type="button"
            onClick={() => updateParams({ category: undefined })}
            className={`label-text px-4 py-2 border transition-colors ${
              !category ? 'bg-deep-black text-white border-deep-black' : 'text-charcoal border-beige/60 hover:border-charcoal'
            }`}
          >
            All Styles
          </button>
          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => toggleCategory(item.slug)}
              className={`label-text px-4 py-2 border transition-colors ${
                category === item.slug
                  ? 'bg-deep-black text-white border-deep-black'
                  : 'text-charcoal border-beige/60 hover:border-charcoal'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-beige/30 pt-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowFilters((open) => !open)}
              aria-expanded={showFilters}
              className="label-text text-charcoal hover:text-deep-black flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" />
              </svg>
              Filters
            </button>
            {hasActiveFilter && (
              <button type="button" onClick={resetAll} className="label-text text-charcoal/50 hover:text-deep-black">
                Clear all
              </button>
            )}
          </div>

          <label className="flex items-center gap-2">
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="label-text bg-transparent text-charcoal border border-beige/40 px-3 py-2 cursor-pointer"
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                <option key={option} value={option}>
                  {SORT_LABELS[option]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-5 bg-cream/60 p-4 mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="accent-deep-black" />
              <span className="text-xs text-charcoal">Available only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newArrival} onChange={(e) => updateParams({ new: e.target.checked || undefined })} className="accent-deep-black" />
              <span className="text-xs text-charcoal">New arrivals</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} className="accent-deep-black" />
              <span className="text-xs text-charcoal">Best sellers</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => updateParams({ featured: e.target.checked || undefined })} className="accent-deep-black" />
              <span className="text-xs text-charcoal">Featured</span>
            </label>
          </div>
        )}

        <div className="pb-16">
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            emptyState={
              <div className="text-center py-24">
                <p className="font-display text-2xl text-charcoal/60 mb-2">No wigs found</p>
                <p className="text-sm text-charcoal/40 mb-6">
                  Nothing matches that combination. Try “bob”, “curly” or clear your filters.
                </p>
                <button type="button" onClick={resetAll} className="btn-outline">
                  View full collection
                </button>
              </div>
            }
          />
        </div>

        {!hasActiveFilter && (
          <section className="pb-20">
            <div className="bg-deep-black relative overflow-hidden">
              <img src={media.editorialPortrait} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-20" />
              <div className="relative z-10 px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="label-text text-white/40 mb-2">Not sure which style?</p>
                  <h2 className="font-display text-2xl md:text-4xl text-white font-light">ASK US ON WHATSAPP</h2>
                  <p className="text-sm text-white/50 mt-2 max-w-md">
                    Send a message and we will help you choose a wig that suits your look and budget.
                  </p>
                </div>
                <Link to={routes.contact} className="btn-white shrink-0">
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
