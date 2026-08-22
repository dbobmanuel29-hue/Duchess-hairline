import { generalEnquiryLink } from '../lib/whatsapp';
import WhatsAppIcon from './icons/WhatsAppIcon';

/**
 * Floating chat shortcut. On phones it sits above the sticky bottom bar so it
 * never covers product actions.
 */
export default function WhatsAppButton() {
  return (
    <a
      href={generalEnquiryLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-40 flex items-center justify-center rounded-full bg-[#1f8f4d] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#18703d]
        bottom-20 right-4 w-12 h-12
        md:bottom-8 md:right-8 md:w-14 md:h-14"
      aria-label="Chat with Duchess Hairline on WhatsApp"
    >
      <WhatsAppIcon size={24} />
    </a>
  );
}
