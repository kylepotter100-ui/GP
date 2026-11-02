/*
 * Site behaviour. Loaded as a deferred module, so it never blocks first paint.
 * Every feature checks for its markup and does nothing if it is absent.
 * Content is fully visible without this script; it only adds motion and interaction.
 */
import { site } from '../config/site';
import { setBA } from './ba';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)] as T[];

/* ---------- Desktop services dropdown. ---------- */
function initDropdown() {
  $$('[data-dropdown]').forEach((li) => {
    const btn = li.querySelector('button')!;
    const menu = li.querySelector<HTMLElement>('[id]')!;
    const set = (open: boolean) => { btn.setAttribute('aria-expanded', String(open)); menu.hidden = !open; };
    btn.addEventListener('click', () => set(Boolean(menu.hidden)));
    li.addEventListener('keydown', (e) => { if ((e as KeyboardEvent).key === 'Escape') { set(false); btn.focus(); } });
    document.addEventListener('click', (e) => { if (!li.contains(e.target as Node)) set(false); });
    li.addEventListener('focusout', (e) => { if (!li.contains((e as FocusEvent).relatedTarget as Node)) set(false); });
  });
}

/* ---------- Mobile menu (native <dialog>: focus trap and Escape for free). ---------- */
function initMenu() {
  const dialog = document.getElementById('mobile-menu') as HTMLDialogElement | null;
  if (!dialog) return;
  $$('[data-menu-open]').forEach((b) => b.addEventListener('click', () => dialog.showModal()));
  $$('[data-menu-close]', dialog).forEach((b) => b.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) dialog.close(); });
}

/* ---------- Sticky mobile bar: shows once the hero buttons are off screen. ---------- */
function initStickyBar() {
  const bar = document.querySelector<HTMLElement>('[data-sticky-bar]');
  if (!bar) return;
  const show = (on: boolean) => { bar.classList.toggle('is-shown', on); bar.toggleAttribute('inert', !on); };
  const anchor = document.querySelector('[data-hero-actions]');
  const footer = document.querySelector('footer');
  let pastHero = !anchor;
  let atContact = false;
  const update = () => show(pastHero && !atContact);
  if (anchor) new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }).observe(anchor);
  // Step aside while the visitor is at the contact section or footer, where the same actions are on the page.
  const contact = document.getElementById('contact');
  const seen = new Set<Element>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
    atContact = seen.size > 0; update();
  }, { threshold: 0.15 });
  if (contact) io.observe(contact);
  if (footer) io.observe(footer);
  update();
}

/* ---------- Before/after reveal. ---------- */
function initBeforeAfter() {
  $$('[data-ba]').forEach((fig) => {
    const stage = fig.querySelector<HTMLElement>('.ba-stage')!;
    const range = fig.querySelector<HTMLInputElement>('.ba-range')!;
    // A visitor's own drag or key press hands them control of a scroll-scrubbed scene (motion.ts).
    const set = (pct: number) => { setBA(fig, pct); fig.dispatchEvent(new Event('ba:user')); };
    const fromPointer = (x: number) => { const r = stage.getBoundingClientRect(); set(((x - r.left) / r.width) * 100); };
    let dragging = false;
    let startX = 0, startY = 0, decided = false;
    stage.addEventListener('dragstart', (e) => e.preventDefault());
    stage.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') e.preventDefault();
      dragging = true; decided = e.pointerType === 'mouse'; startX = e.clientX; startY = e.clientY;
      if (decided) { stage.setPointerCapture(e.pointerId); fromPointer(e.clientX); }
    });
    stage.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      if (!decided) {
        // On touch, only take over a clearly sideways drag; vertical drags keep scrolling the page.
        const dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) { dragging = false; return; }
        decided = true; stage.setPointerCapture(e.pointerId);
      }
      fromPointer(e.clientX);
    });
    const end = (e: PointerEvent) => {
      if (dragging && !decided && e.type === 'pointerup') fromPointer(e.clientX); // a tap moves the handle there
      dragging = false;
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    stage.addEventListener('click', () => range.focus({ preventScroll: true }));
    range.addEventListener('input', () => set(Number(range.value)));
  });

  // Project switcher (home and gallery): swaps which pair is shown.
  $$('[data-ba-switch]').forEach((group) => {
    const tabs = $$<HTMLButtonElement>('[role="tab"]', group);
    const panels = $$('[role="tabpanel"]', group);
    const select = (i: number, focus = false) => {
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
      panels.forEach((p, j) => (p.hidden = i !== j));
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') select((i + 1) % tabs.length, true);
        if (e.key === 'ArrowLeft') select((i - 1 + tabs.length) % tabs.length, true);
      });
    });
  });
}

