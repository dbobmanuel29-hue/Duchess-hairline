import { Link } from 'react-router-dom';
import { business, routes } from '../config/business';
import { media } from '../config/media';
import { generalEnquiryLink, directionsLink } from '../lib/whatsapp';
import Reveal from '../components/Reveal';
import SeoHead from '../components/SeoHead';

const OFFERINGS = [
  { title: 'Bone Straight', copy: 'Sleek, smooth and effortlessly polished.', image: media.product.boneStraight, slug: 'bone-straight' },
  { title: 'Closure & Frontal', copy: 'Natural hairlines with a tidy, professional finish.', image: media.product.closure, slug: 'closure-wigs' },
  { title: 'Curly & Textured', copy: 'Volume and texture for a bolder everyday look.', image: media.product.curly, slug: 'curly-wigs' },
  { title: 'Bob & Short Cuts', copy: 'Modern shapes that are quick to style and maintain.', image: media.product.bob, slug: 'bob-wigs' },
];

const VALUES = [
  {
    number: '01',
    title: 'CURATION OVER VOLUME',
    body: 'We would rather stock a smaller range we can stand behind than fill a page with styles we have not checked ourselves.',
    image: media.product.curlyNatural,
  },
  {
    number: '02',
    title: 'ORDERING WITHOUT FRICTION',
    body: 'No account, no long checkout. You send a message, we confirm availability and price, and the order moves forward from there.',
    image: media.product.boneStraightFrontal,
  },
  {
    number: '03',
    title: 'A REAL PLACE TO VISIT',
    body: 'We are based in Orazi, Port Harcourt. You are welcome to come and see a wig in person before deciding.',
    image: media.storeInterior,
  },
];

export default function About() {
  return (
    <main className="pt-16 md:pt-20 pb-mobile-nav min-h-screen">
      <SeoHead
        title={`About — ${business.name}`}
        description="Duchess Hairline is a Port Harcourt based wig and hair business offering a simple way to discover styles and order through WhatsApp."
      />

      <section className="relative h-[52vh] md:h-[62vh] min-h-[360px] flex items-end overflow-hidden">
        <img src={media.aboutWide} alt="Duchess Hairline styling" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pb-14 md:pb-20">
          <p className="label-text text-white/50 mb-4">Our Story</p>
          <h1 className="hero-heading text-white leading-[0.92]">
            ABOUT
            <br />
            <span className="italic font-light">Duchess</span>
            <br />
            HAIRLINE
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-28">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <Reveal className="lg:col-span-5">
              <p className="label-text text-charcoal/50 mb-5">Who We Are</p>
              <h2 className="font-display text-3xl md:text-5xl text-deep-black font-light leading-[1.05]">
                Premium wigs and hair, sold simply, from Port Harcourt.
              </h2>
            </Reveal>
            <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
              <div className="space-y-5 text-sm md:text-base text-charcoal/70 leading-[1.85]">
                <p>
                  {business.name} is a {business.address.city} based wig and hair business. We give customers a clear way
                  to see what is available and order it through WhatsApp, without accounts, forms or a long checkout.
                </p>
                <p>
                  The collection covers bone straight, closure, frontal, curly, body wave, water wave and bob styles.
                  Each one is chosen for how it wears day to day, not just how it photographs.
                </p>
                <p>
                  Our TikTok community has grown to {business.social.tiktok.followers} followers and{' '}
                  {business.social.tiktok.likes} likes, and a large share of our customers find us there first before
                  messaging us to order.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-deep-black py-16 md:py-28">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <Reveal>
              <img
                src={media.editorialAlt}
                alt="Editorial portrait of a Duchess Hairline style"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="label-text text-white/30 mb-4">Our Approach</p>
              <h2 className="font-display text-3xl md:text-5xl text-white font-light leading-[1.05] mb-8">
                BEAUTY IS
                <br />
                PERSONAL.
                <br />
                STYLE IS
                <br />
                YOUR OWN.
              </h2>
              <div className="space-y-5 text-sm md:text-base text-white/50 leading-[1.85]">
                <p>
                  There is no single wig that suits everyone. What matters is finding the texture, length and cap style
                  that fits your face, your routine and your budget.
                </p>
                <p>
                  So we keep the website honest: clear photographs, plain descriptions, and no invented claims about
                  origin or grade. Anything we are not certain of, we confirm with you directly on WhatsApp.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-28">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="text-center mb-14 md:mb-20">
            <p className="label-text text-charcoal/50 mb-4">What We Offer</p>
            <h2 className="section-heading text-deep-black">THE COLLECTION</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFERINGS.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.05}>
                <Link
                  to={`${routes.collection}?category=${item.slug}`}
                  className="group block bg-white border border-beige/20 overflow-hidden h-full"
                >
                  <div className="overflow-hidden aspect-[4/5]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="font-display text-xl text-deep-black font-light mb-2">{item.title}</h3>
                    <p className="text-sm text-charcoal/60 leading-relaxed">{item.copy}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-28 bg-cream/30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="text-center mb-14 md:mb-20">
            <p className="label-text text-charcoal/50 mb-4">How We Work</p>
            <h2 className="section-heading text-deep-black">WHAT WE BELIEVE</h2>
          </Reveal>

          <div className="space-y-14 md:space-y-24">
            {VALUES.map((value, i) => (
              <Reveal key={value.number}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="overflow-hidden aspect-[4/3]">
                      <img src={value.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    <span className="font-display text-6xl md:text-7xl text-beige/60 font-light leading-none">
                      {value.number}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-deep-black font-light mt-4 mb-4">{value.title}</h3>
                    <p className="text-sm text-charcoal/70 leading-relaxed max-w-md">{value.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-28 bg-deep-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <Reveal>
              <p className="label-text text-white/30 mb-4">Visit Our Store</p>
              <h2 className="font-display text-3xl md:text-5xl text-white font-light leading-[1.05] mb-8">
                COME FIND
                <br />
                YOUR LOOK.
              </h2>
              <dl className="space-y-6 text-sm text-white/60 leading-relaxed">
                <div>
                  <dt className="text-white/80 text-base mb-1">Address</dt>
                  <dd>
                    {business.address.full}
                    <span className="block text-white/30 mt-1">Landmark: {business.address.landmark}</span>
                  </dd>
                </div>
                {business.hours.showHours && (
                  <div>
                    <dt className="text-white/80 text-base mb-1">Opening hours</dt>
                    <dd>
                      {business.hours.weekdays}: {business.hours.weekdayTime}
                      <span className="block">
                        {business.hours.sunday}: {business.hours.sundayTime}
                      </span>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-white/80 text-base mb-1">Ordering</dt>
                  <dd>{business.hours.note}</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-white/5 border border-white/10 p-6 md:p-8">
                <div className="relative aspect-video overflow-hidden mb-6">
                  <img src={media.shopDisplay} alt="Duchess Hairline store display" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <p className="label-text text-white/50 mb-2">{business.address.city}</p>
                    <p className="font-display text-xl text-white">{business.address.street}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <a href={directionsLink()} target="_blank" rel="noopener noreferrer" className="btn-white w-full">
                    Get Directions
                  </a>
                  <a href={generalEnquiryLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 text-center">
          <Reveal>
            <h2 className="editorial-heading text-deep-black mb-6">YOUR NEXT SIGNATURE LOOK STARTS HERE.</h2>
            <p className="text-sm text-charcoal/60 max-w-md mx-auto mb-8 leading-relaxed">
              Browse the collection, pick a style, and send one message to order.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to={routes.collection} className="btn-primary">
                View Collection
              </Link>
              <a href={generalEnquiryLink()} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Order on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
