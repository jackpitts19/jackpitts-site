// Shared helpers for the feed snapshot scripts: turn untrusted feed text into safe HTML.

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[code.toLowerCase()] ?? m;
  });
}

export function toPlainText(raw) {
  const unwrapped = String(raw ?? '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  const noScripts = unwrapped.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '');
  return decodeEntities(noScripts.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : max).trimEnd() + '…';
}

export function isoDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

export function displayDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${MONTHS[Number(m) - 1]} ${d} ${y}`;
}

export function isSafeUrl(url, prefix) {
  return url.startsWith(prefix) && !/[\s"'<>]/.test(url);
}

export function injectBetween(html, block, start, end, indent = '        ') {
  const a = html.indexOf(start);
  const b = html.indexOf(end);
  if (a === -1 || b === -1 || b < a) throw new Error('Snapshot markers not found');
  return html.slice(0, a + start.length) + '\n' + block + '\n' + indent + html.slice(b);
}
