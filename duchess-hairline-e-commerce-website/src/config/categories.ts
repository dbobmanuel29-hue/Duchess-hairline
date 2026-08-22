import type { Category } from '../types';
import { media } from './media';

/**
 * Categories are treated as configuration rather than remote data because
 * they change rarely and drive navigation. If they ever move to a backend,
 * expose them through `productService` the same way products are.
 */
export const categories: Category[] = [
  {
    slug: 'bone-straight',
    name: 'Bone Straight',
    description: 'Sleek, smooth and perfectly straight styles.',
    image: media.product.boneStraight,
  },
  {
    slug: 'closure-wigs',
    name: 'Closure Wigs',
    description: 'Natural-looking closure wig styles.',
    image: media.product.closure,
  },
  {
    slug: 'frontal-wigs',
    name: 'Frontal Wigs',
    description: 'Full frontal lace wigs for a seamless hairline.',
    image: media.product.frontal,
  },
  {
    slug: 'curly-wigs',
    name: 'Curly Wigs',
    description: 'Beautiful curly and textured styles.',
    image: media.product.curly,
  },
  {
    slug: 'body-wave',
    name: 'Body Wave',
    description: 'Soft, flowing body wave styles.',
    image: media.product.bodyWave,
  },
  {
    slug: 'water-wave',
    name: 'Water Wave',
    description: 'Stunning water wave texture wigs.',
    image: media.product.waterWave,
  },
  {
    slug: 'bob-wigs',
    name: 'Bob Wigs',
    description: 'Chic and stylish bob-length wigs.',
    image: media.product.bob,
  },
  {
    slug: 'new-arrivals',
    name: 'New Arrivals',
    description: 'The latest additions to the collection.',
    image: media.product.frontalSignature,
  },
];

export function findCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
