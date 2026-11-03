/*
 * Site behaviour. Loaded as a deferred module, so it never blocks first paint.
 * Every feature checks for its markup and does nothing if it is absent.
 * Content is fully visible without this script; it only adds motion and interaction.
 */
import { site } from '../config/site';
import { setBA } from './ba';
import { stages, stepped } from './stage';

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
      form.dispatchEvent(new Event('form:compose')); // the brief writes its choices into the message
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
        form.dispatchEvent(new Event('form:sent'));
        form.hidden = true;
        if (success) { success.classList.remove('hidden'); success.focus(); }
      } catch (err) {
        form.dispatchEvent(new Event('form:failed'));
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


/* ---------- Start your project: the stepped brief, opened as a sheet. ---------- */
function initBrief() {
  const host = document.querySelector<HTMLElement>('[data-brief]');
  const openers = $$<HTMLAnchorElement>('[data-open-brief]');
  if (!host) {
    // No brief on this page: "Start your project" goes to the contact page's brief.
    openers.forEach((a) => { if (a.getAttribute('href') === '#brief') a.href = '/contact-us/#brief'; });
    return;
  }
  const form = host.querySelector<HTMLFormElement>('[data-brief-form]')!;
  const steps = $$<HTMLFieldSetElement>('.bstep', form);
  const count = host.querySelector<HTMLElement>('[data-brief-count]')!;
  const progress = host.querySelector<HTMLElement>('[data-brief-progress]')!;
  const note = form.querySelector<HTMLTextAreaElement>('[data-brief-note]')!;
  const first = form.querySelector<HTMLInputElement>('[name="name-1-first-name"]')!;
  const last = form.querySelector<HTMLInputElement>('[name="name-1-last-name"]')!;
  const email = form.querySelector<HTMLInputElement>('[name="email-1"]')!;
  const upload = form.querySelector<HTMLInputElement>('[data-upload]')!;
  const thumbs = form.querySelector<HTMLElement>('[data-thumbs]')!;
  const inline = host.hasAttribute('data-inline');
  const answers: Record<string, string> = {};
  let current = 1;
  let opener: HTMLElement | null = null;

  $$('[data-js-only]', host).forEach((el) => (el.hidden = false));
  note.required = false; // the choices fill the message, so a note is optional

  const show = (n: number, focus = true) => {
    current = n;
    steps.forEach((st) => st.classList.toggle('is-current', Number(st.dataset.step) === n));
    count.textContent = `Step ${n} of ${steps.length}`;
    progress.style.transform = `scaleX(${n / steps.length})`;
    const step = steps[n - 1];
    if (!reduceMotion) step.animate([{ opacity: 0, transform: 'translateX(28px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    if (focus) step.querySelector<HTMLElement>('.bstep-title')?.focus({ preventScroll: true });
    if (host.classList.contains('is-sheet')) host.scrollTop = 0;
  };
  show(1, false);

  $$<HTMLElement>('[data-pick]', form).forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
      if (!btn) return;
      $$('button', group).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      answers[group.dataset.pick!] = btn.dataset.value!;
      window.setTimeout(() => show(current + 1), reduceMotion ? 0 : 280);
    });
  });
  $$('[data-brief-back]', form).forEach((b) => b.addEventListener('click', () => show(Math.max(1, current - 1))));
  form.querySelector('[data-brief-next]')!.addEventListener('click', () => {
    const bad = [first, email].find((el) => !el.checkValidity());
    [first, email].forEach((el) => el.toggleAttribute('aria-invalid', !el.checkValidity()));
    if (bad) { bad.reportValidity(); bad.focus(); return; }
    show(5);
  });
  upload.addEventListener('change', () => {
    thumbs.replaceChildren(...[...(upload.files ?? [])].slice(0, 5).filter((f) => f.type.startsWith('image/')).map((f) => {
      const img = document.createElement('img');
      img.alt = '';
      img.src = URL.createObjectURL(f);
      return img;
    }));
  });

  // Choices go into the message (the Worker and the six field names are unchanged).
  form.addEventListener('form:compose', () => {
    const lines = Object.entries(answers).map(([k, v]) => `${k}: ${v}`);
    const text = note.value.replace(/^(Project|Where|Start): .*\n?/gm, '').trim();
    note.value = [lines.join('\n'), text].filter(Boolean).join('\n\n') || 'Project enquiry';
  });
  form.addEventListener('form:sent', () => {
    const files = upload.files?.length ?? 0;
    const rows: [string, string][] = [
      ['Project', answers.Project ?? 'To discuss'],
      ['Where', answers.Where ?? 'To discuss'],
      ['Start', answers.Start ?? 'To discuss'],
      ['Photos', files ? `${files} attached` : 'None yet'],
      ['Name', `${first.value} ${last.value}`.trim()],
    ];
    const dl = host.querySelector<HTMLElement>('[data-ticket]')!;
    dl.replaceChildren(...rows.map(([k, v], i) => {
      const row = document.createElement('div');
      row.style.setProperty('--r', String(i));
      const dt = document.createElement('dt'); dt.textContent = k;
      const dd = document.createElement('dd'); dd.textContent = v;
      row.append(dt, dd);
      return row;
    }));
    host.querySelector<HTMLElement>('[data-done-msg]')!.textContent = `Thank you, ${first.value.trim() || 'and welcome'}. Your brief has reached us.`;
    count.textContent = 'Sent';
    progress.style.transform = 'scaleX(1)';
  });

  // Sheet: grows out of the button that opened it, and shrinks back into it.
  const pill = document.querySelector<HTMLElement>('[data-pill]');
  const origin = () => {
    const r = (opener ?? host).getBoundingClientRect();
    return `${Math.round(r.left + r.width / 2)}px ${Math.round(r.top + r.height / 2)}px`;
  };
  const open = (from: HTMLElement | null) => {
    opener = from;
    host.classList.add('is-sheet');
    host.setAttribute('role', 'dialog');
    host.setAttribute('aria-modal', 'true');
    document.documentElement.style.overflow = 'hidden';
    pill?.setAttribute('inert', '');
    if (!reduceMotion) host.animate([{ clipPath: `circle(0px at ${origin()})` }, { clipPath: `circle(150% at ${origin()})` }], { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
    steps[current - 1].querySelector<HTMLElement>('.bstep-title')?.focus({ preventScroll: true });
  };
  const close = () => {
    const done = () => {
      host.classList.remove('is-sheet');
      host.removeAttribute('role');
      host.removeAttribute('aria-modal');
      document.documentElement.style.overflow = '';
      if (pill?.classList.contains('is-shown')) pill.removeAttribute('inert');
      opener?.focus({ preventScroll: true });
    };
    if (reduceMotion) { done(); return; }
    host.animate([{ clipPath: `circle(150% at ${origin()})` }, { clipPath: `circle(0px at ${origin()})` }], { duration: 480, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }).finished.then(done, done);
  };
  openers.forEach((a) => a.addEventListener('click', (e) => {
    if (inline) return; // contact page: the brief is right there; the link scrolls to it
    e.preventDefault();
    open(a);
  }));
  $$('[data-brief-close]', host).forEach((b) => b.addEventListener('click', close));
  host.addEventListener('keydown', (e) => { if (e.key === 'Escape' && host.classList.contains('is-sheet')) close(); });
  // Keep keyboard focus inside the open sheet.
  host.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !host.classList.contains('is-sheet')) return;
    const f = $$<HTMLElement>('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])', host).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  if (location.hash === '#brief' && !inline) open(null);
}

/* ---------- The travelling call to action: shows after the hero, lands on the invitation. ---------- */
function initPill() {
  const pill = document.querySelector<HTMLElement>('[data-pill]');
  if (!pill) return;
  const inner = pill.querySelector<HTMLElement>('[data-pill-in]')!;
  const target = document.querySelector<HTMLElement>('[data-pill-land]');
  const anchor = document.querySelector('[data-hero-actions]');
  const footer = document.querySelector('footer');
  let pastHero = !anchor, landed = false, atFooter = false, shown = false;

  const set = (on: boolean) => {
    if (on === shown) return;
    shown = on;
    pill.classList.toggle('is-shown', on);
    pill.toggleAttribute('inert', !on);
  };
  const land = () => {
    if (!target || !shown || reduceMotion) { set(false); return; }
    // Fly the pill onto the invitation's button, then hand over to it.
    const a = inner.getBoundingClientRect(), b = target.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    inner.animate([{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(${b.width / a.width}, ${b.height / a.height})`, opacity: 0 }], { duration: 650, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
    target.animate([{ transform: 'scale(0.96)' }, { transform: 'scale(1.03)', offset: 0.6 }, { transform: 'none' }], { duration: 520, delay: 480, easing: 'ease-out' });
    set(false);
  };
  const update = () => {
    const want = pastHero && !landed && !atFooter;
    if (!want && shown && landed) land(); else set(want);
  };
  if (anchor) new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }).observe(anchor);
  if (target) new IntersectionObserver(([e]) => { landed = e.isIntersecting || e.boundingClientRect.top < 0; update(); }, { threshold: 0.9 }).observe(target);
  if (footer && !target) new IntersectionObserver(([e]) => { atFooter = e.isIntersecting; update(); }).observe(footer);
  update();
}

/* ---------- Reviews deck: flick the top card with a thumb, or use Next review. ---------- */
function initDeck() {
  $$('[data-deck]').forEach((wrap) => {
    const deck = wrap.querySelector<HTMLElement>('.deck')!;
    let cards = $$<HTMLElement>('.deck-card', deck);
    if (cards.length < 2) return;
    wrap.classList.add('deck-live');
    wrap.querySelector<HTMLElement>('[data-deck-ctrl]')!.hidden = false;
    const tilt = [0, -3, 2.5];
    const layout = () => cards.forEach((c, i) => {
      c.style.zIndex = String(cards.length - i);
      c.style.transform = `translateY(${i * 12}px) rotate(${tilt[i] ?? 0}deg) scale(${1 - i * 0.045})`;
      c.style.transition = reduceMotion ? 'none' : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
      c.setAttribute('aria-hidden', String(i > 0));
    });
    layout();
    const flick = (dir: number) => {
      const top = cards[0];
      const next = () => { cards = [...cards.slice(1), top]; layout(); };
      if (reduceMotion) { next(); return; }
      top.style.transition = 'transform 320ms cubic-bezier(0.55, 0, 1, 0.45)';
      top.style.transform = `translateX(${dir * (deck.offsetWidth + 80)}px) rotate(${dir * 16}deg)`;
      window.setTimeout(next, 320);
    };
    wrap.querySelector('[data-deck-next]')!.addEventListener('click', () => flick(1));
    let drag: { x: number; y: number; dx: number; id: number; on: boolean } | null = null;
    deck.addEventListener('pointerdown', (e) => { if (cards[0].contains(e.target as Node)) drag = { x: e.clientX, y: e.clientY, dx: 0, id: e.pointerId, on: false }; });
    deck.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.on) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; } // a vertical swipe scrolls the page
        drag.on = true; deck.setPointerCapture(e.pointerId); cards[0].style.transition = 'none';
      }
      drag.dx = dx;
      cards[0].style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
    });
    const end = () => {
      if (!drag) return;
      const { dx, on } = drag; drag = null;
      if (!on) return;
      if (Math.abs(dx) > 90) flick(Math.sign(dx)); else layout();
    };
    deck.addEventListener('pointerup', end);
    deck.addEventListener('pointercancel', end);
  });
}

/* ---------- Page morph: the tapped service photo grows into the service page's hero. ---------- */
function initMorph() {
  $$<HTMLAnchorElement>('[data-craft] a[data-morph]').forEach((a) => a.addEventListener('click', () => {
    const item = a.closest('[data-craft-item]');
    if (!item) return;
    $$<HTMLElement>('[style*="view-transition-name"]').forEach((el) => (el.style.viewTransitionName = ''));
    const img = item.querySelector<HTMLElement>('.craft-photo img');
    const title = item.querySelector<HTMLElement>('.craft-title');
    if (img) img.style.viewTransitionName = 'svc-photo';
    if (title) title.style.viewTransitionName = 'svc-title';
  }));
  // Coming back (bfcache), clear the names so the next tap starts clean.
  window.addEventListener('pageshow', () => $$<HTMLElement>('[data-craft] [style*="view-transition-name"]').forEach((el) => (el.style.viewTransitionName = '')));
}

initDropdown();
initMenu();
initBeforeAfter();
initSwipe();
initConsent();
initForms();
initGallery();
initChapterIndex();
initBrief();
initPill();
initDeck();
initMorph();

// Stage colour: with reduced motion it steps; otherwise motion.ts morphs it smoothly.
if (reduceMotion) { const s = stages(); if (s) stepped(s); }

// Choreographed motion (GSAP + ScrollTrigger) only for visitors who have not asked for reduced motion.
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) import('./motion');