/* ---------- Swipe rows: buttons for pointer devices; touch swipes natively. ---------- */
function initSwipe() {
  $$('[data-swipe]').forEach((row) => {
    const track = row.querySelector<HTMLElement>('[data-swipe-track]')!;
    const controls = row.querySelector<HTMLElement>('[data-swipe-controls]');
    if (!controls || track.scrollWidth <= track.clientWidth + 4) return;
    controls.hidden = false;
    const step = () => (track.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? track.clientWidth * 0.8;
    const go = (dir: number) => track.scrollBy({ left: dir * (step() + 16), behavior: reduceMotion ? 'auto' : 'smooth' });
    row.querySelector('[data-swipe-prev]')!.addEventListener('click', () => go(-1));
    row.querySelector('[data-swipe-next]')!.addEventListener('click', () => go(1));
  });
}

/* ---------- Consent, analytics and event tracking. ---------- */
type Consent = 'all' | 'none';
const CONSENT_KEY = 'gjp-consent';
const readConsent = (): Consent | null => { try { return localStorage.getItem(CONSENT_KEY) as Consent | null; } catch { return null; } };
const saveConsent = (c: Consent) => { try { localStorage.setItem(CONSENT_KEY, c); } catch { /* private mode: ask again next visit */ } };

declare global { interface Window { dataLayer: unknown[]; gtag?: (...a: unknown[]) => void; clarity?: (...a: unknown[]) => void } }

function loadAnalytics() {
  if (window.gtag) return;
  const s = document.createElement('script');
  s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${site.analytics.ga4}`;
  document.head.append(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); } as Window['gtag'];
  window.gtag!('js', new Date());
  window.gtag!('config', site.analytics.ga4);
  // Microsoft Clarity, same project as the live site.
  (function (c: any, l: Document, a: string, r: string, i: string) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement(r) as HTMLScriptElement; t.async = true; t.src = `https://www.clarity.ms/tag/${i}`;
    l.head.append(t);
  })(window, document, 'clarity', 'script', site.analytics.clarity);
}

function track(name: string, params: Record<string, string>) { window.gtag?.('event', name, params); }

function initConsent() {
  const banner = document.querySelector<HTMLElement>('[data-consent]');
  const current = readConsent();
  if (current === 'all') loadAnalytics();
  if (!banner) return;
  if (!current) banner.hidden = false;
  const decide = (c: Consent) => { saveConsent(c); banner.hidden = true; if (c === 'all') loadAnalytics(); };
  banner.querySelector('[data-consent-accept]')!.addEventListener('click', () => decide('all'));
  banner.querySelector('[data-consent-reject]')!.addEventListener('click', () => decide('none'));
  const prefsBtn = banner.querySelector<HTMLButtonElement>('[data-consent-prefs]')!;
  const prefs = document.getElementById('consent-prefs')!;
  prefsBtn.addEventListener('click', () => { prefs.hidden = !prefs.hidden; prefsBtn.setAttribute('aria-expanded', String(!prefs.hidden)); });
  banner.querySelector<HTMLFormElement>('[data-consent-form]')!.addEventListener('submit', (e) => {
    e.preventDefault();
    decide((e.currentTarget as HTMLFormElement).analytics.checked ? 'all' : 'none');
  });

  // Same GA4 event the WhatsApp plugin sent on the live site, so reports stay continuous.
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
    if (!a) return;
    if (a.dataset.track === 'whatsapp') track('Click to Chat', { event_category: 'Click to Chat for WhatsApp', event_label: `${document.title}, ${location.href}` });
    if (a.dataset.track === 'call') track('click_call', { link_url: (a as HTMLAnchorElement).href });
  });
}

/* ---------- Contact form: uploads, spam check, inline states. ---------- */
const MAX_FILES = 5;
const MAX_BYTES = 15 * 1024 * 1024;

function loadTurnstile(slot: HTMLElement) {
  if (slot.dataset.loaded) return;
  slot.dataset.loaded = '1';
  const box = document.createElement('div');
  box.className = 'cf-turnstile';
  box.dataset.sitekey = slot.dataset.sitekey!;
  box.dataset.appearance = 'interaction-only';
  slot.append(box);
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  s.async = true; s.defer = true;
  document.head.append(s);
}

