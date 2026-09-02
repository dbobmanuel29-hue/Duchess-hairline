import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { routes } from '../config/business';
import { productOrderLink } from '../lib/whatsapp';
import { media } from '../config/media';
import { useInView } from '../hooks/useInView';

interface ProductCardProps { product: Product; index?: number; }
const formatPrice=(value:unknown):string=>{if(typeof value==='number'&&Number.isFinite(value))return `₦${new Intl.NumberFormat('en-NG',{maximumFractionDigits:0}).format(value)}`;if(typeof value==='string'){const n=Number(value.replace(/[₦,\s]/g,''));if(Number.isFinite(n))return `₦${new Intl.NumberFormat('en-NG',{maximumFractionDigits:0}).format(n)}`;}return 'Price on request';};
export default function ProductCard({product,index=0}:ProductCardProps){
  const {ref,inView}=useInView();
  const href=routes.product(product.id);
  const price=formatPrice(product.price);
  return <article ref={ref} className={`group reveal ${inView?'in-view':''}`} style={{transitionDelay:`${Math.min(index,7)*0.05}s`}}>
    <Link to={href} className="block relative overflow-hidden bg-cream aspect-[3/4]">
      <img src={product.images[0]||media.product.boneStraight} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={event=>{event.currentTarget.src=media.product.boneStraight;event.currentTarget.onerror=null;}} />
      {product.badge&&<span className="product-badge absolute top-3 left-3">{product.badge}</span>}
      {!product.available&&<span className="absolute inset-0 bg-white/70 flex items-center justify-center label-text text-charcoal">Sold out</span>}
    </Link>
    <div className="pt-4">
      <p className="label-text text-charcoal/50 mb-1">{product.categoryLabel}</p>
      <h3 className="font-body text-sm font-medium text-deep-black leading-snug mb-1"><Link to={href} className="hover:opacity-70 transition-opacity">{product.name}</Link></h3>
      <p className="text-sm text-charcoal/70 font-light mb-3">{price}</p>
      <div className="card-actions">
        <Link to={href} className="btn-outline btn-sm">Details</Link>
        {product.available ? <a href={productOrderLink(product)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-sm" aria-label={`Order ${product.name} on WhatsApp`}>Order</a> : <Link to={href} className="btn-outline btn-sm" aria-label={`View ${product.name} availability details`}>View</Link>}
      </div>
    </div>
  </article>;
}
