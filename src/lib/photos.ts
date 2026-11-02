import type { ImageMetadata } from 'astro';
import { photoMeta, type PhotoMeta } from '../data/photo-meta';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });

const byId = new Map<string, PhotoMeta & { image: ImageMetadata }>();
for (const meta of photoMeta) {
  const mod = files[`../assets/photos/${meta.id}.jpg`];
  if (!mod) throw new Error(`Photo file missing for ${meta.id}`);
  byId.set(meta.id, { ...meta, image: mod.default });
}

export function photo(id: string) {
  const p = byId.get(id);
  if (!p) throw new Error(`Unknown photo id: ${id}`);
  return p;
}

const norm = (name: string) => name.replace(/-\d+x\d+(?=\.)/, '').replace(/-e\d{6,}(?=\.)/, '').replace(/-1(?=\.jpe?g$)/, '');
const bySource = new Map(photoMeta.map((p) => [norm(p.source), p.id]));

/**
 * Old WordPress image filenames that are not plain copies of a gallery photo.
 * The six Copilot renders and the stock photo are replaced with real work (decision D16).
 */
const replacements: Record<string, string> = {
  'Copilot_20260906_1318241.jpg': 'extension-lantern-and-glazing',
  'Copilot_20260906_1312371.jpg': 'rear-extension-after',
  'Copilot_20260906_1314201.jpg': 'kitchen-extension-lanterns',
  'Copilot_20260906_1316211.jpg': 'extension-dining-room',
  'Copilot_20260906_1325191.jpg': 'rear-extension-steel-frame-house',
  'Copilot_20260906_1323191.jpg': 'extension-screed-and-glazing',
  'wooden-framing-of-a-house-under-construction-2026-03-10-02-03-12-utc-scaled.jpg': 'extension-roof-frame-scaffold',
  'IMG-20250805-WA0026.jpg': 'oak-truss-assembly',
  'IMG-20250805-WA0023.jpg': 'covered-structure-vaulted-ceiling',
  'Wall-panelling.jpg': 'wall-panelling-green',
  'WhatsApp-Image-2025-09-05-at-21.14.29_30783acc.jpg': 'extension-room-roof-lantern',
  'WhatsApp-Image-2025-09-05-at-21.14.30_9d14608c.jpg': 'bathroom-dark-roll-top-bath',
  'WhatsApp-Image-2025-09-08-at-20.11.11_1e91d842-1.jpg': 'hallway-oak-doors-flooring',
  'WhatsApp-Image-2025-09-09-at-11.04.43_8891c644-e1757419338606.jpg': 'kitchen-navy-island-extractor',
};

/** Map an image filename from the old site to a photo id in the new library. */
export function fromLegacy(src: string): string {
  if (replacements[src]) return replacements[src];
  const id = bySource.get(norm(src));
  if (!id) throw new Error(`No photo mapped for legacy image ${src}`);
  return id;
}

export function photosTagged(tag: string, exclude: string[] = [], limit = 10) {
  return photoMeta.filter((p) => p.tags.includes(tag) && !exclude.includes(p.id)).slice(0, limit).map((p) => p.id);
}

export const allPhotos = photoMeta;
