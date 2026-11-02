/** Shared before/after position setter (drag slider, keyboard and the scroll-scrubbed scene). */
export function setBA(fig: HTMLElement, pct: number) {
  const v = Math.max(0, Math.min(100, pct));
  fig.style.setProperty('--pos', `${v}%`);
  const range = fig.querySelector<HTMLInputElement>('.ba-range');
  if (range) {
    range.value = String(Math.round(v));
    range.setAttribute('aria-valuetext', `${Math.round(100 - v)}% after`);
  }
}
