import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseEpisodes, renderEpisodes, renderEpisodesLd, updateFile } from './lmmb-snapshot.mjs';

const APPLE = 'https://podcasts.apple.com/us/podcast/';
const show = { wrapperType: 'track', kind: 'podcast', collectionName: 'Lower Middle Market Brief' };
const ep = (over = {}) => ({
  wrapperType: 'podcastEpisode',
  trackName: '62 Lower Middle Market Deals | Aug. 24–30, 2026',
  trackViewUrl: `${APPLE}62-deals/id6801373572?i=1000786896170&uo=4`,
  releaseDate: '2026-08-31T02:39:10Z',
  trackTimeMillis: 701000,
  description: '<p><b>62 deals in one week.</b></p><p>Platform investments, add-ons, and exits.</p>',
  ...over,
});
const lookup = (...results) => JSON.stringify({ resultCount: results.length, results });
const PAGE = 'a<!-- episodes:start -->OLD<!-- episodes:end -->b<!-- episodes-ld:start -->OLDLD<!-- episodes-ld:end -->c';

test('parses Apple episodes into title, url, date, minutes, and excerpt', () => {
  // Arrange
  const json = lookup(show, ep());
  // Act
  const [e] = parseEpisodes(json);
  // Assert
  assert.equal(e.title, '62 Lower Middle Market Deals | Aug. 24–30, 2026');
  assert.equal(e.url, `${APPLE}62-deals/id6801373572?i=1000786896170`);
  assert.equal(e.date, '2026-08-31');
  assert.equal(e.minutes, 12);
  assert.equal(e.excerpt, '62 deals in one week. Platform investments, add-ons, and exits.');
});

test('skips the show record and episodes with unsafe or foreign links', () => {
  const json = lookup(show, ep(), ep({ trackViewUrl: 'javascript:alert(1)' }), ep({ trackViewUrl: 'https://evil.example.com/x' }));
  assert.equal(parseEpisodes(json).length, 1);
});

test('sorts newest first', () => {
  const json = lookup(ep({ trackName: 'Old', releaseDate: '2026-08-14T00:00:00Z' }), ep({ trackName: 'New', releaseDate: '2026-08-31T00:00:00Z' }));
  assert.deepEqual(parseEpisodes(json).map(e => e.title), ['New', 'Old']);
});

test('strips tags and escapes episode text in the rendered list', () => {
  const html = renderEpisodes(parseEpisodes(lookup(ep({ trackName: '<img src=x onerror=alert(1)>Tom & Jerry <3 "deals"' }))));
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('onerror'));
  assert.ok(html.includes('Tom &amp; Jerry &lt;3 &quot;deals&quot;'));
});

test('structured data is valid JSON and cannot break out of its script tag', () => {
  const ld = renderEpisodesLd(parseEpisodes(lookup(ep({ trackName: 'a</script><script>alert(1)</script>' }))));
  const json = ld.replace(/^\s*<script type="application\/ld\+json">/, '').replace(/<\/script>\s*$/, '');
  assert.ok(!json.includes('</script'));
  const data = JSON.parse(json);
  assert.equal(data['@type'], 'ItemList');
  assert.equal(data.itemListElement[0].item['@type'], 'PodcastEpisode');
  assert.equal(data.itemListElement[0].item.partOfSeries['@id'], 'https://thejackpitts.com/lower-middle-market-brief/#podcast');
});

test('throws when there are no episodes', () => {
  assert.throws(() => renderEpisodes(parseEpisodes(lookup(show))), /no episodes/i);
});

test('rejects malformed JSON', () => {
  assert.throws(() => parseEpisodes('<html>oops</html>'));
});

test('leaves the page untouched when the lookup fails', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'lmmb-'));
  const file = join(dir, 'index.html');
  writeFileSync(file, PAGE);
  await assert.rejects(updateFile(file, async () => ({ ok: false, status: 500, text: async () => '' })), /500/);
  assert.equal(readFileSync(file, 'utf8'), PAGE);
});

test('updates both the list and the structured data on success', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'lmmb-'));
  const file = join(dir, 'index.html');
  writeFileSync(file, PAGE);
  await updateFile(file, async () => ({ ok: true, status: 200, text: async () => lookup(show, ep()) }));
  const out = readFileSync(file, 'utf8');
  assert.ok(!out.includes('OLD'));
  assert.ok(out.includes('62 Lower Middle Market Deals'));
  assert.ok(out.includes('"PodcastEpisode"'));
});
