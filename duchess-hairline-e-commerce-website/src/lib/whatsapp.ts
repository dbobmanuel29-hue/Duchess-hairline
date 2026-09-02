import { business } from '../config/business';
import type { Product } from '../types';

const WA_BASE = `https://wa.me/${business.phone.raw}`;
export function whatsAppLink(message?: string): string { return message ? `${WA_BASE}?text=${encodeURIComponent(message)}` : WA_BASE; }
export function generalEnquiryLink(): string { return whatsAppLink(`Hello ${business.name}, I am browsing your website and would like to know more about your wigs. Please assist me.`); }
export function productOrderLink(product: Product): string {
  const price = product.price ? `₦${product.price.toLocaleString()}` : 'available on request';
  const lines = [
    `Hello ${business.name}, I saw the ${product.name} on your website and I would like to order it.`,
    `Price: ${price}`,
    `Category: ${product.categoryLabel}`,
  ];
  if (typeof window !== 'undefined') lines.push(`Link: ${window.location.origin}/product/${encodeURIComponent(product.id)}`);
  lines.push('', 'Please confirm availability and how I can order.');
  return whatsAppLink(lines.join('\n'));
}
export function callLink(): string { return `tel:+${business.phone.raw}`; }
export function directionsLink(): string { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address.full)}`; }
