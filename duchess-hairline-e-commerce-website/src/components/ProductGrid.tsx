import type { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  /** Number of skeletons to show while loading. */
  skeletonCount?: number;
  columns?: 'two' | 'four';
  emptyState?: React.ReactNode;
}

const COLUMN_CLASS = {
  two: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  four: 'grid-cols-2 lg:grid-cols-4',
};

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-cream" />
      <div className="pt-4 space-y-2">
        <div className="h-2 w-16 bg-cream" />
        <div className="h-3 w-3/4 bg-cream" />
        <div className="h-3 w-1/3 bg-cream" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  products,
  loading = false,
  error = null,
  skeletonCount = 8,
  columns = 'two',
  emptyState,
}: ProductGridProps) {
  const gridClass = `grid ${COLUMN_CLASS[columns]} gap-4 md:gap-6`;

  if (loading) {
    return (
      <div className={gridClass} aria-busy="true" aria-live="polite">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-2xl text-charcoal/70 mb-2">Something went wrong</p>
        <p className="text-sm text-charcoal/50">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className={gridClass}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
