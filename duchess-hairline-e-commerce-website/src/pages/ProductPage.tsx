import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { business, routes } from '../config/business';
import { media } from '../config/media';
import { productOrderLink } from '../lib/whatsapp';
import { useProduct } from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import SeoHead from '../components/SeoHead';
import WhatsAppIcon from '../components/icons/WhatsAppIcon';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { product, related, loading, notFound } = useProduct(id);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  useEffect(() => { setActiveImage(0); setLightboxOpen(false); }, [id]);
  const imageCount = product?.images.length ?? 0;
  useEffect(() => {
    if (!lightboxOpen || imageCount === 0) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setLightboxOpen(false); if (event.key === 'ArrowRight') setActiveImage(i => (i + 1) % imageCount); if (event.key === 'ArrowLeft') setActiveImage(i => (i - 1 + imageCount) % imageCount); };
    window.addEventListener('keydown', onKeyDown); document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  }, [lightboxOpen, imageCount]);
  const price = product?.price ? `₦${product.price.toLocaleString()}` : 'Price available on request';
  const productDescription = product?.description || `${product?.name || 'Wig'} from Duchess Hairline in Port Harcourt.`;
  const structuredData = useMemo(() => {
    if (!product) return undefined;
    const canonicalUrl = `${window.location.origin}/product/${encodeURIComponent(product.id)}`;
    return { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: productDescription, image: product.images.length ? product.images : [media.product.boneStraight], sku: product.id, brand: { '@type': 'Brand', name: business.name }, category: product.categoryLabel, url: canonicalUrl, offers: { '@type': 'Offer', url: canonicalUrl, priceCurrency: 'NGN', availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', ...(product.price != null ? { price: product.price } : {}) } } as Record<string, unknown>;
  }, [product, productDescription]);
  if (loading) return <main className="pt-24 pb-mobile-nav min-h-screen"><div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-10"><div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 animate-pulse"><div className="aspect-[3/4] bg-cream" /><div className="space-y-4 pt-4"><div className="h-3 w-24 bg-cream" /><div className="h-10 w-3/4 bg-cream" /><div className="h-4 w-32 bg-cream" /><div className="h-24 w-full bg-cream" /></div></div></div></main>;
  if (notFound || !product) return <main className="pt-24 pb-mobile-nav min-h-screen flex items-center justify-center"><div className="text-center px-4"><h1 className="font-display text-3xl text-deep-black mb-4">Wig not found</h1><p className="text-sm text-charcoal/60 mb-8">This item may no longer be listed.</p><Link to={routes.collection} className="btn-primary">Back to Collection</Link></div></main>;
  const specs = [{ label: 'Length', value: product.length }, { label: 'Hair Type', value: product.hairType }, { label: 'Lace Type', value: product.laceType }, { label: 'Density', value: product.density }, { label: 'Texture', value: product.texture }].filter((spec): spec is { label: string; value: string } => Boolean(spec.value));
  return <main className="pt-16 md:pt-20 pb-mobile-nav min-h-screen">
    <SeoHead title={`${product.name} — ${business.name}`} description={productDescription} image={product.images[0] || media.product.boneStraight} type="product" structuredData={structuredData} />
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
      <nav aria-label="Breadcrumb" className="label-text text-charcoal/40 py-5"><Link to={routes.home}>Home</Link><span className="mx-2" aria-hidden="true">/</span><Link to={routes.collection}>Collection</Link><span className="mx-2" aria-hidden="true">/</span><Link to={`${routes.collection}?category=${product.category}`}>{product.categoryLabel}</Link></nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-16">
        <div>
          <button type="button" onClick={() => setLightboxOpen(true)} className="relative block w-full overflow-hidden bg-cream aspect-[3/4] cursor-zoom-in" aria-label="Open larger image"><img src={product.images[activeImage] || media.product.boneStraight} alt={`${product.name}, image ${activeImage + 1} of ${imageCount}`} className="w-full h-full object-cover" loading="eager" fetchPriority="high" onError={event=>{event.currentTarget.src=media.product.boneStraight;event.currentTarget.onerror=null;}} />{product.badge && <span className="product-badge absolute top-4 left-4">{product.badge}</span>}</button>
          {imageCount > 1 && <div className="flex gap-2 mt-3">{product.images.map((image, i) => <button key={image} type="button" onClick={() => setActiveImage(i)} aria-label={`Show image ${i + 1}`} aria-current={activeImage === i} className={`w-16 h-20 md:w-20 md:h-24 overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-deep-black' : 'border-transparent'}`}><img src={image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" onError={event=>{event.currentTarget.src=media.product.boneStraight;event.currentTarget.onerror=null;}} /></button>)}</div>}
          {product.video && <div className="mt-4"><video src={product.video} controls playsInline preload="metadata" className="w-full" /></div>}
        </div>
        <div className="lg:pt-4">
          <p className="label-text text-charcoal/50 mb-2">{product.categoryLabel}</p><h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-deep-black font-light leading-tight mb-4">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mb-6"><p className="text-lg md:text-xl text-deep-black font-medium">{price}</p><span className={`label-text px-2 py-1 ${product.available ? 'text-[#18703d] bg-[#18703d]/10' : 'text-charcoal/60 bg-cream'}`}>{product.available ? 'Available' : 'Sold out'}</span></div>
          <div className="border-t border-beige/30 pt-6 mb-6"><p className="text-sm text-charcoal/70 leading-relaxed">{product.description}</p></div>
          {specs.length > 0 && <div className="border-t border-beige/30 pt-6 mb-6"><h2 className="label-text text-charcoal/50 mb-4">Specifications</h2><dl className="grid grid-cols-2 gap-3">{specs.map(spec => <div key={spec.label}><dt className="text-xs text-charcoal/40 uppercase tracking-wider">{spec.label}</dt><dd className="text-sm text-deep-black mt-0.5">{spec.value}</dd></div>)}</dl></div>}
          <div className="border-t border-beige/30 pt-6 space-y-3"><a href={productOrderLink(product)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full"><WhatsAppIcon size={18} />{product.available ? 'Order on WhatsApp' : 'Ask About Availability'}</a><Link to={routes.collection} className="btn-outline w-full">Continue Browsing</Link><p className="text-xs text-charcoal/40 text-center pt-2">Price and availability are confirmed on WhatsApp before any order is agreed.</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-center"><div className="bg-cream/60 px-3 py-4"><p className="label-text text-charcoal/50 mb-1">Secure</p><p className="text-xs text-charcoal/60">Confirm details before payment.</p></div><div className="bg-cream/60 px-3 py-4"><p className="label-text text-charcoal/50 mb-1">Local</p><p className="text-xs text-charcoal/60">Pickup and delivery arranged in Port Harcourt.</p></div><div className="bg-cream/60 px-3 py-4"><p className="label-text text-charcoal/50 mb-1">Support</p><p className="text-xs text-charcoal/60">Chat with us before you commit.</p></div></div>
        </div>
      </div>
      {related.length > 0 && <section className="border-t border-beige/30 pt-12 pb-16"><div className="flex items-end justify-between mb-8 gap-4"><h2 className="section-heading text-deep-black">YOU MAY ALSO LIKE</h2><Link to={`${routes.collection}?category=${product.category}`} className="label-text text-charcoal hover:text-deep-black transition-colors shrink-0">View all →</Link></div><ProductGrid products={related} columns="four" /></section>}
    </div>
    {lightboxOpen && <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)} role="dialog" aria-modal="true" aria-label={`${product.name} enlarged image`}><button type="button" onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 text-white/70 hover:text-white p-3 z-10" aria-label="Close image">×</button>{imageCount > 1 && <><button type="button" onClick={event => {event.stopPropagation();setActiveImage(i=>(i-1+imageCount)%imageCount);}} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-10" aria-label="Previous image">‹</button><button type="button" onClick={event => {event.stopPropagation();setActiveImage(i=>(i+1)%imageCount);}} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-10" aria-label="Next image">›</button></> }<img src={product.images[activeImage] || media.product.boneStraight} alt={product.name} className="max-h-[85vh] max-w-[90vw] object-contain" onClick={event=>event.stopPropagation()} /></div>}
  </main>;
}
