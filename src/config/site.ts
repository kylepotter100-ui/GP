/**
 * Single source of truth for business details.
 *
 * Everything here feeds the page <head> (title, description, Open Graph),
 * the LocalBusiness structured data (JSON-LD), sitemap.xml and robots.txt.
 *
 * For local SEO, the name, address and phone (NAP) MUST match the
 * Google Business Profile exactly, character for character.
 *
 * TODO: replace every placeholder below with the real business details.
 */

export interface OpeningHours {
  /** Schema.org day names, e.g. ['Monday', 'Tuesday'] */
  days: string[];
  /** 24h "HH:MM" */
  opens: string;
  closes: string;
}

export const site = {
  /** Production URL, no trailing slash. */
  url: 'https://www.example.com',
  name: 'Business Name',
  /** Default <title> suffix and og:site_name. */
  titleTemplate: '%s | Business Name',
  description: 'One or two sentences describing what the business does and where it does it.',
  locale: 'en_GB',
  lang: 'en-GB',

  /** schema.org type. Pick the most specific match, e.g. 'Plumber', 'Dentist', 'Restaurant'. */
  businessType: 'LocalBusiness',

  phone: '+44 0000 000000',
  email: 'hello@example.com',
  address: {
    streetAddress: '1 Example Street',
    addressLocality: 'Town',
    addressRegion: 'County',
    postalCode: 'AB1 2CD',
    addressCountry: 'GB',
  },
  /** Optional. Copy from the Google Business Profile map pin. */
  geo: undefined as { latitude: number; longitude: number } | undefined,
  /** Areas served, for service-area businesses. */
  areaServed: [] as string[],
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' },
  ] as OpeningHours[],

  /**
   * Profiles that represent the same business. Include the Google Business
   * Profile / Maps share link once it exists, plus social profiles.
   */
  sameAs: [] as string[],
  /** Google Maps link for "Get directions" (from the Business Profile). */
  googleMapsUrl: '',

  /** Default social share image, path under /public, e.g. '/og-default.jpg'. 1200x630 recommended. */
  ogImage: undefined as string | undefined,
};

export type Site = typeof site;
