# Jack Pitts. Personal Site

Personal website for Jack Pitts: Salt Creek Advisory first, then his story, two podcasts, writing, and HelmIQ.

## Structure

- `index.html` is the homepage. Seven chapters (`#/road`, `#/firm`, `#/show`, `#/writing`, `#/machine`, `#/contact`), inline CSS and JS, no build step. All chapter text is in the HTML, so it works without JavaScript.
- `blog/` is hidden (noindex, not linked, not in the sitemap) but every post still loads at its old URL. Writing now lives on Substack.
- `privacy.html` and `disclosures.html` are linked from every footer.
- `assets/` holds images, `blog.css`, and the favicon.
- `tools/` and `docs/` are internal and excluded from the deploy by `.vercelignore`.

## Refresh the "Latest on Substack" list

```
node tools/substack-snapshot.mjs
```

It reads https://thejackpitts.substack.com/feed and rewrites only the block between the `substack:start` and `substack:end` markers in `index.html`. If the feed is down or empty, the page is left exactly as it was. Tests: `node --test tools/substack-snapshot.test.mjs`.

## Run locally

```
python3 -m http.server 8765
```

Then open http://localhost:8765/ (opening the file directly also works, but root-relative links like `/blog/` need a server).

## Deploy

Vercel, from `main`. `vercel.json` handles the www-to-apex and `/index.html` redirects.
