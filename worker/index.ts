/**
 * Cloudflare Worker: serves the static site from ./dist and handles the enquiry form at /api/contact.
 *
 * Field names match the live WordPress form (decision D14):
 *   name-1-first-name, name-1-last-name, email-1, phone-1, upload-1[], textarea-1
 * Spam protection: Cloudflare Turnstile (cf-turnstile-response). Delivery: Email Routing `send_email` binding.
 *
 * Bindings and settings (wrangler.jsonc): ASSETS, SEND_EMAIL, MAIL_FROM, MAIL_TO; secret TURNSTILE_SECRET.
 */
// @ts-ignore: provided by the Workers runtime
import { EmailMessage } from 'cloudflare:email';

interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
  SEND_EMAIL: { send(msg: unknown): Promise<void> };
  MAIL_FROM: string;
  MAIL_TO: string;
  TURNSTILE_SECRET?: string;
}

const MAX_FILES = 5;
const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = /^(image\/|application\/pdf$)/;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request: Request, env: Env): Promise<Response> {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const reply = (ok: boolean, error?: string, status = ok ? 200 : 400) =>
    wantsJson
      ? Response.json(ok ? { ok } : { ok, error }, { status })
      : new Response(page(ok, error), { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(false, 'The form could not be read.');
  }
  const get = (k: string) => clean(String(form.get(k) ?? ''));
  const first = get('name-1-first-name');
  const last = get('name-1-last-name');
  const email = get('email-1');
  const phone = get('phone-1');
  const message = String(form.get('textarea-1') ?? '').trim().slice(0, 10000);
  const pagePath = get('page').slice(0, 200);

  if (!first || !message) return reply(false, 'Please add your name and a message.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(false, 'Please check your email address.');

  // Spam check. Without a configured secret (local preview) it is skipped.
  if (env.TURNSTILE_SECRET) {
    const token = String(form.get('cf-turnstile-response') ?? '');
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: request.headers.get('CF-Connecting-IP') ?? '' }),
    }).then((r) => r.json() as Promise<{ success: boolean }>).catch(() => ({ success: false }));
    if (!verify.success) return reply(false, 'The spam check did not pass. Please try again.', 403);
  }

  const files = form.getAll('upload-1[]').filter((f): f is File => typeof f === 'object' && f !== null && (f as File).size > 0);
  if (files.length > MAX_FILES) return reply(false, `Please attach up to ${MAX_FILES} files.`);
  if (files.reduce((n, f) => n + f.size, 0) > MAX_BYTES) return reply(false, 'Attachments are over 15 MB in total.');
  if (files.some((f) => !ALLOWED.test(f.type) && !/\.(heic|heif)$/i.test(f.name))) return reply(false, 'Please attach photos or PDF files only.');

  const name = `${first} ${last}`.trim();
  const body = [
    `New enquiry from the website${pagePath ? ` (${pagePath})` : ''}`,
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || 'not given'}`,
    `Attachments: ${files.length}`,
    '',
    'Message:',
    message,
  ].join('\r\n');

  const raw = await buildMime({
    from: env.MAIL_FROM,
    to: env.MAIL_TO,
    replyTo: `${name} <${email}>`,
    subject: `Website enquiry from ${name}`,
    text: body,
    files,
  });

  try {
    await env.SEND_EMAIL.send(new EmailMessage(env.MAIL_FROM, env.MAIL_TO, raw));
  } catch (err) {
    console.error('send_email failed', err);
    return reply(false, 'The message could not be sent.', 502);
  }
  return reply(true);
}

/** Strip CR/LF (header injection) and trim. */
const clean = (s: string) => s.replace(/[\r\n]+/g, ' ').trim().slice(0, 300);

const b64 = (bytes: Uint8Array) => {
  let out = '';
  for (let i = 0; i < bytes.length; i += 0x8000) out += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(out).replace(/.{76}/g, '$&\r\n');
};
const utf8b64 = (s: string) => b64(new TextEncoder().encode(s));
const encodeWord = (s: string) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(s)))}?=`);

async function buildMime(m: { from: string; to: string; replyTo: string; subject: string; text: string; files: File[] }) {
  const boundary = `gjp-${crypto.randomUUID()}`;
  const domain = m.from.split('@')[1] ?? 'localhost';
  const lines = [
    `From: ${encodeWord('Website enquiry')} <${m.from}>`,
    `To: <${m.to}>`,
    `Reply-To: ${encodeWord(m.replyTo.replace(/<.*>/, '').trim())} <${m.replyTo.match(/<(.*)>/)?.[1] ?? ''}>`,
    `Subject: ${encodeWord(m.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    utf8b64(m.text),
  ];
  for (const f of m.files) {
    const name = f.name.replace(/["\r\n]/g, '_').slice(0, 120) || 'attachment';
    lines.push(
      `--${boundary}`,
      `Content-Type: ${f.type || 'application/octet-stream'}; name="${name}"`,
      `Content-Disposition: attachment; filename="${name}"`,
      'Content-Transfer-Encoding: base64',
      '',
      b64(new Uint8Array(await f.arrayBuffer())),
    );
  }
  lines.push(`--${boundary}--`, '');
  return lines.join('\r\n');
}

/** No-JavaScript fallback: a minimal confirmation or error page in the site's colours. */
function page(ok: boolean, error?: string) {
  const title = ok ? 'Thank you' : 'Sorry, that didn’t send';
  const text = ok
    ? 'Your message has reached us. We’ll be in touch soon, usually within a working day.'
    : `${escapeHtml(error ?? 'Something went wrong.')} Please go back and try again, or call 07415 216223.`;
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title} | Gary J Potter Carpentry &amp; Construction</title>
<style>body{margin:0;font:18px/1.6 system-ui,sans-serif;background:#f6f7f7;color:#15191d}main{max-width:40rem;margin:0 auto;padding:4rem 1rem}h1{font:600 2rem/1.2 Georgia,serif}a{color:#0c74bb}</style></head>
<body><main><h1>${title}</h1><p>${text}</p><p><a href="/">Back to the home page</a> · <a href="tel:+447415216223">07415 216223</a></p></main></body></html>`;
}
const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
