# Jack Pitts. Personal Site

Personal website for Jack Pitts: Salt Creek Advisory first, then his story, two podcasts, writing, and HelmIQ.

## Structure

- `index.html` is the homepage. Seven chapters (`#/firm`, `#/road`, `#/show`, `#/writing`, `#/machine`, `#/contact`), inline CSS and JS, no build step. All chapter text is in the HTML, so it works without JavaScript.
- `blog/` holds the longer original articles. Shorter personal posts live on Substack, not here.
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
