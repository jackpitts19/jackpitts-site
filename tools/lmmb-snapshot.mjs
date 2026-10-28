// Refreshes the episode list on /lower-middle-market-brief/ from Apple's public podcast lookup.
// The show's RSS feed has no per-episode web pages, so episodes link to Apple Podcasts.
// Output is static HTML plus matching JSON-LD. If anything fails, the page is left as it was.
//
// Usage: node tools/lmmb-snapshot.mjs [path/to/lower-middle-market-brief/index.html]

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { toPlainText, escapeHtml, truncate, isoDate, displayDate, isSafeUrl, injectBetween } from './html-utils.mjs';

const LOOKUP_URL = 'https://itunes.apple.com/lookup?id=6801373572&entity=podcastEpisode&limit=50';
const APPLE_PREFIX = 'https://podcasts.apple.com/us/podcast/';
const SERIES_ID = 'https://thejackpitts.com/lower-middle-market-brief/#podcast';
const MAX_EXCERPT = 240;
const FETCH_TIMEOUT_MS = 10000;
const LIST = ['<!-- episodes:start -->', '<!-- episodes:end -->'];
const LD = ['<!-- episodes-ld:start -->', '<!-- episodes-ld:end -->'];

function cleanUrl(raw) {
  try {
    const url = new URL(String(raw));
    url.searchParams.delete('uo');
    return url.toString();
  } catch {
    return '';
  }
}

export function parseEpisodes(json) {
  const results = JSON.parse(json).results;
  if (!Array.isArray(results)) throw new Error('Unexpected lookup response');
  return results
    .filter(r => r && r.wrapperType === 'podcastEpisode')
    .map(r => ({
      title: toPlainText(r.trackName),
      url: cleanUrl(r.trackViewUrl),
      date: isoDate(r.releaseDate),
      minutes: Number.isFinite(r.trackTimeMillis) ? Math.round(r.trackTimeMillis / 60000) : null,
      excerpt: truncate(toPlainText(r.description), MAX_EXCERPT),
    }))
    .filter(e => e.title && e.date && isSafeUrl(e.url, APPLE_PREFIX))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function renderEpisodes(episodes) {
  if (episodes.length === 0) throw new Error('No episodes found');
  const items = episodes.map(e => [
    '      <li>',
    `<a href="${escapeHtml(e.url)}" target="_blank" rel="noopener">`,
    `<span class="ep-meta"><time datetime="${e.date}">${displayDate(e.date)}</time>${e.minutes ? ` · ${e.minutes} min` : ''}</span>`,
    `<span class="ep-title">${escapeHtml(e.title)}</span>`,
    e.excerpt ? `<span class="ep-ex">${escapeHtml(e.excerpt)}</span>` : '',
    '</a></li>',
  ].join(''));
  return ['    <ol class="episodes" reversed>', ...items, '    </ol>'].join('\n');
}

export function renderEpisodesLd(episodes) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Lower Middle Market Brief episodes',
    itemListElement: episodes.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'PodcastEpisode',
        name: e.title,
        url: e.url,
        datePublished: e.date,
        ...(e.minutes ? { timeRequired: `PT${e.minutes}M` } : {}),
        ...(e.excerpt ? { description: e.excerpt } : {}),
        partOfSeries: { '@id': SERIES_ID },
      },
    })),
  };
  const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">\n${json}\n</script>`;
}

export async function updateFile(file, fetchImpl = fetch) {
  const res = await fetchImpl(LOOKUP_URL, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Lookup request failed with status ${res.status}`);
  const episodes = parseEpisodes(await res.text());
  const list = renderEpisodes(episodes);
  const page = readFileSync(file, 'utf8');
  const next = injectBetween(injectBetween(page, list, ...LIST, '    '), renderEpisodesLd(episodes), ...LD, '');
  writeFileSync(file, next);
  return episodes.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv[2] || new URL('../lower-middle-market-brief/index.html', import.meta.url).pathname;
  updateFile(file)
    .then(n => console.log(`Updated ${n} episodes in ${file}`))
    .catch(err => {
      console.error(`Episode list not updated (page left as it was): ${err.message}`);
      process.exit(1);
    });
}
