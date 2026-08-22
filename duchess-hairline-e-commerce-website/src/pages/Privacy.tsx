import { business } from '../config/business';
import LegalPage from '../components/LegalPage';

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      metaDescription="How Duchess Hairline handles personal information shared through the website, WhatsApp and in store."
      intro={`This policy explains what personal information ${business.name} receives, why we hold it, and what you can ask us to do with it.`}
      sections={[
        {
          heading: 'The short version',
          body: (
            <p>
              This website has no accounts, no login and no checkout. We do not ask you to type personal details into
              any form here. The information we hold comes from the conversation you start with us on WhatsApp or in
              person.
            </p>
          ),
        },
        {
          heading: 'Information we receive',
          body: (
            <>
              <p>When you contact us to ask about or order a wig, we typically receive:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>your WhatsApp display name and phone number</li>
                <li>the messages you send us, including any photographs you choose to share</li>
                <li>delivery or collection details you give us for a specific order</li>
              </ul>
              <p>We do not collect card details, bank credentials or identity documents through this website.</p>
            </>
          ),
        },
        {
          heading: 'How we use it',
          body: (
            <>
              <p>We use what you send us only to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>answer your question and confirm availability and price</li>
                <li>arrange collection or delivery of an order</li>
                <li>follow up about that order if something changes</li>
              </ul>
              <p>We do not sell, rent or trade your information to anyone.</p>
            </>
          ),
        },
        {
          heading: 'Photographs and customer looks',
          body: (
            <p>
              We only publish a customer photograph, name or review after asking that customer and receiving a clear
              yes. If you have agreed before and change your mind, message us and we will remove it.
            </p>
          ),
        },
        {
          heading: 'Services we rely on',
          body: (
            <p>
              Conversations happen on WhatsApp, our social presence is on TikTok, and directions open in Google Maps.
              Each of those services collects data under its own privacy policy, which we do not control. Please read
              their policies if that matters to you.
            </p>
          ),
        },
        {
          heading: 'Website analytics',
          body: (
            <p>
              This website does not set advertising cookies and does not track you across other sites. If basic
              visitor analytics are added later, this section will be updated to say exactly what is measured.
            </p>
          ),
        },
        {
          heading: 'How long we keep it',
          body: (
            <p>
              Order conversations are kept while they are useful for servicing that order and answering follow up
              questions. You can ask us to delete your conversation history with us at any time.
            </p>
          ),
        },
        {
          heading: 'Your choices',
          body: (
            <p>
              You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Send the
              request from the WhatsApp number you contacted us on so we can be sure it is you.
            </p>
          ),
        },
        {
          heading: 'Children',
          body: (
            <p>
              This website is intended for adults. We do not knowingly collect information from children. If a parent
              or guardian believes we hold a child's details, contact us and we will remove them.
            </p>
          ),
        },
        {
          heading: 'Contact',
          body: (
            <p>
              For any privacy question, message {business.name} on WhatsApp at {business.phone.international} or visit
              us at {business.address.full}.
            </p>
          ),
        },
      ]}
    />
  );
}
