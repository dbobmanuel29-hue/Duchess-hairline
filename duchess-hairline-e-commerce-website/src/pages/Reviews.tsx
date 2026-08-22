import { Link } from 'react-router-dom';
import { business, routes } from '../config/business';
import { media } from '../config/media';
import { generalEnquiryLink } from '../lib/whatsapp';
import Reveal from '../components/Reveal';
import SeoHead from '../components/SeoHead';

/**
 * Review content is intentionally empty.
 *
 * Nothing on this page invents a customer, a quote or a rating. Replace the
 * placeholders below with verified reviews as they are collected — the layout
 * is already built for them.
 */
const REVIEW_SLOTS = Array.from({ length: 6 }, (_, i) => i);
const GALLERY_SLOTS = Array.from({ length: 8 }, (_, i) => i);

export default function Reviews() {
  return (
    <main className="pt-16 md:pt-20 pb-mobile-nav min-h-screen">
      <SeoHead
        title={`Customer Looks & Reviews — ${business.name}`}
        description="Customer looks and reviews for Duchess Hairline in Port Harcourt. Share your look on WhatsApp or TikTok to be featured."
      />

      <section className="relative h-[48vh] md:h-[58vh] min-h-[340px] flex items-end overflow-hidden">
        <img src={media.editorialAlt} alt="Duchess Hairline customer styling" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pb-14 md:pb-20">
          <p className="label-text text-white/50 mb-4">Community</p>
          <h1 className="hero-heading text-white leading-[0.92]">
            REAL PEOPLE.
            <br />
            REAL LOOKS.
          </h1>
        </div>
      </section>

      <section className="bg-cream">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <dl className="grid grid-cols-2 divide-x divide-beige/50 py-10 md:py-14">
            <div className="text-center">
              <dd className="font-display text-3xl md:text-5xl text-deep-black font-light">
                {business.social.tiktok.followers}
              </dd>
              <dt className="label-text text-charcoal/40 mt-2">TikTok Followers</dt>
            </div>
            <div className="text-center">
              <dd className="font-display text-3xl md:text-5xl text-deep-black font-light">
                {business.social.tiktok.likes}
              </dd>
              <dt className="label-text text-charcoal/40 mt-2">TikTok Likes</dt>
            </div>
          </dl>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <p className="label-text text-charcoal/50 mb-4">Testimonials</p>
            <h2 className="section-heading text-deep-black mb-5">CUSTOMER REVIEWS</h2>
            <p className="text-sm text-charcoal/60 leading-relaxed">
              We only publish reviews from customers who have actually bought from us, so this space stays empty until
              those are collected. If you have ordered from {business.name}, send us your feedback on WhatsApp.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEW_SLOTS.map((slot) => (
              <Reveal key={slot} delay={(slot % 3) * 0.05}>
                <div className="border border-dashed border-beige h-full p-7 md:p-9 flex flex-col items-center text-center justify-center min-h-[220px]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d4c5b0" strokeWidth="1" className="mb-4" aria-hidden="true">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  <p className="label-text text-beige mb-1">Review slot {slot + 1}</p>
                  <p className="text-xs text-charcoal/35 max-w-[22ch]">
                    Add a verified customer review, name and the wig they purchased.
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-cream/30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="text-center mb-12 md:mb-16">
            <p className="label-text text-charcoal/50 mb-3">Gallery</p>
            <h2 className="section-heading text-deep-black mb-4">CUSTOMER LOOKS</h2>
            <p className="text-sm text-charcoal/50 max-w-md mx-auto">
              Photographs sent in by customers will appear here. Drop a picture into this grid once you have permission
              to publish it.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {GALLERY_SLOTS.map((slot) => (
              <Reveal key={slot} delay={(slot % 4) * 0.05}>
                <div className="aspect-[3/4] border border-dashed border-beige bg-white/40 flex flex-col items-center justify-center text-center px-3">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d4c5b0" strokeWidth="1" className="mb-2" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p className="label-text text-beige">Photo {slot + 1}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-deep-black">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px]">
          <div className="flex items-center px-6 md:px-12 lg:px-16 py-16 lg:py-0 order-2 lg:order-1">
            <Reveal>
              <p className="label-text text-white/30 mb-3">Social</p>
              <h2 className="font-display text-3xl md:text-5xl text-white font-light leading-[1.05] mb-5">
                SEE THE WIGS
                <br />
                IN MOTION
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-sm">
                Our TikTok is where most customers see the styles first — how they move, how they sit, and how they look
                in daylight rather than under studio lights.
              </p>
              <a href={business.social.tiktok.url} target="_blank" rel="noopener noreferrer" className="btn-white">
                Follow {business.social.tiktok.handle}
              </a>
            </Reveal>
          </div>
          <div className="relative overflow-hidden order-1 lg:order-2 min-h-[320px]">
            <img src={media.editorialPortrait} alt="Duchess Hairline on TikTok" loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl text-deep-black font-light leading-[1.05] mb-6">
              SHARE YOUR LOOK.
              <br />
              BE FEATURED.
            </h2>
            <p className="text-sm text-charcoal/60 max-w-md mx-auto mb-10 leading-relaxed">
              Send us a photo on WhatsApp or tag us on TikTok. We ask permission before publishing anything.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={generalEnquiryLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                Share on WhatsApp
              </a>
              <Link to={routes.collection} className="btn-outline">
                View Collection
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
