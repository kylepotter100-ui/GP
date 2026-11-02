/**
 * Splits a protected H1 into ordered segments: one large Cinzel display segment, quieter
 * Open Sans segments, and visually hidden separators. Joining the segments' text gives back
 * the H1 exactly, so its text content is unchanged (decision C4).
 *
 * Town pages show the town as the display line; service pages show the service.
 */
export type Role = 'display' | 'quiet' | 'hidden';
export interface Segment { text: string; role: Role }
export interface H1Split { segments: Segment[]; size: 'xl' | 'l' | 'm' }

const TOWNS = ['Bury St Edmunds', 'Newmarket', 'Cambridge', 'Ely'];
const sizeFor = (s: string): H1Split['size'] => (s.length <= 16 ? 'xl' : s.length <= 26 ? 'l' : 'm');
const out = (segments: Segment[]): H1Split => ({
  segments: segments.filter((s) => s.text),
  size: sizeFor(segments.find((s) => s.role === 'display')!.text),
});

export function splitH1(raw: string): H1Split {
  const h = raw.replace(/&amp;/g, '&');
  // "<service> | <town>": the town leads.
  const pipe = h.indexOf(' | ');
  if (pipe > 0 && TOWNS.includes(h.slice(pipe + 3))) {
    return out([{ text: h.slice(0, pipe), role: 'quiet' }, { text: ' | ', role: 'hidden' }, { text: h.slice(pipe + 3), role: 'display' }]);
  }
  // "... in <Town>": the town leads.
  for (const t of TOWNS) {
    if (h.endsWith(` in ${t}`)) return out([{ text: h.slice(0, -t.length), role: 'quiet' }, { text: t, role: 'display' }]);
  }
  // "<service> in <places>": the service leads.
  const inAt = h.indexOf(' in ');
  if (inAt > 0) return out([{ text: h.slice(0, inAt), role: 'display' }, { text: ' ', role: 'hidden' }, { text: h.slice(inAt + 1), role: 'quiet' }]);
  // "<display> | <rest>", "<display> - <rest>": the separator is hidden.
  for (const sep of [' | ', ' - ']) {
    const i = h.indexOf(sep);
    if (i > 0) return out([{ text: h.slice(0, i), role: 'display' }, { text: sep, role: 'hidden' }, { text: h.slice(i + sep.length), role: 'quiet' }]);
  }
  // "<display>: <rest>", "<display> Across <rest>", "Contact <rest>".
  const colon = h.indexOf(': ');
  if (colon > 0) return out([{ text: h.slice(0, colon + 1), role: 'display' }, { text: ' ', role: 'hidden' }, { text: h.slice(colon + 2), role: 'quiet' }]);
  const m = h.match(/^(.+?) (Across .+)$/) ?? h.match(/^(Contact) (.+)$/);
  if (m) return out([{ text: m[1], role: 'display' }, { text: ' ', role: 'hidden' }, { text: m[2], role: 'quiet' }]);
  return out([{ text: h, role: 'display' }]);
}
