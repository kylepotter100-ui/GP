/**
 * The 12 service pages. `label` is the navigation label (Title Case per decision D6).
 * Order matches the live Services dropdown.
 */
export type ServiceGroup = 'extensions' | 'conversions' | 'kitchens' | 'carpentry';

export interface Service {
  slug: string;
  label: string;
  group: ServiceGroup;
  /** Photo used for this service in indexes and as its page hero. */
  photo: string;
}

export const services: Service[] = [
  { slug: 'carpentry-services', label: 'Carpentry Services', group: 'carpentry', photo: 'oak-staircase' },
  { slug: 'local-carpenter', label: 'Local Carpenter', group: 'carpentry', photo: 'library-after' },
  { slug: 'house-extensions', label: 'House Extensions', group: 'extensions', photo: 'rear-extension-after' },
  { slug: 'garage-conversions', label: 'Garage Conversions', group: 'conversions', photo: 'garage-conversion-after' },
  { slug: 'media-walls', label: 'Media Walls', group: 'carpentry', photo: 'media-wall-sage-green' },
  { slug: 'kitchen-fitting', label: 'Kitchen Fitting', group: 'kitchens', photo: 'kitchen-island-sink-lantern' },
  { slug: 'kitchen-spraying', label: 'Kitchen Spraying', group: 'kitchens', photo: 'kitchen-shaker-sage-belfast' },
  { slug: 'single-storey-extensions', label: 'Single Storey Extensions', group: 'extensions', photo: 'single-storey-extension-patio' },
  { slug: 'double-storey-extensions', label: 'Double Storey Extensions', group: 'extensions', photo: 'two-storey-extension-rendered-rear' },
  { slug: 'wrap-around-extensions', label: 'Wrap Around Extensions', group: 'extensions', photo: 'extension-lantern-and-glazing' },
  { slug: 'timber-framed-extensions', label: 'Timber Framed Extensions', group: 'extensions', photo: 'vaulted-timber-roof' },
  { slug: 'extension-builder', label: 'Extension Builder', group: 'extensions', photo: 'rear-extension-steel-frame' },
];

export const groups: { id: ServiceGroup; label: string }[] = [
  { id: 'extensions', label: 'Extensions' },
  { id: 'conversions', label: 'Conversions' },
  { id: 'kitchens', label: 'Kitchens' },
  { id: 'carpentry', label: 'Carpentry and joinery' },
];

export const towns = [
  { slug: 'ely', label: 'Ely' },
  { slug: 'newmarket', label: 'Newmarket' },
  { slug: 'bury-st-edmunds', label: 'Bury St Edmunds' },
  { slug: 'cambridge', label: 'Cambridge' },
];

/** Before/after pairs taken from the same viewpoint. */
export const beforeAfter = [
  { id: 'rear-extension', label: 'Rear extension', before: 'rear-extension-before', after: 'rear-extension-after' },
  { id: 'garage-conversion', label: 'Garage conversion', before: 'garage-conversion-before', after: 'garage-conversion-after' },
  { id: 'outdoor-kitchen', label: 'Outdoor kitchen', before: 'outdoor-kitchen-before', after: 'outdoor-kitchen-after' },
  { id: 'media-wall', label: 'Media wall', before: 'media-wall-before', after: 'media-wall-after' },
  { id: 'library', label: 'Bespoke library', before: 'library-before', after: 'library-after' },
];

/** Gallery filters, in the live site's order. */
export const galleryFilters = [
  { id: 'extensions', label: 'Extensions' },
  { id: 'media-walls', label: 'Media walls' },
  { id: 'garage-conversions', label: 'Garage conversions' },
  { id: 'kitchen-installs', label: 'Kitchen installs' },
  { id: 'bespoke-carpentry', label: 'Bespoke carpentry' },
  { id: 'double-storey', label: 'Double Storey Extensions' },
  { id: 'single-storey', label: 'Single Storey Extensions' },
  { id: 'timber-framed', label: 'Timber Framed Extensions' },
  { id: 'extension-builder', label: 'Extension Builder' },
];
