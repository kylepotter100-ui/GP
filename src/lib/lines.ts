import type { ImageMetadata } from 'astro';

/** "The plan" line drawings, made from real photos by scripts/line-art.mjs. Keyed by photo id. */
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/lines/*.webp', { eager: true });

export function lines(id: string): ImageMetadata | undefined {
  return files[`../assets/lines/${id}.webp`]?.default;
}
