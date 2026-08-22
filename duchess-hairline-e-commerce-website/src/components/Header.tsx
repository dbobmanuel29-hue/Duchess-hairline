import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { business, routes } from '../config/business';
import { generalEnquiryLink } from '../lib/whatsapp';
import { useProductSearch } from '../hooks/useProducts';
import WhatsAppIcon from './icons/WhatsAppIcon';

const NAV_LINKS = [
  { to: routes.home, label: 'Home' },
  { to: routes.collection, label: 'Collection' },
  { to: routes.about, label: 'About' },
  { to: routes.reviews, label: 'Reviews' },
  { to: routes.contact, label: 'Contact' },
];

const POPULAR_SEARCHES = ['bone straight', 'curly', 'bob', 'frontal', 'closure', 'water wave'];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const results = useProductSearch(term);

  const isHome = location.pathname === routes.home;
  const overlayOpen = menuOpen || searchOpen;

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setTerm('');
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = overlayOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [overlayOpen]);

  useEffect(() => {
    if (!overlayOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlayOpen]);

  const submitSearch = (value = term) => {
    const query = value.trim();
    navigate(query ? `${routes.collection}?search=${encodeURIComponent(query)}` : routes.collection);
    setSearchOpen(false);
    setTerm('');
  };

  const solid = scrolled || !isHome || overlayOpen;
  const headerClass = solid
    ? 'bg-warm-white/95 backdrop-blur-md border-b border-beige/30'
    : 'bg-transparent';
  const textClass = solid ? 'text-deep-black' : 'text-white';

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${headerClass}`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className={`md:hidden p-2 -ml-2 ${textClass}`}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 8h18M3 16h18" />}
              </svg>
            </button>

            <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
              {NAV_LINKS.slice(0, 2).map((link) => (
                <Link key={link.to} to={link.to} className={`label-text hover:opacity-60 transition-opacity ${textClass}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              to={routes.home}
              className={`font-display text-base sm:text-lg md:text-xl tracking-wide font-semibold whitespace-nowrap ${textClass}`}
            >
              {business.name.toUpperCase()}
            </Link>

            <nav className="hidden md:flex items-center gap-8" aria-label="Secondary">
              {NAV_LINKS.slice(2).map((link) => (
                <Link key={link.to} to={link.to} className={`label-text hover:opacity-60 transition-opacity ${textClass}`}>
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`p-1 hover:opacity-60 transition-opacity ${textClass}`}
                aria-label="Search the collection"
              >
                <SearchIcon />
              </button>
              <a
                href={generalEnquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1 hover:opacity-60 transition-opacity ${textClass}`}
                aria-label="Chat on WhatsApp"
              >
                <WhatsAppIcon size={18} />
              </a>
            </nav>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`md:hidden p-2 -mr-2 ${textClass}`}
              aria-label="Search the collection"
            >
              <SearchIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40"
          onClick={() => setSearchOpen(false)}
          role="presentation"
        >
          <div
            className="bg-warm-white shadow-xl pt-20 md:pt-24 pb-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search the collection"
          >
            <div className="max-w-[720px] mx-auto px-4 md:px-8">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submitSearch();
                }}
                className="flex items-center gap-3 border-b border-beige/60 pb-3"
              >
                <SearchIcon size={20} className="text-charcoal/40" />
                <input
                  type="search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Search bone straight, curly, bob, frontal…"
                  className="flex-1 min-w-0 bg-transparent outline-none text-base text-deep-black placeholder:text-charcoal/40"
                  autoFocus
                />
                <button type="submit" className="label-text text-deep-black hover:opacity-60 shrink-0">
                  Search
                </button>
              </form>

              {term.trim() ? (
                <div className="pt-4 max-h-[50vh] overflow-y-auto">
                  {results.length > 0 ? (
                    <ul className="divide-y divide-beige/30">
                      {results.map((product) => (
                        <li key={product.id}>
                          <Link
                            to={routes.product(product.id)}
                            className="flex items-center gap-4 py-3 px-2 -mx-2 hover:bg-cream/50 transition-colors"
                          >
                            <img src={product.images[0]} alt="" className="w-12 h-16 object-cover bg-cream shrink-0" />
                            <span className="min-w-0">
                              <span className="block text-sm text-deep-black font-medium truncate">{product.name}</span>
                              <span className="block text-xs text-charcoal/50 mt-0.5">{product.categoryLabel}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-charcoal/50 py-6">
                      No wigs match “{term}”. Try “bob”, “curly” or “straight”.
                    </p>
                  )}
                  <button type="button" onClick={() => submitSearch()} className="label-text mt-4 text-deep-black hover:opacity-60">
                    View all results →
                  </button>
                </div>
              ) : (
                <div className="pt-5">
                  <p className="label-text text-charcoal/40 mb-3">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => submitSearch(item)}
                        className="label-text px-3 py-2 border border-beige/60 text-charcoal hover:border-deep-black transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-warm-white flex flex-col pt-20">
          <nav className="flex flex-col items-center gap-1 py-8" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-display text-3xl font-light text-deep-black hover:opacity-60 transition-opacity py-3"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-center gap-4 mt-auto pb-28 px-6">
            <a
              href={generalEnquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full max-w-xs"
            >
              Chat on WhatsApp
            </a>
            <p className="label-text text-charcoal/60 text-center">
              {business.address.city} • {business.address.region} • {business.address.country}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
