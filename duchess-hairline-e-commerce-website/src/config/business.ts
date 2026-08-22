export const business = {
  name: 'Duchess Hairline',
  tagline: 'Premium wigs & hair in Port Harcourt.',
  phone: '08149714846',
  whatsapp: '2348149714846',
  tiktokHandle: '@duchess_hairline',
  tiktokFollowers: '40K+',
  tiktokLikes: '1.1M+',
  address: 'No. 4 Ebara Road, Orazi, Port Harcourt, Rivers State, Nigeria',
  landmark: 'Immediately after Market Junction',
  city: 'Port Harcourt',
  state: 'Rivers State',
  country: 'Nigeria',
} as const;

export const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: business.name,
  telephone: business.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No. 4 Ebara Road, Orazi',
    addressLocality: business.city,
    addressRegion: business.state,
    addressCountry: 'NG',
  },
  sameAs: [],
} as const;
