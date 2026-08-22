import { business } from '../config/business';
import LegalPage from '../components/LegalPage';

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      metaDescription="Terms and conditions for using the Duchess Hairline website and ordering wigs through WhatsApp."
      intro={`These terms cover how you use the ${business.name} website and how orders placed with us through WhatsApp work.`}
      sections={[
        {
          heading: 'About these terms',
          body: (
            <>
              <p>
                By browsing this website you agree to the terms set out on this page. If you do not agree with them,
                please do not use the site.
              </p>
              <p>
                {business.name} is a wig and hair business operating from {business.address.full}. We may update these
                terms as the business changes; the date at the top of this page shows the latest revision.
              </p>
            </>
          ),
        },
        {
          heading: 'Products and descriptions',
          body: (
            <>
              <p>
                We describe every wig as accurately as we can. Photographs are intended to show the style honestly, but
                colour and texture can appear different depending on your screen and lighting.
              </p>
              <p>
                Where a specification such as length, density or lace type is not listed, it means we have not confirmed
                it for that item. Ask us on WhatsApp and we will tell you what we know rather than guess.
              </p>
            </>
          ),
        },
        {
          heading: 'Prices',
          body: (
            <>
              <p>
                This website does not process payments and does not display a fixed price for every item. Where a wig
                shows “price on request”, the current price is confirmed on WhatsApp before you commit to anything.
              </p>
              <p>
                Any price quoted in a conversation applies to that conversation and that item. Prices can change with
                stock and availability.
              </p>
            </>
          ),
        },
        {
          heading: 'Placing an order',
          body: (
            <>
              <p>
                Orders are placed by messaging us on WhatsApp at {business.phone.display}. Selecting “Order on WhatsApp”
                on this site only opens a message — it does not reserve stock or create an order.
              </p>
              <p>
                An order exists once we have confirmed the item, the price and the arrangement for collection or
                delivery with you directly.
              </p>
            </>
          ),
        },
        {
          heading: 'Availability',
          body: (
            <p>
              Stock changes regularly and an item marked available on the site may sell before your message reaches us.
              We will always tell you promptly if something is no longer in stock and suggest alternatives if you want
              them.
            </p>
          ),
        },
        {
          heading: 'Payment, collection and delivery',
          body: (
            <p>
              Payment methods, collection and delivery arrangements are agreed individually over WhatsApp. Nothing is
              charged through this website. Please make sure you are comfortable with the arrangement before sending any
              payment.
            </p>
          ),
        },
        {
          heading: 'Returns and complaints',
          body: (
            <p>
              If there is a problem with an item you have received, contact us on WhatsApp as soon as possible with your
              order details and clear photographs. We handle each case individually and will explain what we can offer.
            </p>
          ),
        },
        {
          heading: 'Use of this website',
          body: (
            <p>
              You may browse and share this website freely. You may not copy our photographs, product text or branding
              for commercial use without written permission from {business.name}.
            </p>
          ),
        },
        {
          heading: 'Links to other services',
          body: (
            <p>
              This site links to WhatsApp, TikTok and Google Maps. Those services are run by other companies under their
              own terms and privacy policies, and we are not responsible for how they operate.
            </p>
          ),
        },
        {
          heading: 'Contact',
          body: (
            <p>
              Questions about these terms can be sent to {business.name} on WhatsApp at {business.phone.international},
              or raised in person at {business.address.full}.
            </p>
          ),
        },
      ]}
    />
  );
}
