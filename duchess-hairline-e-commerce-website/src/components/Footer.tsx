import { Link } from 'react-router-dom';
import { business, routes } from '../config/business';
import { categories } from '../config/categories';
import { generalEnquiryLink } from '../lib/whatsapp';
import WhatsAppIcon from './icons/WhatsAppIcon';

const PAGE_LINKS = [
  { to: routes.home, label: 'Home' },
  { to: routes.collection, label: 'Collection' },
  { to: `${routes.collection}?category=new-arrivals`, label: 'New Arrivals' },
  { to: routes.about, label: 'About' },
  { to: routes.reviews, label: 'Reviews' },
  { to: routes.contact, label: 'Contact' },
];

const LEGAL_LINKS = [
  { to: routes.terms, label: 'Terms & Conditions' },
  { to: routes.privacy, label: 'Privacy Policy' },
  { to: routes.security, label: 'Security' },
];

export default function Footer() {
  return (
    <footer className="bg-deep-black text-white/80">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-16 md:pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div>
            <Link to={routes.home} className="font-display text-xl font-semibold text-white tracking-wide">
              {business.name.toUpperCase()}
            </Link>
            <p className="text-sm text-white/50 mt-4 leading-relaxed max-w-xs">
              {business.tagline} Discover your next signature look and order on WhatsApp.
            </p>
          </div>

          <nav aria-label="Footer pages">
            <h2 className="label-text text-white/40 mb-6">Navigate</h2>
            <ul className="flex flex-col gap-3">
              {PAGE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer collections">
            <h2 className="label-text text-white/40 mb-6">Styles</h2>
            <ul className="flex flex-col gap-3">
              {categories.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`${routes.collection}?category=${category.slug}`}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label-text text-white/40 mb-6">Get in Touch</h2>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={generalEnquiryLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  WhatsApp: {business.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={business.social.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  TikTok: {business.social.tiktok.handle}
                </a>
              </li>
            </ul>
            <address className="not-italic text-sm text-white/50 leading-relaxed mt-4">
              {business.address.full}
            </address>
          </div>
        </div>

        <nav aria-label="Legal" className="mt-12 pt-8 border-t border-white/10">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="label-text text-white/50 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 text-center md:text-left">
            © 2026 {business.legal.entityName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href={business.social.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Follow Duchess Hairline on TikTok"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.72a8.18 8.18 0 004.76 1.52V6.79a4.83 4.83 0 01-1-.1z" />
              </svg>
            </a>
            <a
              href={generalEnquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
