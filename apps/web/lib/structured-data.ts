export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'كرفاني',
    alternateName: 'Karfani',
    url: 'https://karfani.sa',
    logo: 'https://karfani.sa/icon-512.png',
    description: 'المنصة الأولى لتأجير الكرفانات في السعودية',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SA',
      addressRegion: 'Riyadh',
    },
    sameAs: [],
  };
}

export function caravanJsonLd(caravan: {
  title: string;
  description: string;
  price: number;
  rating?: number;
  reviews?: number;
  image?: string;
  location?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: caravan.title,
    description: caravan.description,
    image: caravan.image,
    offers: {
      '@type': 'Offer',
      price: caravan.price,
      priceCurrency: 'SAR',
      availability: 'https://schema.org/InStock',
    },
    ...(caravan.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: caravan.rating,
        reviewCount: caravan.reviews || 0,
        bestRating: 5,
      },
    }),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'كرفاني',
    alternateName: 'Karfani',
    url: 'https://karfani.sa',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://karfani.sa/ar/caravans?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
