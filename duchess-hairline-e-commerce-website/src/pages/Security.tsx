import { business } from '../config/business';
import LegalPage from '../components/LegalPage';

export default function Security() {
  return (
    <LegalPage
      title="Security"
      metaDescription="How Duchess Hairline keeps ordering safe, and how to recognise fake accounts pretending to be us."
      intro={`How ordering from ${business.name} is kept safe, and how to check that you are really dealing with us.`}
      sections={[
        {
          heading: 'No payments are taken on this website',
          body: (
            <p>
              There is no cart, no card form and no payment gateway here. If any page claiming to be {business.name}{' '}
              asks you to enter card details online, it is not us. Close it and contact us on our published number.
            </p>
          ),
        },
        {
          heading: 'Our official contact channels',
          body: (
            <>
              <p>We only use the following:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>WhatsApp and calls on {business.phone.international}</li>
                <li>TikTok: {business.social.tiktok.handle}</li>
                <li>Our store at {business.address.full}</li>
              </ul>
              <p>
                Any other number, page or account using our name is not connected to us. If you are unsure, call the
                number above and ask before sending anything.
              </p>
            </>
          ),
        },
        {
          heading: 'Confirm before you pay',
          body: (
            <p>
              Always confirm the item, the total and the payment arrangement in your WhatsApp conversation with us
              before transferring money. Keep those messages until your order is complete.
            </p>
          ),
        },
        {
          heading: 'Warning signs of a scam',
          body: (
            <>
              <p>Be cautious if someone claiming to be us:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>contacts you from a number you have not seen on this website</li>
                <li>pressures you to pay immediately for a "last piece"</li>
                <li>asks for your bank password, card PIN or a one time code</li>
                <li>offers a price far below anything we have quoted you</li>
              </ul>
              <p>We will never ask for a PIN, password or verification code. Nobody legitimate ever will.</p>
            </>
          ),
        },
        {
          heading: 'Protecting your own account',
          body: (
            <p>
              Turn on two step verification in WhatsApp and keep your phone locked. Most account takeovers happen
              because a verification code was shared, not because a business was breached.
            </p>
          ),
        },
        {
          heading: 'How this website is served',
          body: (
            <p>
              The site is served over an encrypted HTTPS connection and stores nothing about you in your browser. There
              is no customer database behind this website, because ordering happens entirely through WhatsApp.
            </p>
          ),
        },
        {
          heading: 'Reporting a problem',
          body: (
            <p>
              If you find an account impersonating {business.name}, or you notice a security issue with this website,
              please tell us on WhatsApp at {business.phone.international}. We would rather hear about it early.
            </p>
          ),
        },
      ]}
    />
  );
}
