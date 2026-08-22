import { Link } from 'react-router-dom';
import { business, routes } from '../config/business';
import SeoHead from '../components/SeoHead';

export default function NotFound() {
  return (
    <main className="pt-24 pb-mobile-nav min-h-screen flex items-center justify-center">
      <SeoHead title={`Page not found — ${business.name}`} description="This page does not exist." />
      <div className="text-center px-4">
        <p className="font-display text-8xl md:text-[10rem] text-beige/50 font-light leading-none mb-4">404</p>
        <h1 className="font-display text-2xl md:text-3xl text-deep-black font-light mb-4">Page not found</h1>
        <p className="text-sm text-charcoal/60 max-w-sm mx-auto mb-8 leading-relaxed">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to={routes.home} className="btn-primary">
            Back to Home
          </Link>
          <Link to={routes.collection} className="btn-outline">
            View Collection
          </Link>
        </div>
      </div>
    </main>
  );
}
