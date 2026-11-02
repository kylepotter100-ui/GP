/**
 * Single source of truth for business details.
 *
 * The name, phone and email must stay character-for-character identical to the
 * live site and the Google Business Profile. Opening hours, street address and
 * the Business Profile link are filled in during the SEO phase.
 */

export const site = {
  url: 'https://www.garyjpottercarpentry.co.uk',
  name: 'Gary J Potter Carpentry & Construction',
  tagline: 'Crafted with care, built to last',
  locale: 'en_GB',
  lang: 'en-GB',

  /** schema.org type: the most specific match for extensions, conversions and joinery. */
  businessType: 'GeneralContractor',
  description:
    'Gary J Potter Carpentry & Construction experts in house extensions, kitchens, garage conversions & media walls across Ely, Newmarket, Bury St Edmunds & Cambridge.',
  foundingYear: 2013,

  phone: {
    display: '07415 216223',
    tel: '+447415216223',
  },
  email: 'info@garyjpottercarpentry.co.uk',
  whatsapp: {
    number: '447415216223',
    href: 'https://wa.me/447415216223',
  },

  areaServed: ['Ely', 'Newmarket', 'Bury St Edmunds', 'Cambridge', 'Cambridgeshire', 'Suffolk'],

  /** Map embed kept from the live footer "Find us" block. */
  mapQuery: '32 Acorn Way, Red Lodge, Bury Saint Edmunds IP28 8FY, UK',

  sameAs: ['https://www.facebook.com/garyjpottercarpentry', 'https://www.instagram.com/garyjpottercarpentry/'],
  social: {
    facebook: 'https://www.facebook.com/garyjpottercarpentry',
    instagram: 'https://www.instagram.com/garyjpottercarpentry/',
  },

  /** TODO (SEO phase): the Google Business Profile share link. Empty hides the link. */
  googleProfileUrl: '',

  reviews: {
    rating: '5.0',
    count: 26,
    /** Figure as shown by the Google widget on the live site, 2 November 2026. */
    asOf: 'November 2026',
  },

  analytics: {
    ga4: 'G-48FGMN8RL6',
    clarity: 't94csadv31',
  },

  /** Cloudflare Turnstile site key (public). TODO before launch: replace the test key. */
  turnstileSiteKey: '1x00000000000000000000AA',
};

export type Site = typeof site;
