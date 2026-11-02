// Typed access to the migrated page copy in src/content/pages (verbatim from the live site,
// plus only the approved edits listed in docs/redesign/copy-edits.md).
export type Block =
  | { t: 'p'; html: string }
  | { t: 'ul' | 'ol'; items: string[] }
  | { t: 'h3' | 'h4' | 'h5' | 'h6'; html: string }
  | { t: 'img'; src: string; alt: string }
  | { t: 'button'; text: string; href: string }
  | { t: 'iconlist'; items: { html: string; href: string }[] }
  | { t: 'table'; rows: string[][]; head: boolean }
  | { t: 'widget'; kind: string; text: string };

export interface Chapter { heading: string; blocks: Block[] }

export interface PageContent {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogImage: string | null;
  crumb: string;
  bannerSubtext: string | null;
  h1: string;
  intro: Block[];
  chapters: Chapter[];
  closing: Chapter | null;
  hasForm: boolean;
}

const pages = import.meta.glob<PageContent>('../content/pages/*.json', { eager: true, import: 'default' });

export function getPage(slug: string): PageContent {
  const p = pages[`../content/pages/${slug}.json`];
  if (!p) throw new Error(`No content for ${slug}`);
  return p;
}

export const slugFor = (path: string) => (path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '--'));

/** Plain text of a heading's HTML (headings may contain a link). */
export const text = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();

/** Strip a wrapping link from heading HTML, returning [text, href]. */
export function headingLink(html: string): [string, string | null] {
  const m = html.match(/^<a href="([^"]+)">([\s\S]*)<\/a>$/);
  return m ? [m[2].trim(), m[1]] : [html, null];
}
