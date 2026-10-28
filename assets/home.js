// Chapter navigation for the homepage. Loaded at the end of <body>.
document.getElementById('yr').textContent = new Date().getFullYear();

const DEFAULT_TITLE = document.title;
const THEMES = {
  home:    { theme:'home',    label:'Prologue',   title:'Jack Pitts' },
  firm:    { theme:'firm',    label:'Chapter 02', title:'Salt Creek Advisory', docTitle:'Salt Creek Advisory · Jack Pitts' },
  road:    { theme:'home',    label:'Chapter 01', title:'The Road', docTitle:'The Road · Jack Pitts' },
  show:    { theme:'show',    label:'Chapter 03', title:'Podcasts', docTitle:'Podcasts · Jack Pitts' },
  writing: { theme:'home',    label:'Chapter 04', title:'Writing', docTitle:'Writing · Jack Pitts' },
  machine: { theme:'machine', label:'Chapter 05', title:'HelmIQ', docTitle:'HelmIQ · Jack Pitts' },
  contact: { theme:'contact', label:'Epilogue',   title:'Contact', docTitle:'Contact · Jack Pitts' }
};

const ORDER = ['home', 'road', 'firm', 'show', 'writing', 'machine', 'contact'];
let current = 'home';
const wipe = document.getElementById('wipe');
const wipeLabel = document.getElementById('wipeLabel');
const wipeTitle = document.getElementById('wipeTitle');
let busy = false;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

function focusHeading(pg) {
  const h = pg.querySelector('h1, h2.display');
  if (!h) return;
  h.setAttribute('tabindex', '-1');
  h.focus({ preventScroll: true });
}

function show(key, animate = true, push = true, focus = true) {
  const cfg = THEMES[key];
  if (!cfg || busy) return;
  if (reduceMotion.matches) animate = false;
  const swap = () => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pg = document.getElementById('pg-' + key);
    pg.querySelectorAll('.rise').forEach(el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
    pg.querySelectorAll('.skyline i, .stop, .timeline').forEach(el => { el.style.animationName = 'none'; void el.offsetWidth; el.style.animationName = ''; });
    pg.classList.add('active');
    document.body.dataset.theme = cfg.theme;
    document.querySelectorAll('.tab').forEach(t => {
      const isActive = t.dataset.go === key;
      t.classList.toggle('active', isActive);
      if (isActive) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    const i = ORDER.indexOf(key);
    document.getElementById('counterNum').textContent = String(i).padStart(2, '0') + ' / ' + String(ORDER.length - 1).padStart(2, '0');
    document.title = cfg.docTitle || DEFAULT_TITLE;
    current = key;
    scrollTo(0, 0);
    if (push) history.replaceState(null, '', key === 'home' ? location.pathname : '#/' + key);
    if (focus) focusHeading(pg);
  };
  if (!animate) { swap(); return; }
  busy = true;
  wipeLabel.textContent = cfg.label;
  wipeTitle.textContent = cfg.title;
  wipe.classList.remove('go'); void wipe.offsetWidth;
  wipe.classList.add('go');
  setTimeout(swap, 460);
  setTimeout(() => { busy = false; wipe.classList.remove('go'); }, 1050);
}

document.querySelectorAll('[data-go]').forEach(el =>
  el.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    if (el.dataset.go === current) { focusHeading(document.getElementById('pg-' + current)); return; }
    show(el.dataset.go);
  }));

addEventListener('hashchange', () => {
  const key = location.hash.replace('#/', '') || 'home';
  if (THEMES[key] && key !== current) show(key);
});

const initial = location.hash.replace('#/', '');
if (THEMES[initial] && initial !== 'home') show(initial, false, true, false);

// arrow keys flip chapters
addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (e.target.matches('input, textarea, select, [contenteditable]')) return;
  const i = ORDER.indexOf(current);
  if (e.key === 'ArrowRight' && i < ORDER.length - 1) show(ORDER[i + 1]);
  if (e.key === 'ArrowLeft' && i > 0) show(ORDER[i - 1]);
});

// 3D tilt on the headshot
const hs = document.getElementById('headshot');
const hsImg = document.getElementById('headshotImg');
if (hs && matchMedia('(hover:hover)').matches) {
  hs.addEventListener('mousemove', e => {
    const r = hs.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    hsImg.style.transform = 'rotateY(' + (x * 9) + 'deg) rotateX(' + (-y * 9) + 'deg) scale(1.02)';
  });
  hs.addEventListener('mouseleave', () => { hsImg.style.transform = ''; });
}
