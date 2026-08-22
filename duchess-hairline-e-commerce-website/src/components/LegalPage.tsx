import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { business, routes } from '../config/business';
import { generalEnquiryLink } from '../lib/whatsapp';
import SeoHead from './SeoHead';

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  intro: string;
  sections: LegalSection[];
  metaDescription: string;
}

/**
 * Shared shell for Terms, Privacy and Security so the three pages stay
 * visually identical and only their content differs.
 */
export default function LegalPage({ title, intro, sections, metaDescription }: LegalPageProps) {
  return (
    <main className="pt-16 md:pt-20 pb-mobile-nav min-h-screen">
      <SeoHead title={`${title} — ${business.name}`} description={metaDescription} />

      <section className="bg-deep-black py-16 md:py-24">
        <div className="max-w-[820px] mx-auto px-4 md:px-8">
          <p className="label-text text-white/40 mb-4">Legal</p>
          <h1 className="font-display text-4xl md:text-6xl text-white font-light leading-[1.02]">{title}</h1>
          <p className="text-sm text-white/50 mt-6 leading-relaxed max-w-xl">{intro}</p>
          <p className="text-xs text-white/30 mt-6">Last updated: {business.legal.lastUpdated}</p>
        </div>
      </section>

      <article className="py-14 md:py-20">
        <div className="max-w-[820px] mx-auto px-4 md:px-8">
          <ol className="space-y-12">
            {sections.map((section, i) => (
              <li key={section.heading} className="grid grid-cols-[auto_1fr] gap-4 md:gap-6">
                <span className="font-display text-2xl md:text-3xl text-beige font-light leading-none pt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="font-display text-xl md:text-2xl text-deep-black font-medium mb-3">
                    {section.heading}
                  </h2>
                  <div className="text-sm text-charcoal/70 leading-[1.85] space-y-3">{section.body}</div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-16 border-t border-beige/40 pt-10">
            <h2 className="font-display text-xl text-deep-black font-medium mb-3">Questions about this page?</h2>
            <p className="text-sm text-charcoal/70 leading-relaxed mb-6">
              Contact {business.name} on WhatsApp at {business.phone.display} or visit us at {business.address.full}.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={generalEnquiryLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                Ask on WhatsApp
              </a>
              <Link to={routes.contact} className="btn-outline">
                Contact Page
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
