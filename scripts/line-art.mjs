// Builds "the plan" line drawings from real project photos (docs/redesign/journey/01-plan.md).
// Edge strength becomes light lines on black; the page lays them over the photo with a screen
// blend (black drops out), which keeps the files small. Writes greyscale WebP.
// No illustration and no AI imagery: every line comes from the photograph itself.
// Usage: node scripts/line-art.mjs   (writes src/assets/lines/<photo-id>.webp)
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const IDS = [
  // After photos of the before/after pairs (Transformation scenes).
  'rear-extension-after', 'garage-conversion-after', 'outdoor-kitchen-after', 'media-wall-after', 'library-after',
  // Process stages on the home page.
  'carpenter-checking-trusses', 'extension-floor-beams', 'rear-extension-steel-frame', 'extension-living-room-finished',
];
const WIDTH = 1000;
mkdirSync('src/assets/lines', { recursive: true });

for (const id of IDS) {
  const { data, info } = await sharp(`src/assets/photos/${id}.jpg`)
    .rotate()
    .resize({ width: WIDTH, withoutEnlargement: true })
    .greyscale()
    .blur(1.4)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const g = (x, y) => data[y * w + x] / 255;
  const mag = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const gx = g(x + 1, y) - g(x - 1, y);
      const gy = g(x, y + 1) - g(x, y - 1);
      mag[y * w + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  // Normalise to the 99.2nd percentile, then drop texture noise and keep structure.
  const sorted = Float32Array.from(mag).sort();
  const p = sorted[Math.floor(sorted.length * 0.992)] || 1;
  const out = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    const m = Math.min(1, mag[i] / p);
    out[i] = Math.round(Math.pow(Math.max(0, Math.min(1, (m - 0.18) / 0.6)), 0.85) * 238);
  }
  await sharp(out, { raw: { width: w, height: h, channels: 1 } }).webp({ quality: 50 }).toFile(`src/assets/lines/${id}.webp`);
  console.log(`lines: ${id} (${w}×${h})`);
}
