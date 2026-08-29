/** Single source of truth for Duchess Hairline business information. */
export const business = {
  name: 'Duchess Hairline',
  tagline: 'Premium wigs & hair in Port Harcourt.',
  phone: { display: '0814 971 4846', international: '+234 814 971 4846', raw: '2348149714846' },
  address: { street: 'No. 4 Ebara Road, Orazi', city: 'Port Harcourt', region: 'Rivers State', country: 'Nigeria', landmark: 'Immediately after Market Junction', get full() { return `${this.street}, ${this.city}, ${this.region}, ${this.country}`; } },
  social: { tiktok: { handle: '@duchess_hairline', url: 'https://www.tiktok.com/@duchess_hairline', followers: '40K+', likes: '1.1M+' } },
  hours: { showHours: false, weekdays: '', weekdayTime: '', sunday: '', sundayTime: '', note: '' },
  legal: { entityName: 'Duchess Hairline', lastUpdated: 'February 2026', contactMethod: 'WhatsApp' },
} as const;

export const routes = {
  home: '/', collection: '/collection', product: (id: string) => `/product/${id}`, about: '/about', reviews: '/reviews', contact: '/contact', terms: '/terms', privacy: '/privacy', security: '/security',
} as const;
