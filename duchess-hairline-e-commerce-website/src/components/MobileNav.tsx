import { Link, useLocation } from 'react-router-dom';
import { routes } from '../config/business';
import { callLink, generalEnquiryLink } from '../lib/whatsapp';
import WhatsAppIcon from './icons/WhatsAppIcon';

/** Sticky conversion bar shown on phones only. */
export default function MobileNav() {
  const { pathname } = useLocation();

  const tabClass = (path: string) =>
    `flex flex-col items-center justify-center gap-1 transition-colors ${
      pathname === path ? 'text-white' : 'text-white/50'
    }`;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 bg-deep-black/95 backdrop-blur-md border-t border-white/10 md:hidden"
      aria-label="Quick actions"
    >
      <div className="grid grid-cols-4 h-16">
        <Link to={routes.home} className={tabClass(routes.home)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-[9px] uppercase tracking-wider font-medium">Home</span>
        </Link>

        <Link to={routes.collection} className={tabClass(routes.collection)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span className="text-[9px] uppercase tracking-wider font-medium">Collection</span>
        </Link>

        <a
          href={generalEnquiryLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 text-[#4ade80]"
        >
          <WhatsAppIcon size={18} />
          <span className="text-[9px] uppercase tracking-wider font-medium">WhatsApp</span>
        </a>

        <a href={callLink()} className="flex flex-col items-center justify-center gap-1 text-white/50">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
          <span className="text-[9px] uppercase tracking-wider font-medium">Call</span>
        </a>
      </div>
    </nav>
  );
}
