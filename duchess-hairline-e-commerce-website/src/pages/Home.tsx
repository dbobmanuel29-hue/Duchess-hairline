import { Link } from 'react-router-dom';
import { business, routes } from '../config/business';
import { categories } from '../config/categories';
import { media } from '../config/media';
import { generalEnquiryLink, directionsLink } from '../lib/whatsapp';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import Reveal from '../components/Reveal';
import SeoHead from '../components/SeoHead';

const MARQUEE_TEXT =
  'BONE STRAIGHT · CLOSURE WIGS · FRONTAL WIGS · CURLY WIGS · BODY WAVE · WATER WAVE · BOB WIGS · NEW ARRIVALS · ';

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse', body: 'Explore the collection and filter by style, texture or new arrivals.', image: media.product.frontal },
  { step: '02', title: 'Message', body: 'Tap Order to open WhatsApp with the wig details already filled in.', image: media.product.bodyWave },
  { step: '03', title: 'Confirm', body: 'We reply with availability and price, then agree pickup or delivery.', image: media.product.closure },
  { step: '04', title: 'Receive', body: 'Collect in Orazi or arrange delivery, and style with confidence.', image: media.product.frontalSignature },
];

export default function Home() {
  const featured = useProducts({ featured: true, limit: 4 });
  const newArrivals = useProducts({ newArrival: true, limit: 4 });
  const bestSellers = useProducts({ bestSeller: true, limit: 4 });

  return (
    <main className="pb-mobile-nav">
      <SeoHead
        title={`${business.name} — Premium Wigs & Hair in Port Harcourt, Nigeria`}
        description="Discover bone straight, closure, frontal, curly and bob wigs from Duchess Hairline in Port Harcourt. Browse the collection and order on WhatsApp."
      />

      <section className="relative h-[100svh] min-h-[560px] max-h-[1100px] flex items-end overflow-hidden">
        <img
          src={media.hero}
          alt="Model wearing a Duchess Hairline wig"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pb-16 md:pb-24">
          <p className="label-text text-white/60 mb-4">
            {business.address.city} • {business.address.country}
          </p>
          <h1 className="hero-heading text-white">
            YOUR NEXT
            <br />
            SIGNATURE
            <br />
            LOOK
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-md mt-6 leading-relaxed">
            Discover beautiful wigs and hair pieces from {business.name} and order directly through WhatsApp.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to={routes.collection} className="btn-white">
              View Collection
            </Link>
            <a href={generalEnquiryLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="bg-deep-black" aria-label="Social reach">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <dl className="grid grid-cols-3 divide-x divide-white/10">
            <div className="py-8 md:py-12 text-center">
              <dd className="font-display text-2xl md:text-4xl text-white font-light">
                {business.social.tiktok.followers}
              </dd>
              <dt className="label-text text-white/40 mt-2">TikTok Followers</dt>
            </div>
            <div className="py-8 md:py-12 text-center">
              <dd className="font-display text-2xl md:text-4xl text-white font-light">
                {business.social.tiktok.likes}
              </dd>
              <dt className="label-text text-white/40 mt-2">TikTok Likes</dt>
            </div>
            <div className="py-8 md:py-12 text-center">
              <dd className="font-display text-2xl md:text-4xl text-white font-light">PH</dd>
              <dt className="label-text text-white/40 mt-2">{business.address.region}</dt>
            </div>
          </dl>
        </div>
      </section>

      <div className="overflow-hidden bg-cream py-3 md:py-4" aria-hidden="true">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="label-text text-charcoal/40 pr-8">{MARQUEE_TEXT}</span>
          <span className="label-text text-charcoal/40 pr-8">{MARQUEE_TEXT}</span>
        </div>
      </div>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="text-center mb-12 md:mb-16">
            <p className="label-text text-charcoal/50 mb-3">Explore</p>
            <h2 className="section-heading text-deep-black">SHOP THE COLLECTION</h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {categories.map((category, i) => (
              <Reveal key={category.slug} delay={Math.min(i, 4) * 0.05}>
                <Link
                  to={`${routes.collection}?category=${category.slug}`}
                  className="group block relative overflow-hidden aspect-[3/4]"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                    <h3 className="font-display text-lg md:text-xl text-white font-light">{category.name}</h3>
                    <p className="label-text text-white/60 mt-1 hidden md:block">{category.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-deep-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <p className="label-text text-white/30 mb-4">The Everyday Edit</p>
              <h2 className="editorial-heading text-white mb-6">
                SELECTED
                <br />
                FOR YOUR
                <br />
                EVERY DAY.
              </h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-md mb-8">
                Versatile styles that move from a working morning to an evening out without a change of plan.
              </p>
              <Link to={`${routes.collection}?featured=true`} className="btn-white">
                Discover the Edit
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <img
                src={media.editorialPortrait}
                alt="Model wearing an everyday Duchess Hairline style"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-cream/50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="label-text text-charcoal/50 mb-3">Curated Selection</p>
              <h2 className="section-heading text-deep-black">THE DUCHESS EDIT</h2>
            </div>
            <Link to={`${routes.collection}?featured=true`} className="label-text text-deep-black hover:opacity-60 transition-opacity">
              View all →
            </Link>
          </Reveal>

          <ProductGrid
            products={featured.products}
            loading={featured.loading}
            error={featured.error}
            skeletonCount={4}
            columns="four"
          />
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="label-text text-charcoal/50 mb-3">Just Arrived</p>
              <h2 className="section-heading text-deep-black">NEW ARRIVALS</h2>
            </div>
            <Link to={`${routes.collection}?category=new-arrivals`} className="label-text text-deep-black hover:opacity-60 transition-opacity">
              View new arrivals →
            </Link>
          </Reveal>

          <ProductGrid
            products={newArrivals.products}
            loading={newArrivals.loading}
            error={newArrivals.error}
            skeletonCount={4}
            columns="four"
          />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-cream/50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="text-center mb-12 md:mb-16">
            <p className="label-text text-charcoal/50 mb-3">Style Guide</p>
            <h2 className="section-heading text-deep-black">EXPLORE BY STYLE</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[
              { number: '01', title: 'THE BOB EDIT', slug: 'bob-wigs', copy: 'Clean, modern bob shapes that frame the face and stay easy to maintain.' },
              { number: '02', title: 'TEXTURE EDIT', slug: 'curly-wigs', copy: 'Curly, body wave and water wave styles for natural texture and movement.' },
            ].map((edit) => (
              <Reveal key={edit.slug}>
                <Link to={`${routes.collection}?category=${edit.slug}`} className="group block">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="font-display text-5xl md:text-7xl text-beige font-light leading-none">{edit.number}</span>
                    <div className="pt-2">
                      <h3 className="font-display text-2xl md:text-3xl text-deep-black font-light">{edit.title}</h3>
                      <p className="text-sm text-charcoal/60 mt-2 max-w-xs leading-relaxed">{edit.copy}</p>
                    </div>
                  </div>
                  <div className="overflow-hidden aspect-[16/10]">
                    <img
                      src={categories.find((c) => c.slug === edit.slug)?.image}
                      alt={edit.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="label-text text-charcoal/50 mb-3">Most Requested</p>
              <h2 className="section-heading text-deep-black">CUSTOMER FAVOURITES</h2>
            </div>
            <Link to={routes.collection} className="label-text text-deep-black hover:opacity-60 transition-opacity">
              View collection →
            </Link>
          </Reveal>

          <ProductGrid
            products={bestSellers.products}
            loading={bestSellers.loading}
            error={bestSellers.error}
            skeletonCount={4}
            columns="four"
          />
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-deep-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="text-center mb-14 md:mb-20">
            <p className="label-text text-white/30 mb-3">Simple Process</p>
            <h2 className="font-display text-3xl md:text-5xl text-white font-light">HOW IT WORKS</h2>
          </Reveal>

          <ol className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {HOW_IT_WORKS.map((item, i) => (
              <Reveal key={item.step} delay={i * 0.05}>
                <li className="group list-none">
                  <div className="relative overflow-hidden aspect-[4/5] mb-5">
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 font-display text-5xl text-white/25 font-light">{item.step}</span>
                  </div>
                  <h3 className="font-display text-xl text-white font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{item.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] md:min-h-[600px]">
          <div className="flex items-center bg-deep-black px-6 md:px-12 lg:px-20 py-16 md:py-0 order-2 md:order-1">
            <Reveal>
              <p className="label-text text-white/40 mb-4">Follow Us</p>
              <h2 className="editorial-heading text-white mb-6">
                DUCHESS
                <br />
                HAIRLINE
                <br />
                ON TIKTOK
              </h2>
              <div className="flex gap-8 mb-8">
                <div>
                  <p className="font-display text-3xl md:text-4xl text-white font-light">
                    {business.social.tiktok.followers}
                  </p>
                  <p className="label-text text-white/40 mt-1">Followers</p>
                </div>
                <div>
                  <p className="font-display text-3xl md:text-4xl text-white font-light">
                    {business.social.tiktok.likes}
                  </p>
                  <p className="label-text text-white/40 mt-1">Likes</p>
                </div>
              </div>
              <a href={business.social.tiktok.url} target="_blank" rel="noopener noreferrer" className="btn-white">
                Follow {business.social.tiktok.handle}
              </a>
            </Reveal>
          </div>
          <div className="relative overflow-hidden aspect-[4/5] md:aspect-auto order-1 md:order-2">
            <img
              src={media.editorialAlt}
              alt="Duchess Hairline styling on TikTok"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="text-center">
            <p className="label-text text-charcoal/50 mb-4">Visit Us</p>
            <h2 className="editorial-heading text-deep-black mb-6">
              CHAT. VISIT.
              <br />
              ORDER.
            </h2>
            <address className="not-italic text-sm text-charcoal/60 max-w-md mx-auto leading-relaxed mb-2">
              {business.address.full}
            </address>
            <p className="text-xs text-charcoal/40 mb-10">Landmark: {business.address.landmark}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={generalEnquiryLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                Chat on WhatsApp
              </a>
              <a href={directionsLink()} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Get Directions
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