function initForms() {
  $$<HTMLFormElement>('[data-contact-form]').forEach((form) => {
    const status = form.querySelector<HTMLElement>('[data-form-status]')!;
    const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
    const upload = form.querySelector<HTMLInputElement>('[data-upload]')!;
    const uploadLabel = form.querySelector<HTMLElement>('[data-upload-label]')!;
    const success = form.nextElementSibling as HTMLElement | null;
    const slot = form.querySelector<HTMLElement>('[data-turnstile-slot]');

    // Load the spam check only when someone starts filling the form in.
    if (slot) form.addEventListener('focusin', () => loadTurnstile(slot), { once: true });

    const describeFiles = () => {
      const files = [...(upload.files ?? [])];
      const total = files.reduce((n, f) => n + f.size, 0);
      if (!files.length) { uploadLabel.textContent = 'Choose photos or drag them here'; return ''; }
      uploadLabel.textContent = files.length === 1 ? files[0].name : `${files.length} files chosen`;
      if (files.length > MAX_FILES) return `Please choose up to ${MAX_FILES} files.`;
      if (total > MAX_BYTES) return 'Those files are over 15 MB in total. Please choose fewer or smaller photos.';
      return '';
    };
    upload.addEventListener('change', () => { const err = describeFiles(); status.textContent = err; upload.setCustomValidity(err); });
    const drop = upload.previousElementSibling as HTMLElement;
    ['dragover', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => {
      e.preventDefault();
      if (ev === 'drop' && (e as DragEvent).dataTransfer?.files.length) { upload.files = (e as DragEvent).dataTransfer!.files; upload.dispatchEvent(new Event('change')); }
    }));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
      const invalid = [...form.elements].filter((el) => (el as HTMLInputElement).willValidate && !(el as HTMLInputElement).checkValidity()) as HTMLInputElement[];
      if (invalid.length) {
        invalid.forEach((el) => el.setAttribute('aria-invalid', 'true'));
        status.textContent = invalid[0].validationMessage || 'Please check the highlighted fields.';
        invalid[0].focus();
        return;
      }
      submit.disabled = true;
      const label = submit.textContent;
      submit.textContent = 'Sending…';
      status.textContent = '';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || 'send failed');
        track('generate_lead', { form: 'contact', page: location.pathname });
        form.hidden = true;
        if (success) { success.classList.remove('hidden'); success.focus(); }
      } catch (err) {
        status.textContent = `Sorry, that didn’t send. Please try again, or call ${site.phone.display}.`;
        (window as any).turnstile?.reset?.();
      } finally {
        submit.disabled = false;
        submit.textContent = label;
      }
    });
  });
}

/* ---------- Chapter index: marks the chapter being read (IntersectionObserver). ---------- */
function initChapterIndex() {
  const index = document.querySelector<HTMLElement>('[data-chapter-index]');
  if (!index || !('IntersectionObserver' in window)) return;
  const links = new Map([...index.querySelectorAll<HTMLAnchorElement>('a')].map((a) => [a.hash.slice(1), a]));
  const visible = new Set<string>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
    const current = [...links.keys()].find((id) => visible.has(id));
    if (current) links.forEach((a, id) => a.setAttribute('aria-current', String(id === current)));
  }, { rootMargin: '-30% 0px -55% 0px' });
  document.querySelectorAll<HTMLElement>('[data-chapter]').forEach((s) => io.observe(s));
}

/* ---------- Gallery: filters and lightbox. ---------- */
function initGallery() {
  const grid = document.querySelector<HTMLElement>('[data-gallery]');
  if (!grid) return;
  const items = $$<HTMLElement>('[data-tags]', grid);
  const filters = document.querySelector<HTMLElement>('[data-gallery-filters]');
  if (filters) {
    filters.hidden = false;
    const buttons = $$<HTMLButtonElement>('button', filters);
    buttons.forEach((b) => b.addEventListener('click', () => {
      const tag = b.dataset.filter!;
      buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      items.forEach((it) => (it.hidden = tag !== 'all' && !it.dataset.tags!.split(' ').includes(tag)));
    }));
  }
  const dialog = document.getElementById('lightbox') as HTMLDialogElement | null;
  if (!dialog) return;
  const img = dialog.querySelector('img')!;
  const caption = dialog.querySelector('figcaption')!;
  let index = 0;
  const visible = () => items.filter((it) => !it.hidden);
  const show = (i: number) => {
    const list = visible();
    index = (i + list.length) % list.length;
    const a = list[index].querySelector('a')!;
    img.src = a.href; img.alt = a.querySelector('img')?.alt ?? '';
    caption.textContent = img.alt;
  };
  grid.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    e.preventDefault();
    show(visible().findIndex((it) => it.contains(a)));
    dialog.showModal();
  });
  dialog.querySelector('[data-lb-prev]')!.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lb-next]')!.addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-lb-close]')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });
  let sx = 0;
  dialog.addEventListener('pointerdown', (e) => (sx = e.clientX));
  dialog.addEventListener('pointerup', (e) => { const dx = e.clientX - sx; if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1)); });
}

initDropdown();
initMenu();
initStickyBar();
initBeforeAfter();
initSwipe();
initConsent();
initForms();
initGallery();
initChapterIndex();

// Choreographed motion (GSAP + ScrollTrigger) only for visitors who have not asked for reduced motion.
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) import('./motion');
