import { Link } from 'react-router-dom';
import { routes } from '../config/business';

export default function InquiryPrompt() {
  return (
    <section className="py-12 md:py-16 bg-cream/30">
      <div className="mx-auto max-w-[1000px] px-4 md:px-8">
        <div className="rounded-[28px] bg-deep-black p-7 md:p-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-7">
          <div className="max-w-xl">
            <p className="label-text text-white/40 mb-3">Client inquiry</p>
            <h2 className="font-display text-3xl md:text-4xl font-light">Have a specific request?</h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Tell Duchess Hairline what you are looking for, your preferred style and how we can help. Your request is linked to your account so the business knows who sent it.
            </p>
          </div>
          <Link to="/request" className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-medium text-deep-black hover:opacity-90">
            Make a Client Inquiry →
          </Link>
        </div>
      </div>
    </section>
  );
}
