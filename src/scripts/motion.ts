/*
 * The motion journey (MOTION_INTENSITY 9, docs/redesign/journey/01-plan.md), loaded only when the
 * visitor has not asked for reduced motion. Everything lives inside gsap.matchMedia, so switching
 * reduced motion on reverts every pin and tween. No scroll listeners: ScrollTrigger only.
 * Pinned scenes per page: at most two (the before/after and the craft window).
 *
 * Time-based moments (shutters, chalk line, letter-by-letter H1) are CSS in global.css, so they
 * never wait for this file.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setBA } from './ba';
import { stages, morph } from './stage';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)] as T[];

/** A label that re-sets itself letter by letter (Before, The plan, After). */
function scramble(el: HTMLElement, text: string) {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const state = { f: 0 };
  gsap.killTweensOf(state);
  gsap.to(state, {
    f: 1, duration: 0.45, ease: 'none',
    onUpdate: () => {
      const k = Math.floor(state.f * text.length);
      el.textContent = [...text].map((c, i) => (c === ' ' || i < k ? c : pool[(Math.random() * 26) | 0])).join('');
    },
    onComplete: () => { el.textContent = text; },
  });
}

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  /* Stage colour: the page ground, header and footer morph into each chapter's hue. */
  const stage = stages();
  if (stage) {
    const m = morph(stage);
    document.documentElement.classList.add('stage-live');
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => m.update(self.scroll()) });
    // Measure only once every pin has its spacing (the global refresh event fires after all of them).
    const remeasure = () => { m.measure(); m.update(window.scrollY); };
    ScrollTrigger.addEventListener('refresh', remeasure);
    requestAnimationFrame(remeasure);
  }

  /* 2 Promise: the line lights up word by word as it is read. */
  $$('[data-words]').forEach((el) => {
    gsap.fromTo($$('.w', el), { opacity: 0.14 }, {
      opacity: 1, ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 40%', scrub: true },
    });
  });
  /* The real figures roll in once, like an odometer (only if they start below the fold). */
  $$('[data-odo]').forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const reels = $$<HTMLElement>('.reel-in', el);
    const digits = reels.map((r) => Number(r.style.getPropertyValue('--n')));
    reels.forEach((r, i) => { r.style.transform = 'none'; gsap.set(r, { yPercent: -digits[i] * 10 }); });
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => reels.forEach((r, i) => gsap.fromTo(r, { yPercent: 0 }, { yPercent: -digits[i] * 10, duration: 1.3 + i * 0.18, ease: 'power3.out', delay: 0.06 * i })),
    });
  });

  /* 3 Transformation: Before, then the plan drawn over it, then After. Pinned and scrubbed. */
  $$('[data-ba-scrub]').forEach((scene) => {
    const fig = scene.querySelector<HTMLElement>('[data-ba]');
    if (!fig) return;
    const plan = fig.querySelector<HTMLElement>('.ba-plan');
    const label = scene.querySelector<HTMLElement>('[data-act-label]');
    const state = { p: 100 };
    let manual = false; // once the visitor drags or uses the keys, scrolling no longer moves the slider
    fig.addEventListener('ba:user', () => {
      manual = true;
      fig.dataset.act = 'after';
      if (plan) gsap.to(plan, { opacity: 0, duration: 0.3 }); // the slider is the visitor's now: the plan steps away
    }, { once: true });
    setBA(fig, 100);

    if (!plan) {
      gsap.to(state, {
        p: 0, ease: 'none', onUpdate: () => { if (!manual) setBA(fig, state.p); },
        scrollTrigger: { trigger: scene, start: 'top top', end: '+=120%', pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
      });
      return;
    }

    fig.classList.add('ba-acts');
    fig.dataset.act = 'before';
    const lines = plan.querySelector('.ba-lines'), dim = plan.querySelector('.ba-dim'), grid = plan.querySelector('.ba-grid'), scan = plan.querySelector('.ba-scan');
    const act = (name: string, text: string) => {
      if (fig.dataset.act === name || manual) return;
      fig.dataset.act = name;
      if (label) scramble(label, text);
    };
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: scene, start: 'top top', end: '+=240%', pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.24) act('before', 'Before'); else if (p < 0.6) act('plan', 'The plan'); else act('after', 'After');
        },
      },
    });
    tl.to(dim, { opacity: 0.74, duration: 0.16 }, 0.05)
      .to(grid, { opacity: 1, duration: 0.16 }, 0.07)
      .set(scan, { opacity: 1 }, 0.1)
      .fromTo(scan, { xPercent: -1 }, { xPercent: 100, duration: 0.28 }, 0.1)
      .fromTo(lines, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.28 }, 0.1)
      .set(scan, { opacity: 0 }, 0.38)
      .to(state, { p: 0, duration: 0.32, onUpdate: () => { if (!manual) setBA(fig, state.p); } }, 0.5)
      .to(dim, { opacity: 0, duration: 0.3 }, 0.5)
      .to(lines, { opacity: 0, duration: 0.16 }, 0.72)
      .to(grid, { opacity: 0, duration: 0.12 }, 0.76)
      .to({}, { duration: 0.12 }, 0.88);
  });

  /* 4 Craft: one window, four crafts. The window pins; each service rises into it. */
  $$('[data-craft]').forEach((craft) => {
    craft.classList.add('craft-live');
    const photos = $$<HTMLElement>('.craft-photo', craft);
    const texts = $$<HTMLElement>('.craft-text', craft);
    const segs = $$<HTMLElement>('.craft-segs i', craft);
    const n = photos.length;
    photos.forEach((ph, i) => { if (i) gsap.set(ph, { clipPath: 'inset(100% 0% 0% 0%)' }); });
    let current = -1;
    const show = (i: number) => {
      if (i === current) return;
      const prev = texts[current];
      current = i;
      texts.forEach((t, k) => t.classList.toggle('is-active', k === i));
      if (prev) gsap.killTweensOf($$('.ch', prev));
      const t = texts[i];
      gsap.fromTo($$('.ch', t), { yPercent: 115 }, { yPercent: 0, duration: 0.6, ease: 'expo.out', stagger: 0.014 });
      gsap.fromTo([t.querySelector('.craft-line'), t.querySelector('.btn')], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06 });
    };
    show(0);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: craft, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (n - 1) * 1.1)}`,
        pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => show(Math.min(n - 1, Math.floor(self.progress * n * 0.999 + 0.2))),
      },
    });
    photos.forEach((_, i) => {
      tl.fromTo(segs[i], { scaleX: 0 }, { scaleX: 1, duration: 1 }, i);
      if (i < n - 1) {
        const next = photos[i + 1];
        tl.to(next, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5 }, i + 0.5)
          .fromTo(next.querySelector('img'), { scale: 1.22 }, { scale: 1, duration: 0.5 }, i + 0.5);
      }
    });
  });

  /* 5 Process: each stage develops from a line drawing into the photograph; a thread links them. */
  $$('[data-process]').forEach((proc) => {
    $$('[data-stage-step]', proc).forEach((st) => {
      const photo = st.querySelector('.stage-photo'), drawing = st.querySelector('.stage-lines');
      if (!photo || !drawing) return;
      gsap.fromTo(photo, { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: st, start: 'top 72%', end: 'center 50%', scrub: true } });
      gsap.fromTo(drawing, { opacity: 1 }, { opacity: 0.08, ease: 'none', scrollTrigger: { trigger: st, start: 'top 62%', end: 'center 44%', scrub: true } });
    });
    const thread = proc.querySelector('.thread i');
    if (thread) gsap.fromTo(thread, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: proc.querySelector('.stages'), start: 'top 70%', end: 'bottom 55%', scrub: true } });
  });

  /* 6 Proof: the stars fill one by one. */
  $$('.stars').forEach((stars) => {
    gsap.fromTo(stars.children, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(3)', stagger: 0.09, scrollTrigger: { trigger: stars, start: 'top 88%', once: true } });
  });

  /* A hero film, if one is set, plays only while it is on screen. */
  $$<HTMLVideoElement>('[data-hero-video]').forEach((v) => {
    if (!v.src && v.dataset.src) v.src = v.dataset.src;
    ScrollTrigger.create({
      trigger: v, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => { if (self.isActive) v.play().then(() => v.classList.add('is-playing'), () => {}); else v.pause(); },
    });
  });

  /* Header steps aside while reading down, returns on the way back up. */
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (header) {
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const menuOpen = header.querySelector('[aria-expanded="true"]');
        if (self.scroll() < 160 || menuOpen) header.removeAttribute('data-hidden');
        else header.toggleAttribute('data-hidden', self.direction === 1);
      },
    });
  }

  return () => {
    $$<HTMLElement>('[data-ba-scrub] [data-ba]').forEach((fig) => { fig.classList.remove('ba-acts'); setBA(fig, 50); });
    document.documentElement.classList.remove('stage-live');
    $$('[data-craft]').forEach((c) => c.classList.remove('craft-live'));
    document.querySelector('[data-header]')?.removeAttribute('data-hidden');
  };
});

// Photos below the fold load lazily but reserve their space, so one refresh after load is enough.
window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
