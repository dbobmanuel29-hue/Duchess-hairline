/**
 * Single source of truth for business information.
 *
 * Anything the shop owner may need to change lives here so that copy edits
 * never require touching component code.
 *
 * NOTE: values marked PLACEHOLDER have not been verified with the business
 * owner yet. Confirm them before launch.
 */

export const business = {
  name: 'Duchess Hairline',
  tagline: 'Premium wigs & hair in Port Harcourt.',

  phone: {
    /** Local format, used for display only. */
    display: '0814 971 4846',
    /** International format, used for display only. */
    international: '+234 814 971 4846',
    /** Digits only, used to build wa.me and tel: links. */
    raw: '2348149714846',
  },

  address: {
    street: 'No. 4 Ebara Road, Orazi',
    city: 'Port Harcourt',
    region: 'Rivers State',
    country: 'Nigeria',
    landmark: 'Immediately after Market Junction',
    get full() {
      return `${this.street}, ${this.city}, ${this.region}, ${this.country}`;
    },
  },

  social: {
    tiktok: {
      handle: '@duchess_hairline',
      url: 'https://www.tiktok.com/@duchess_hairline',
      followers: '40K+',
      likes: '1.1M+',
    },
  },

  /**
   * PLACEHOLDER — opening hours have not been confirmed.
   * Update these before publishing, or set `showHours` to false to hide them.
   */
  hours: {
    showHours: true,
    weekdays: 'Monday — Saturday',
    weekdayTime: '9:00 AM — 6:00 PM',
    sunday: 'Sunday',
    sundayTime: 'By appointment',
    note: 'WhatsApp messages are received at any time and answered during opening hours.',
  },

  legal: {
    /** Used in the copyright line and legal pages. */
    entityName: 'Duchess Hairline',
    lastUpdated: 'February 2026',
    /** PLACEHOLDER — add a real support inbox if one exists. */
    contactMethod: 'WhatsApp',
  },
} as const;

export const routes = {
  home: '/',
  collection: '/collection',
  product: (id: string) => `/product/${id}`,
  about: '/about',
  reviews: '/reviews',
  contact: '/contact',
  terms: '/terms',
  privacy: '/privacy',
  security: '/security',
} as const;
