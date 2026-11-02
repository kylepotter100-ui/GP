/**
 * Which real photos each page shows: the hero, and the swipeable "Project photos" row.
 * Captions never claim a location: photos show the work, not the town.
 */
export interface PagePhotos {
  hero?: string;
  /** Gallery tag(s) to draw the swipe row from. */
  rowTags?: string[];
  /** Explicit row photos (used instead of tags when set). */
  row?: string[];
}

export const pagePhotos: Record<string, PagePhotos> = {
  'carpentry-services': { hero: 'oak-staircase', rowTags: ['bespoke-carpentry'] },
  'local-carpenter': { hero: 'library-after', rowTags: ['bespoke-carpentry'] },
  'house-extensions': { hero: 'rear-extension-after', rowTags: ['extensions'] },
  'garage-conversions': { hero: 'garage-conversion-after', rowTags: ['garage-conversions'] },
  'media-walls': { hero: 'media-wall-sage-green', rowTags: ['media-walls'] },
  'kitchen-fitting': { hero: 'kitchen-island-sink-lantern', rowTags: ['kitchen-installs'] },
  'kitchen-spraying': { hero: 'kitchen-shaker-sage-belfast', rowTags: ['kitchen-installs'] },
  'single-storey-extensions': { hero: 'single-storey-extension-patio', rowTags: ['single-storey'] },
  'double-storey-extensions': { hero: 'two-storey-extension-rendered-rear', rowTags: ['double-storey'] },
  'wrap-around-extensions': {
    hero: 'extension-lantern-and-glazing',
    row: ['rear-extension-steel-frame', 'rear-extension-under-construction', 'extension-floor-beams', 'flat-roof-joists-beside-house', 'roof-lantern-upstands', 'extension-screed-and-glazing', 'kitchen-extension-lanterns', 'extension-dining-room', 'rear-extension-after'],
  },
  'timber-framed-extensions': { hero: 'vaulted-timber-roof', row: ['timber-frame-long-room', 'extension-roof-frame-scaffold', 'roof-trusses-in-scaffold', 'oak-truss-assembly', 'carpenter-checking-trusses', 'timber-garage-stud-walls', 'bungalow-extension-roof-trusses', 'round-garden-building-frame'] },
  'extension-builder': { hero: 'rear-extension-steel-frame', rowTags: ['extension-builder'] },
  'areas-we-cover': { hero: 'clad-garage-beside-house', row: ['rear-extension-after', 'garage-conversion-after', 'kitchen-extension-lanterns', 'media-wall-sage-green', 'outdoor-kitchen-after', 'bungalow-extension-finished', 'library-after', 'two-storey-extension-rendered-rear'] },
  'area--ely': { hero: 'kitchen-extension-lanterns', row: ['rear-extension-after', 'bungalow-extension-finished', 'garage-conversion-after', 'media-wall-after', 'kitchen-shaker-sage-belfast', 'single-storey-extension-patio', 'vaulted-timber-roof', 'two-storey-extension-rendered-front'] },
  'area--newmarket': { hero: 'garage-conversion-after', row: ['kitchen-navy-island', 'media-wall-sage-green', 'single-storey-extension-pergola', 'rear-extension-steel-frame', 'outdoor-kitchen-after', 'bungalow-extension-sliding-doors', 'glazed-gable-above-steelwork', 'library-after'] },
  'area--bury-st-edmunds': { hero: 'outdoor-kitchen-after', row: ['bungalow-extension-finished', 'kitchen-curved-island-table', 'media-wall-built-in-cupboards', 'garage-conversion-room', 'two-storey-extension-rendered-rear', 'oak-staircase', 'timber-frame-long-room', 'parquet-flooring-herringbone'] },
  'area--cambridge': { hero: 'two-storey-extension-rendered-rear', row: ['rear-extension-after', 'kitchen-extension-lanterns', 'house-double-garage-dormers', 'media-wall-after', 'garage-conversion-after', 'single-storey-extension-french-doors', 'kitchen-cream-slatted-oak', 'library-after'] },
  gallery: { hero: 'kitchen-curved-island-lantern' },
  testimonials: { hero: 'media-wall-after' },
  'contact-us': { hero: 'bungalow-extension-finished' },
};
