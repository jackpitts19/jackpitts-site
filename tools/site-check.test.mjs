// Guards the public site against regressions. Run: node --test tools/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', '404.html', 'privacy.html', 'disclosures.html',
  ...readdirSync(join(ROOT, 'blog')).filter(f => f.endsWith('.html')).map(f => `blog/${f}`)];
const read = p => readFileSync(join(ROOT, p), 'utf8');
const PRIVATE_LINKS = ['helmiq.net/book/', 'calendar.app.google', 'calendar.google.com'];
const RETIRED = ['beehiiv', 'luma.com', 'tiktok.com', 'fonts.googleapis.com', 'Hosted By'];

function localTarget(page, href) {
  const path = href.split('#')[0].split('?')[0];
  if (!path) return null;
  const rel = path.startsWith('/') ? path.slice(1) : normalize(join(dirname(page), path));
  return rel === '' || rel.endsWith('/') ? `${rel}index.html` : rel;
}

for (const page of PAGES) {
  const html = read(page);

  test(`${page}: every local link and asset exists`, () => {
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1])
      .filter(h => !/^(https?:|mailto:|#)/.test(h));
    const missing = refs.filter(h => { const t = localTarget(page, h); return t && !existsSync(join(ROOT, t)); });
    assert.deepEqual(missing, []);
  });

  test(`${page}: structured data parses`, () => {
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      assert.doesNotThrow(() => JSON.parse(json));
    }
  });

  test(`${page}: no inline scripts or handlers (the CSP blocks them)`, () => {
    const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/g)];
    assert.equal(inline.length, 0);
    assert.doesNotMatch(html, /\son(click|load|error|submit)=/i);
  });

  test(`${page}: no private calendar or retired links`, () => {
    for (const s of [...PRIVATE_LINKS, ...RETIRED]) assert.ok(!html.includes(s), `found ${s}`);
  });

  test(`${page}: one h1, one main, a title`, () => {
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    assert.match(html, /<title>[^<]{10,}<\/title>/);
  });
}

test('indexable pages have a description and a canonical URL that is in the sitemap', () => {
  const sitemap = read('sitemap.xml');
  for (const page of PAGES) {
    const html = read(page);
    if (/name="robots" content="noindex/.test(html)) continue;
    assert.match(html, /<meta name="description" content="[^"]{50,}">/, page);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/);
    assert.ok(canonical, `${page} has no canonical`);
    assert.ok(sitemap.includes(`<loc>${canonical[1]}</loc>`), `${canonical[1]} missing from sitemap`);
  }
});

test('hidden blog posts are noindex and not in the sitemap', () => {
  const sitemap = read('sitemap.xml');
  for (const page of PAGES.filter(p => p.startsWith('blog/'))) {
    assert.match(read(page), /name="robots" content="noindex, follow"/, page);
    assert.ok(!sitemap.includes(`/${page}`), `${page} still in sitemap`);
  }
});

test('homepage links all three Instagram accounts and both podcasts', () => {
  const html = read('index.html');
  for (const url of ['instagram.com/thejackpitts"', 'instagram.com/saltcreekadvisory"', 'instagram.com/themakingofhostedbyjackpitts"',
    'open.spotify.com/show/4vUJmF28QI4N7WViFmFofH', 'open.spotify.com/show/0346Msd0zGSseN8XNyDzc4']) {
    assert.ok(html.includes(url), url);
  }
});

test('vercel.json sends a strict Content-Security-Policy', () => {
  const config = JSON.parse(read('vercel.json'));
  const all = config.headers.find(h => h.source === '/(.*)').headers;
  const csp = all.find(h => h.key === 'Content-Security-Policy').value;
  assert.match(csp, /script-src 'self';/);
  assert.match(csp, /frame-ancestors 'none'/);
});
