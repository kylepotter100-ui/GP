/*
 * Stage colour: the page ground, header and footer take the colour of where the visitor is.
 * Sections marked data-stage="<hue>" are deep stage palettes (src/styles/global.css). Above the
 * first of them the page is in its day theme; from the first one down it is "lights down".
 *
 * - With motion, the colour morphs smoothly between stages as each one arrives (driven by a
 *   ScrollTrigger in motion.ts, never a scroll listener).
 * - With reduced motion, it changes in one step as a stage crosses the upper third of the screen.
 */

const TOKENS = ['ground', 'surface', 'surface-2', 'ink', 'muted'] as const;
type Colours = Record<(typeof TOKENS)[number], string> & { line: string; focus: string };

const root = document.documentElement;

function read(el: Element): Colours {
  const cs = getComputedStyle(el);
  const v = (n: string) => cs.getPropertyValue(`--${n}`).trim();
  return { ground: v('ground'), surface: v('surface'), 'surface-2': v('surface-2'), ink: v('ink'), muted: v('muted'), line: v('line'), focus: v('focus') };
}

function apply(c: Colours) {
  root.style.setProperty('--stage-bg', c.ground);
  root.style.setProperty('--stage-surface', c.surface);
  root.style.setProperty('--stage-surface-2', c['surface-2']);
  root.style.setProperty('--stage-ink', c.ink);
  root.style.setProperty('--stage-muted', c.muted);
  root.style.setProperty('--stage-line', c.line);
  root.style.setProperty('--stage-focus', c.focus);
}

const hex = (h: string) => {
  const m = h.replace('#', '');
  const n = m.length === 3 ? m.split('').map((x) => x + x).join('') : m;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
const mix = (a: string, b: string, t: number) => {
  if (!a.startsWith('#') || !b.startsWith('#')) return t < 0.5 ? a : b;
  const [x, y] = [hex(a), hex(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(' ')})`;
};
function blend(a: Colours, b: Colours, t: number): Colours {
  const out = {} as Colours;
  TOKENS.forEach((k) => (out[k] = mix(a[k], b[k], t)));
  out.line = t < 0.5 ? a.line : b.line;
  out.focus = t < 0.5 ? a.focus : b.focus;
  return out;
}

export interface Stage { day: Colours; sections: { el: HTMLElement; colours: Colours }[] }

export function stages(): Stage | null {
  const els = [...document.querySelectorAll<HTMLElement>('[data-stage]')].filter((el) => !el.parentElement?.closest('[data-stage]'));
  if (!els.length) return null;
  els[0].setAttribute('data-stage-lead', '');
  // Day colours come from the root tokens, which the stage script never touches.
  const probe = document.createElement('div');
  probe.style.display = 'none';
  document.documentElement.append(probe);
  const day = read(probe);
  probe.remove();
  return { day, sections: els.map((el) => ({ el, colours: read(el) })) };
}

/** Smooth morph: call with the scroll position whenever the page scrolls (ScrollTrigger onUpdate). */
export function morph(s: Stage) {
  let marks: { start: number; end: number }[] = [];
  const measure = () => {
    const vh = window.innerHeight;
    marks = s.sections.map(({ el }) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      return { start: top - vh * 0.55, end: top - vh * 0.2 };
    });
  };
  const update = (y: number) => {
    let from = s.day, i = -1;
    for (let k = 0; k < marks.length; k++) if (y >= marks[k].start) i = k;
    if (i < 0) { apply(s.day); return; }
    if (i > 0) from = s.sections[i - 1].colours;
    const { start, end } = marks[i];
    const t = Math.min(1, Math.max(0, (y - start) / (end - start)));
    apply(t >= 1 ? s.sections[i].colours : blend(from, s.sections[i].colours, t));
  };
  measure();
  return { measure, update };
}

/** Reduced motion: one step at a time, as a stage crosses the upper third of the screen. */
export function stepped(s: Stage) {
  const seen = new Set<HTMLElement>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? seen.add(e.target as HTMLElement) : seen.delete(e.target as HTMLElement)));
    const current = [...s.sections].reverse().find(({ el }) => seen.has(el) || el.getBoundingClientRect().bottom < 0);
    apply(current ? current.colours : s.day);
  }, { rootMargin: '-33% 0px -66% 0px' });
  s.sections.forEach(({ el }) => io.observe(el));
}
