import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFeed, renderList, injectSnapshot, updateFile } from './substack-snapshot.mjs';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const item = (title, link, date, desc) => `<item><title><![CDATA[${title}]]></title><description><![CDATA[${desc}]]></description><link>${link}</link><pubDate>${date}</pubDate></item>`;
const feed = (...items) => `<?xml version="1.0"?><rss><channel><title>Jack Pitts</title>${items.join('')}</channel></rss>`;

test('parses title, link, date, and excerpt from RSS items', () => {
  // Arrange
  const xml = feed(item('Life&#8217;s Good. I&#8217;m Stressed.', 'https://thejackpitts.substack.com/p/lifes-good', 'Sun, 25 Oct 2026 14:00:00 GMT', 'Trying to build something big.'));
  // Act
  const [post] = parseFeed(xml);
  // Assert
  assert.equal(post.title, 'Life’s Good. I’m Stressed.');
  assert.equal(post.url, 'https://thejackpitts.substack.com/p/lifes-good');
  assert.equal(post.date, '2026-10-25');
  assert.equal(post.excerpt, 'Trying to build something big.');
});

test('strips HTML from excerpts and escapes output', () => {
  const xml = feed(item('<b>Bold</b> & "quoted"', 'https://thejackpitts.substack.com/p/x', 'Sun, 25 Oct 2026 14:00:00 GMT', '<p>Hi <script>alert(1)</script>there</p>'));
  const html = renderList(parseFeed(xml));
  assert.ok(!html.includes('<script'));
  assert.ok(!html.includes('<b>'));
  assert.ok(html.includes('Bold &amp; &quot;quoted&quot;'));
  assert.ok(html.includes('Hi there'));
});

test('drops items whose link is not on the Substack publication', () => {
  const xml = feed(
    item('Good', 'https://thejackpitts.substack.com/p/good', 'Sun, 25 Oct 2026 14:00:00 GMT', 'ok'),
    item('Bad', 'javascript:alert(1)', 'Sun, 25 Oct 2026 14:00:00 GMT', 'no'),
    item('Elsewhere', 'https://evil.example.com/p/x', 'Sun, 25 Oct 2026 14:00:00 GMT', 'no'));
  assert.deepEqual(parseFeed(xml).map(p => p.title), ['Good']);
});

test('truncates long excerpts and limits the list length', () => {
  const long = 'word '.repeat(80);
  const items = Array.from({ length: 6 }, (_, i) => item(`Post ${i}`, `https://thejackpitts.substack.com/p/${i}`, 'Sun, 25 Oct 2026 14:00:00 GMT', long));
  const posts = parseFeed(feed(...items));
  assert.ok(posts[0].excerpt.length <= 161);
  assert.equal((renderList(posts, 3).match(/<li>/g) || []).length, 3);
});

test('throws when the feed has no usable posts', () => {
  assert.throws(() => renderList(parseFeed('<html>not a feed</html>')), /no posts/i);
});

test('injects between markers and leaves the rest of the page alone', () => {
  const page = 'before<!-- substack:start -->old<!-- substack:end -->after';
  assert.equal(injectSnapshot(page, 'NEW'), 'before<!-- substack:start -->\nNEW\n        <!-- substack:end -->after');
});

test('throws when markers are missing', () => {
  assert.throws(() => injectSnapshot('no markers here', 'x'), /markers/i);
});

test('leaves the file untouched when the feed fetch fails', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'substack-'));
  const file = join(dir, 'index.html');
  const original = 'a<!-- substack:start -->KEEP<!-- substack:end -->b';
  writeFileSync(file, original);
  const failingFetch = async () => { throw new Error('network down'); };
  await assert.rejects(updateFile(file, failingFetch), /network down/);
  assert.equal(readFileSync(file, 'utf8'), original);
});

test('leaves the file untouched when the feed returns a non-200 status', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'substack-'));
  const file = join(dir, 'index.html');
  const original = 'a<!-- substack:start -->KEEP<!-- substack:end -->b';
  writeFileSync(file, original);
  const badFetch = async () => ({ ok: false, status: 503, text: async () => '' });
  await assert.rejects(updateFile(file, badFetch), /503/);
  assert.equal(readFileSync(file, 'utf8'), original);
});
