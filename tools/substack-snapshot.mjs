// Refreshes the "Latest on Substack" list on the homepage from the publication's RSS feed.
// The list is written into index.html as static HTML, so the live page never depends on Substack.
// If the fetch or parse fails, the file is left exactly as it was.
//
// Usage: node tools/substack-snapshot.mjs [path/to/index.html]

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { toPlainText, escapeHtml, truncate, isoDate, displayDate, isSafeUrl, injectBetween } from './html-utils.mjs';

const FEED_URL = 'https://thejackpitts.substack.com/feed';
const POST_PREFIX = 'https://thejackpitts.substack.com/p/';
const MAX_POSTS = 3;
const MAX_EXCERPT = 160;
const FETCH_TIMEOUT_MS = 10000;
const START = '<!-- substack:start -->';
const END = '<!-- substack:end -->';

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1] : '';
}

export function parseFeed(xml) {
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return blocks
    .map(block => ({
      title: toPlainText(tag(block, 'title')),
      url: toPlainText(tag(block, 'link')),
      date: isoDate(toPlainText(tag(block, 'pubDate'))),
      excerpt: truncate(toPlainText(tag(block, 'description')), MAX_EXCERPT),
    }))
    .filter(p => p.title && p.date && isSafeUrl(p.url, POST_PREFIX));
}

export function renderList(posts, limit = MAX_POSTS) {
  if (posts.length === 0) throw new Error('No posts found in feed');
  const items = posts.slice(0, limit).map(p => [
    '          <li>',
    `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">`,
    `<time class="pf-date" datetime="${p.date}">${displayDate(p.date)}</time>`,
    `<span class="pf-title">${escapeHtml(p.title)}</span>`,
    p.excerpt ? `<span class="pf-ex">${escapeHtml(p.excerpt)}</span>` : '',
    '</a></li>',
  ].join(''));
  return ['        <ul class="post-feed">', ...items, '        </ul>'].join('\n');
}

export function injectSnapshot(html, block) {
  return injectBetween(html, block, START, END);
}

export async function updateFile(file, fetchImpl = fetch) {
  const res = await fetchImpl(FEED_URL, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Feed request failed with status ${res.status}`);
  const block = renderList(parseFeed(await res.text()));
  const next = injectSnapshot(readFileSync(file, 'utf8'), block);
  writeFileSync(file, next);
  return block;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv[2] || new URL('../index.html', import.meta.url).pathname;
  updateFile(file)
    .then(() => console.log(`Updated Substack list in ${file}`))
    .catch(err => {
      console.error(`Substack list not updated (page left as it was): ${err.message}`);
      process.exit(1);
    });
}
