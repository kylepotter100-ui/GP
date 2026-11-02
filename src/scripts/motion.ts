/*
 * Choreographed motion (MOTION_INTENSITY 8), loaded only when the visitor has not asked for
 * reduced motion. Everything lives inside gsap.matchMedia, so switching reduced motion on
 * reverts every pin and tween. No scroll listeners: ScrollTrigger only.
 * Pinned scenes per page: at most two (the before/after scene and the services stack).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setBA } from './ba';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  /* 1. Signature: pinned, scroll-scrubbed before/after. The "before" wipes away to the "after". */
  document.querySelectorAll<HTMLElement>('[data-ba-scrub]').forEach((scene) => {
    const fig = scene.querySelector<HTMLElement>('[data-ba]');
    if (!fig) return;
    const state = { p: 100 };
    let manual = false; // once the visitor drags or uses the keys, scrolling no longer moves the slider
    fig.addEventListener('ba:user', () => { manual = true; }, { once: true });
    setBA(fig, 100);
    gsap.to(state, {
      p: 0,
      ease: 'none',
      onUpdate: () => { if (!manual) setBA(fig, state.p); },
      scrollTrigger: {
        trigger: scene,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });

  /* 2. Services sticky-stack (Section 5.A): pin the outer card, scale the inner wrapper. */
  document.querySelectorAll<HTMLElement>('[data-stack]').forEach((stack) => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-stack-card]', stack);
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      ScrollTrigger.create({
        trigger: card,
        // A card taller than the screen (small phones) is read to its end before it pins.
        start: () => (card.offsetHeight > window.innerHeight + 2 ? 'bottom bottom' : 'top top'),
        endTrigger: cards[cards.length - 1],
        end: 'top top',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
      // The card shrinks back and a ground-coloured veil settles over it; the card itself stays
      // opaque so the one beneath never shows through.
      const inner = card.querySelector('[data-stack-inner]');
      const veil = card.querySelector('[data-stack-veil]');
      if (!inner) return;
      const recede = { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true };
      gsap.to(inner, { scale: 0.92, ease: 'none', scrollTrigger: recede });
      if (veil) gsap.to(veil, { opacity: 0.6, ease: 'none', scrollTrigger: { ...recede } });
    });
  });

  /* 3. Header steps aside while reading down, returns on the way back up. */
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (header) {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const menuOpen = header.querySelector('[aria-expanded="true"]');
        if (self.scroll() < 160 || menuOpen) header.removeAttribute('data-hidden');
        else header.toggleAttribute('data-hidden', self.direction === 1);
      },
    });
  }

  /* 4. Real figures count up once as they arrive (only if they start below the fold). */
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target) || el.getBoundingClientRect().top < window.innerHeight) return;
    const decimals = Number(el.dataset.decimals || 0);
    const final = el.textContent ?? '';
    const suffix = final.replace(/^[\d.]+/, '');
    const state = { v: 0 };
    el.textContent = `${(0).toFixed(decimals)}${suffix}`;
    gsap.to(state, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = `${state.v.toFixed(decimals)}${suffix}`; },
      onComplete: () => { el.textContent = final; },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  return () => {
    document.querySelectorAll<HTMLElement>('[data-ba-scrub] [data-ba]').forEach((fig) => setBA(fig, 50));
    document.querySelector('[data-header]')?.removeAttribute('data-hidden');
  };
});

// Photos below the fold load lazily but reserve their space, so one refresh after load is enough.
window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
