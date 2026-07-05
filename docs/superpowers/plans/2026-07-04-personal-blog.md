# Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch a six-post personal blog at `/blog/` on thejackpitts.com, written in Jack's voice, with real crawlable per-post URLs and baseline SEO/AEO metadata.

**Architecture:** Static HTML files only, no build step, no dependencies — matches the existing site. A new `assets/blog.css` holds the shared "Journal" visual style; six post files plus a `blog/index.html` listing page live in a new `blog/` directory; two small edits to the existing `index.html` link the blog in from the main nav and footer.

**Tech Stack:** Plain HTML/CSS, Google Fonts (Fraunces/Inter/JetBrains Mono, already used site-wide), schema.org JSON-LD for structured data. No JavaScript framework, no server.

## Global Constraints

- No build step, no npm dependencies, no CMS — hand-written static HTML/CSS only, per the site's existing README.
- Domain is `https://thejackpitts.com` (confirmed via Vercel dashboard) — use this for all canonical URLs and JSON-LD.
- Deploys automatically on push to `main` via Vercel — no manual deploy step needed, but **pushing to `main` triggers a real production deploy and must get explicit go-ahead from Jack at that moment**, not assumed in advance.
- No fabricated claims about real third parties anywhere. Post 6 specifically must not rank or name any third party.
- No AI-authorship disclosure on any post. Every post ends signed "— Jack Pitts".
- Voice: casual-but-professional, first person, short sentences, matches the tone already established in the main site's copy (e.g. `index.html` prologue/road sections).
- Word counts: Posts 1–5 are ~250–350 words each. Post 6 is ~400–600 words.

---

## Task 1: Shared blog stylesheet

**Files:**
- Create: `assets/blog.css`

**Interfaces:**
- Produces: CSS classes `.wrap`, `.blog-nav`, `.post-head`, `.stamp`, `.post-body`, `.byline`, `.post-list`, `.blog-foot` — every later task (2–8) links this file and uses these exact class names.

- [ ] **Step 1: Write the stylesheet**

Create `assets/blog.css` with this exact content:

```css
:root{
  --paper:#f4f1ea;
  --paper-deep:#ece7da;
  --ink:#0e0d0a;
  --ink-soft:#4a463c;
  --peri:#7b8fe4;
  --peri-deep:#5a72d8;
  --orange:#d87a2c;
  --hairline:rgba(14,13,10,.16);
  --serif:'Fraunces',Georgia,serif;
  --sans:'Inter',-apple-system,sans-serif;
  --mono:'JetBrains Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%}
body{
  background:var(--paper-deep);color:var(--ink);
  font-family:var(--sans);line-height:1.7;
  -webkit-font-smoothing:antialiased;
}
a{color:inherit}
.wrap{max-width:760px;margin:0 auto;padding:0 28px}

.blog-nav{padding:26px 0 0}
.blog-nav a{
  font-family:var(--mono);font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;
  text-decoration:none;opacity:.6;transition:opacity .2s;
}
.blog-nav a:hover{opacity:1;color:var(--peri-deep)}

.post-head{
  margin-top:36px;padding:34px 34px 30px;background:var(--paper);
  position:relative;border:1px solid var(--hairline);
}
.post-head::before{
  content:"";position:absolute;top:0;right:0;width:0;height:0;
  border-style:solid;border-width:0 30px 30px 0;
  border-color:transparent #d8cfae transparent transparent;
}
.stamp{
  font-family:var(--mono);font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;
  background:var(--ink);color:var(--paper);display:inline-block;padding:5px 12px;margin-bottom:20px;
}
.post-head h1{
  font-family:var(--serif);font-style:italic;font-weight:400;
  font-size:clamp(1.7rem,4vw,2.5rem);line-height:1.2;max-width:20ch;
}

.post-body{margin-top:8px;padding:6px 34px 50px;background:var(--paper)}
.post-body p{
  font-size:1rem;line-height:1.8;color:var(--ink-soft);max-width:36ch;margin-bottom:16px;
}
.post-body p:first-of-type::first-letter{
  font-family:var(--serif);font-size:2.8rem;font-weight:600;color:var(--orange);
  float:left;line-height:.78;padding-right:8px;
}
.post-body h2{
  font-family:var(--serif);font-weight:600;font-size:1.3rem;margin:28px 0 12px;max-width:28ch;
}
.post-body ul{margin:0 0 16px 1.1em;max-width:36ch}
.post-body li{font-size:.98rem;line-height:1.7;color:var(--ink-soft);margin-bottom:6px}
.byline{
  margin-top:10px;font-family:var(--mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;opacity:.6;
}

.post-list{list-style:none;margin-top:40px}
.post-list li{border-top:1px solid var(--hairline)}
.post-list li:last-child{border-bottom:1px solid var(--hairline)}
.post-list a{display:block;padding:26px 4px;text-decoration:none;transition:padding .2s}
.post-list a:hover{padding-left:14px}
.post-list .p-date{font-family:var(--mono);font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:var(--peri-deep)}
.post-list h2{font-family:var(--serif);font-weight:600;font-size:1.3rem;margin:8px 0 6px}
.post-list p{font-size:.92rem;color:var(--ink-soft);max-width:48ch}

footer.blog-foot{
  border-top:1px solid var(--hairline);padding:26px 0 60px;margin-top:20px;
  font-family:var(--mono);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;opacity:.55;
}
```

- [ ] **Step 2: Verify the file is well-formed CSS**

Run: `grep -c "^}" assets/blog.css`
Expected: a number greater than 15 (one closing brace per rule block — confirms the file isn't truncated).

- [ ] **Step 3: Commit**

```bash
git add assets/blog.css
git commit -m "feat: add shared Journal-style stylesheet for blog"
```

---

## Task 2: Post 1 — "Who I Am, and Why I'm Doing This" (establishes the post template)

**Files:**
- Create: `blog/who-i-am-and-why.html`

**Interfaces:**
- Consumes: `assets/blog.css` classes from Task 1.
- Produces: the HTML skeleton pattern (head boilerplate, JSON-LD block, `.blog-nav`/`.post-head`/`.post-body`/`.byline` structure) that Tasks 3–7 repeat exactly, changing only title/meta/date/content.

- [ ] **Step 1: Write the post file**

Create `blog/who-i-am-and-why.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Who I Am, and Why I'm Doing This · Jack Pitts</title>
<meta name="description" content="Jack Pitts on growing up middle class, why he left private equity, and what actually motivates Salt Creek Advisory and HelmIQ.">
<link rel="canonical" href="https://thejackpitts.com/blog/who-i-am-and-why.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/blog.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Who I Am, and Why I'm Doing This",
  "datePublished": "2026-06-09",
  "author": { "@type": "Person", "name": "Jack Pitts" },
  "description": "Jack Pitts on growing up middle class, why he left private equity, and what actually motivates Salt Creek Advisory and HelmIQ."
}
</script>
</head>
<body>
<div class="wrap">
  <nav class="blog-nav"><a href="index.html">← Blog</a></nav>
  <div class="post-head">
    <div class="stamp">JUN 09 2026 · CHICAGO</div>
    <h1>Who I am, and why I'm doing this</h1>
  </div>
  <div class="post-body">
    <!-- BODY: write 250-350 words here, first person, casual-but-professional, matching the
         voice of the main site's prologue/road copy. Must include these facts:
         - Grew up middle class, not from money, not from a finance family.
         - Dad worked in PR. Mom works in insurance claims. One grandfather was a union
           electrician. Other grandparents worked for the government.
         - Nobody in the family had done a deal before Jack did.
         - Went into private equity in New York, realized the owners (not the fund people)
           were building the real wealth and having more fun doing it — that's the actual
           "why" behind Salt Creek Advisory and HelmIQ.
         - Tone: grounded, not falsely modest, not braggy about being self-made either. -->
    <div class="byline">— Jack Pitts</div>
  </div>
</div>
<footer class="blog-foot">
  <div class="wrap">© <span id="yr"></span> Jack Pitts · <a href="../index.html">thejackpitts.com</a></div>
</footer>
<script>document.getElementById('yr').textContent = new Date().getFullYear();</script>
</body>
</html>
```

Replace the HTML comment inside `.post-body` with actual `<p>` paragraphs (no HTML comments left in the shipped file) covering everything listed in the brief, ending with the `.byline` div unchanged.

- [ ] **Step 2: Verify required structural elements are present**

Run:
```bash
grep -c "<title>" blog/who-i-am-and-why.html
grep -c "meta name=\"description\"" blog/who-i-am-and-why.html
grep -c "rel=\"canonical\"" blog/who-i-am-and-why.html
grep -c "application/ld+json" blog/who-i-am-and-why.html
grep -c "byline" blog/who-i-am-and-why.html
grep -c "<!--" blog/who-i-am-and-why.html
```
Expected: first five commands each return `1` or more; the last (`<!--`) returns `0` — confirms the placeholder comment was replaced with real content.

- [ ] **Step 3: Check word count is in range**

Run: `python3 -c "import re,sys; t=open('blog/who-i-am-and-why.html').read(); body=re.search(r'class=\"post-body\">(.*?)<div class=\"byline\"', t, re.S).group(1); words=len(re.sub('<[^>]+>',' ',body).split()); print(words)"`
Expected: a number between 200 and 400 (allowing some margin around the 250–350 target).

- [ ] **Step 4: Visually confirm rendering**

Run: `cd /Users/jackpitts/dev/jackpitts-site && python3 -m http.server 8420 &` then open `http://localhost:8420/blog/who-i-am-and-why.html` in a browser. Confirm: dog-eared header card, drop-cap first letter, mono date stamp, byline at the bottom. Stop the server after (`kill %1` or find the process on port 8420).

- [ ] **Step 5: Commit**

```bash
git add blog/who-i-am-and-why.html
git commit -m "feat: add blog post - who I am, and why I'm doing this"
```

---

## Task 3: Post 2 — "The Firm: Salt Creek Advisory"

**Files:**
- Create: `blog/salt-creek-advisory.html`

**Interfaces:**
- Consumes: `assets/blog.css` (Task 1), same HTML skeleton pattern as Task 2.

- [ ] **Step 1: Write the post file**

Create `blog/salt-creek-advisory.html` using the exact same skeleton as Task 2 (head boilerplate, `<link rel="stylesheet" href="../assets/blog.css">`, JSON-LD script, `.blog-nav`/`.post-head`/`.post-body`/`.byline` structure, footer, year script), with these values:

- `<title>`: `The Firm: Salt Creek Advisory · Jack Pitts`
- meta description: `Why Jack Pitts and his brother built Salt Creek Advisory, an M&A firm for family-owned and founder-owned businesses in the lower middle market.`
- canonical: `https://thejackpitts.com/blog/salt-creek-advisory.html`
- JSON-LD `headline`: `The Firm: Salt Creek Advisory`, `datePublished`: `2026-06-17`, `description` matching the meta description above
- `.stamp`: `JUN 17 2026 · CHICAGO`
- `<h1>`: `The firm: Salt Creek Advisory`

Body copy (250–350 words, replacing the same kind of placeholder comment as Task 2, no comment left in shipped file) must cover:
- "A family business that sells family businesses" — the brother partnership (Jack + his brother running it together).
- Lower-middle-market focus, sell-side representation for family- and founder-owned businesses.
- Why no-junior-team/no-handoffs matters to an owner going through what is usually a once-in-a-lifetime sale — the people on the first call are the people who close the deal.
- End with the `.byline` div: `— Jack Pitts`.

- [ ] **Step 2: Verify required structural elements are present**

```bash
grep -c "<title>" blog/salt-creek-advisory.html
grep -c "meta name=\"description\"" blog/salt-creek-advisory.html
grep -c "rel=\"canonical\"" blog/salt-creek-advisory.html
grep -c "application/ld+json" blog/salt-creek-advisory.html
grep -c "byline" blog/salt-creek-advisory.html
grep -c "<!--" blog/salt-creek-advisory.html
```
Expected: first five return `1`+, last returns `0`.

- [ ] **Step 3: Check word count is in range**

Run: `python3 -c "import re; t=open('blog/salt-creek-advisory.html').read(); body=re.search(r'class=\"post-body\">(.*?)<div class=\"byline\"', t, re.S).group(1); print(len(re.sub('<[^>]+>',' ',body).split()))"`
Expected: 200–400.

- [ ] **Step 4: Commit**

```bash
git add blog/salt-creek-advisory.html
git commit -m "feat: add blog post - the firm: Salt Creek Advisory"
```

---

## Task 4: Post 3 — "Five Cities in Two Years"

**Files:**
- Create: `blog/five-cities-two-years.html`

**Interfaces:**
- Consumes: `assets/blog.css` (Task 1), same skeleton as Task 2.

- [ ] **Step 1: Write the post file**

Same skeleton as Task 2, with:

- `<title>`: `Five Cities in Two Years · Jack Pitts`
- meta description: `Chicago, Nashville, London, New York, and back to Chicago — Jack Pitts on what two years of moving taught him.`
- canonical: `https://thejackpitts.com/blog/five-cities-two-years.html`
- JSON-LD `headline`: `Five Cities in Two Years`, `datePublished`: `2026-06-25`, matching description
- `.stamp`: `JUN 25 2026 · CHICAGO`
- `<h1>`: `Five cities in two years`

Body copy (250–350 words) must cover:
- The actual path: Chicago (grew up) → Nashville (Vanderbilt) → London (four months) → New York (private equity) → Chicago (now).
- What moving that much taught him — reflection on restlessness, not a travelogue.
- Landing back in Chicago felt like a choice, not a default — ties to the "next part gets written back home" theme already on the main site.
- End with `.byline`: `— Jack Pitts`.

- [ ] **Step 2: Verify required structural elements**

```bash
grep -c "<title>" blog/five-cities-two-years.html
grep -c "meta name=\"description\"" blog/five-cities-two-years.html
grep -c "rel=\"canonical\"" blog/five-cities-two-years.html
grep -c "application/ld+json" blog/five-cities-two-years.html
grep -c "byline" blog/five-cities-two-years.html
grep -c "<!--" blog/five-cities-two-years.html
```
Expected: first five return `1`+, last returns `0`.

- [ ] **Step 3: Check word count is in range**

Run: `python3 -c "import re; t=open('blog/five-cities-two-years.html').read(); body=re.search(r'class=\"post-body\">(.*?)<div class=\"byline\"', t, re.S).group(1); print(len(re.sub('<[^>]+>',' ',body).split()))"`
Expected: 200–400.

- [ ] **Step 4: Commit**

```bash
git add blog/five-cities-two-years.html
git commit -m "feat: add blog post - five cities in two years"
```

---

## Task 5: Post 4 — "Imposter Syndrome, Loneliness, and Feeling Blessed"

**Files:**
- Create: `blog/imposter-lonely-grateful.html`

**Interfaces:**
- Consumes: `assets/blog.css` (Task 1), same skeleton as Task 2.

- [ ] **Step 1: Write the post file**

Same skeleton as Task 2, with:

- `<title>`: `Imposter Syndrome, Loneliness, and Feeling Blessed · Jack Pitts`
- meta description: `An honest post from Jack Pitts on working alone in Chicago with his dog Harvey, feeling disconnected sometimes, and staying grateful anyway.`
- canonical: `https://thejackpitts.com/blog/imposter-lonely-grateful.html`
- JSON-LD `headline`: `Imposter Syndrome, Loneliness, and Feeling Blessed`, `datePublished`: `2026-07-04`, matching description
- `.stamp`: `JUL 04 2026 · CHICAGO`
- `<h1>`: `Imposter syndrome, loneliness, and feeling blessed`

Body copy (250–350 words) — the most vulnerable post — must cover:
- The core, literal beat: alone in Chicago right now, dog Harvey, just working.
- Feeling disconnected from friends/peers right now — explicitly NOT framed as superiority or "better than anyone," just an honest, unglamorous description of where he is.
- Imposter syndrome — some honest self-doubt, not resolved neatly, no forced silver lining in the middle of the post.
- Close on real gratitude — lonely in the moment, genuinely blessed for the position he's built. The ending should feel earned, not tacked on.
- End with `.byline`: `— Jack Pitts`.

- [ ] **Step 2: Verify required structural elements**

```bash
grep -c "<title>" blog/imposter-lonely-grateful.html
grep -c "meta name=\"description\"" blog/imposter-lonely-grateful.html
grep -c "rel=\"canonical\"" blog/imposter-lonely-grateful.html
grep -c "application/ld+json" blog/imposter-lonely-grateful.html
grep -c "byline" blog/imposter-lonely-grateful.html
grep -c "<!--" blog/imposter-lonely-grateful.html
grep -c "Harvey" blog/imposter-lonely-grateful.html
```
Expected: all six non-comment checks return `1`+ (Harvey must actually appear in the text), the `<!--` check returns `0`.

- [ ] **Step 3: Check word count is in range**

Run: `python3 -c "import re; t=open('blog/imposter-lonely-grateful.html').read(); body=re.search(r'class=\"post-body\">(.*?)<div class=\"byline\"', t, re.S).group(1); print(len(re.sub('<[^>]+>',' ',body).split()))"`
Expected: 200–400.

- [ ] **Step 4: Commit**

```bash
git add blog/imposter-lonely-grateful.html
git commit -m "feat: add blog post - imposter syndrome, loneliness, and feeling blessed"
```

---

## Task 6: Post 5 — "Any Idea, Any AI"

**Files:**
- Create: `blog/any-idea-any-ai.html`

**Interfaces:**
- Consumes: `assets/blog.css` (Task 1), same skeleton as Task 2.

- [ ] **Step 1: Write the post file**

Same skeleton as Task 2, with:

- `<title>`: `Any Idea, Any AI · Jack Pitts`
- meta description: `Jack Pitts on how AI is democratizing who gets to build — if you understand the idea, you can build it yourself now.`
- canonical: `https://thejackpitts.com/blog/any-idea-any-ai.html`
- JSON-LD `headline`: `Any Idea, Any AI`, `datePublished`: `2026-07-08`, matching description
- `.stamp`: `JUL 08 2026 · CHICAGO`
- `<h1>`: `Any idea, any AI`

Body copy (250–350 words) must cover:
- The core claim: AI is democratizing ideas — anyone with a real idea and enough understanding of it can now go build it themselves, without needing permission, capital, or a technical co-founder in the old sense.
- Ties to HelmIQ's own origin — built the tool because building it themselves was suddenly possible, not because they had a software team.
- Genuine excitement, not hype-speak — grounded in his own experience building HelmIQ, not abstract futurism.
- End with `.byline`: `— Jack Pitts`.

- [ ] **Step 2: Verify required structural elements**

```bash
grep -c "<title>" blog/any-idea-any-ai.html
grep -c "meta name=\"description\"" blog/any-idea-any-ai.html
grep -c "rel=\"canonical\"" blog/any-idea-any-ai.html
grep -c "application/ld+json" blog/any-idea-any-ai.html
grep -c "byline" blog/any-idea-any-ai.html
grep -c "<!--" blog/any-idea-any-ai.html
```
Expected: first five return `1`+, last returns `0`.

- [ ] **Step 3: Check word count is in range**

Run: `python3 -c "import re; t=open('blog/any-idea-any-ai.html').read(); body=re.search(r'class=\"post-body\">(.*?)<div class=\"byline\"', t, re.S).group(1); print(len(re.sub('<[^>]+>',' ',body).split()))"`
Expected: 200–400.

- [ ] **Step 4: Commit**

```bash
git add blog/any-idea-any-ai.html
git commit -m "feat: add blog post - any idea, any AI"
```

---

## Task 7: Post 6 — "How AI Is Actually Changing Lower-Middle-Market Dealmaking" (the AEO piece)

**Files:**
- Create: `blog/ai-lower-middle-market-ma.html`

**Interfaces:**
- Consumes: `assets/blog.css` (Task 1) — including `.post-body h2` and `.post-body ul` classes (unused by Posts 1–5, used here).

- [ ] **Step 1: Write the post file**

Same skeleton as Task 2 (head boilerplate, stylesheet link, JSON-LD, `.blog-nav`/`.post-head`/`.byline`/footer), but the `.post-body` is structured with `<h2>` subheads and short paragraphs/lists rather than pure diary prose. Values:

- `<title>`: `How AI Is Actually Changing Lower-Middle-Market Dealmaking · Jack Pitts`
- meta description: `A clear-eyed look at where AI actually helps in M&A sourcing, diligence, and follow-up in the lower middle market — and where it doesn't replace judgment, from Jack Pitts of Salt Creek Advisory and HelmIQ.`
- canonical: `https://thejackpitts.com/blog/ai-lower-middle-market-ma.html`
- JSON-LD `headline`: `How AI Is Actually Changing Lower-Middle-Market Dealmaking`, `datePublished`: `2026-07-10`, matching description
- `.stamp`: `JUL 10 2026 · CHICAGO`
- `<h1>`: `How AI is actually changing lower-middle-market dealmaking`

Body content (400–600 words) — this is the AEO-critical post, so structure matters as much as content:
- Open with a direct 1–2 sentence answer to "is AI actually changing M&A in the lower middle market" — no throat-clearing intro paragraph.
- `<h2>Where it actually helps</h2>` — concrete examples grounded in Salt Creek Advisory / HelmIQ's real work: organizing companies/contacts/notes, drafting follow-ups, keeping a pipeline current. Can use a `<ul>` list here.
- `<h2>Where it doesn't replace judgment</h2>` — sourcing relationships, negotiation, reading an owner's real motivation for selling — things AI doesn't do.
- `<h2>What this means if you're doing deals right now</h2>` — practical closing guidance, not a sales pitch.
- **Constraint: no named third parties, no rankings, no invented statistics.** Every claim must be either Jack's own stated opinion or something directly tied to Salt Creek Advisory/HelmIQ's actual described work (per the main site's existing copy in `index.html`).
- End with `.byline`: `— Jack Pitts`.

- [ ] **Step 2: Verify required structural elements**

```bash
grep -c "<title>" blog/ai-lower-middle-market-ma.html
grep -c "meta name=\"description\"" blog/ai-lower-middle-market-ma.html
grep -c "rel=\"canonical\"" blog/ai-lower-middle-market-ma.html
grep -c "application/ld+json" blog/ai-lower-middle-market-ma.html
grep -c "<h2>" blog/ai-lower-middle-market-ma.html
grep -c "byline" blog/ai-lower-middle-market-ma.html
grep -c "<!--" blog/ai-lower-middle-market-ma.html
```
Expected: first six return `1`+ (specifically `<h2>` count should be `3`), last returns `0`.

- [ ] **Step 3: Check word count is in range**

Run: `python3 -c "import re; t=open('blog/ai-lower-middle-market-ma.html').read(); body=re.search(r'class=\"post-body\">(.*?)<div class=\"byline\"', t, re.S).group(1); print(len(re.sub('<[^>]+>',' ',body).split()))"`
Expected: 350–700 (allowing margin around the 400–600 target).

- [ ] **Step 4: Commit**

```bash
git add blog/ai-lower-middle-market-ma.html
git commit -m "feat: add blog post - how AI is actually changing lower-middle-market dealmaking"
```

---

## Task 8: Blog index page

**Files:**
- Create: `blog/index.html`

**Interfaces:**
- Consumes: `assets/blog.css` `.post-list` classes (Task 1); links to all six files from Tasks 2–7 by their exact filenames.

- [ ] **Step 1: Write the index page**

Create `blog/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog · Jack Pitts</title>
<meta name="description" content="Notes from Jack Pitts on building Salt Creek Advisory and HelmIQ, moving five times in two years, and where AI is actually changing dealmaking.">
<link rel="canonical" href="https://thejackpitts.com/blog/index.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/blog.css">
</head>
<body>
<div class="wrap">
  <nav class="blog-nav"><a href="../index.html">← Jack Pitts</a></nav>
  <div class="post-head" style="margin-top:36px">
    <div class="stamp">THE BLOG</div>
    <h1>Notes, so far</h1>
  </div>
  <ul class="post-list">
    <li>
      <a href="who-i-am-and-why.html">
        <div class="p-date">JUN 09 2026</div>
        <h2>Who I Am, and Why I'm Doing This</h2>
        <p>Growing up middle class, leaving private equity, and what actually motivates Salt Creek Advisory and HelmIQ.</p>
      </a>
    </li>
    <li>
      <a href="salt-creek-advisory.html">
        <div class="p-date">JUN 17 2026</div>
        <h2>The Firm: Salt Creek Advisory</h2>
        <p>A family business that sells family businesses — why my brother and I built it this way.</p>
      </a>
    </li>
    <li>
      <a href="five-cities-two-years.html">
        <div class="p-date">JUN 25 2026</div>
        <h2>Five Cities in Two Years</h2>
        <p>Chicago, Nashville, London, New York, and back to Chicago — what two years of moving taught me.</p>
      </a>
    </li>
    <li>
      <a href="imposter-lonely-grateful.html">
        <div class="p-date">JUL 04 2026</div>
        <h2>Imposter Syndrome, Loneliness, and Feeling Blessed</h2>
        <p>Working alone in Chicago with my dog Harvey, feeling disconnected sometimes, staying grateful anyway.</p>
      </a>
    </li>
    <li>
      <a href="any-idea-any-ai.html">
        <div class="p-date">JUL 08 2026</div>
        <h2>Any Idea, Any AI</h2>
        <p>How AI is democratizing who gets to build — if you understand the idea, you can build it yourself now.</p>
      </a>
    </li>
    <li>
      <a href="ai-lower-middle-market-ma.html">
        <div class="p-date">JUL 10 2026</div>
        <h2>How AI Is Actually Changing Lower-Middle-Market Dealmaking</h2>
        <p>Where AI actually helps in sourcing, diligence, and follow-up — and where it doesn't replace judgment.</p>
      </a>
    </li>
  </ul>
</div>
<footer class="blog-foot">
  <div class="wrap">© <span id="yr"></span> Jack Pitts · <a href="../index.html">thejackpitts.com</a></div>
</footer>
<script>document.getElementById('yr').textContent = new Date().getFullYear();</script>
</body>
</html>
```

- [ ] **Step 2: Verify every linked file actually exists**

Run:
```bash
cd /Users/jackpitts/dev/jackpitts-site
for f in who-i-am-and-why salt-creek-advisory five-cities-two-years imposter-lonely-grateful any-idea-any-ai ai-lower-middle-market-ma; do
  test -f "blog/$f.html" && echo "OK: $f" || echo "MISSING: $f"
done
```
Expected: six `OK:` lines, zero `MISSING:` lines.

- [ ] **Step 3: Commit**

```bash
git add blog/index.html
git commit -m "feat: add blog index page listing all posts"
```

---

## Task 9: Integrate blog into the main site

**Files:**
- Modify: `index.html` (nav bar, ~line 394-398; footer link directory, ~line 640-653)

**Interfaces:**
- Consumes: `blog/index.html` from Task 8.

- [ ] **Step 1: Add a "Blog" link to the main nav bar**

In `index.html`, find:
```html
<div class="nav-top">
    <button class="brand" data-go="home">Jack Pitts<i>.</i></button>
    <a class="book-mini" href="https://helmiq.net/book/jack-pitts" target="_blank" rel="noopener">Book time ↗</a>
  </div>
```
Replace with:
```html
<div class="nav-top">
    <button class="brand" data-go="home">Jack Pitts<i>.</i></button>
    <div style="display:flex;align-items:center;gap:14px">
      <a class="book-mini" href="blog/index.html">Blog</a>
      <a class="book-mini" href="https://helmiq.net/book/jack-pitts" target="_blank" rel="noopener">Book time ↗</a>
    </div>
  </div>
```

- [ ] **Step 2: Add a "Blog" entry to the footer link directory**

In `index.html`, find:
```html
      <a href="https://jackinprogress.beehiiv.com/" target="_blank" rel="noopener">Jack In Progress · Newsletter</a>
      <a href="https://themakingofhostedbyjackpitts.com" target="_blank" rel="noopener">themakingofhostedbyjackpitts.com</a>
```
Replace with:
```html
      <a href="https://jackinprogress.beehiiv.com/" target="_blank" rel="noopener">Jack In Progress · Newsletter</a>
      <a href="blog/index.html">Blog</a>
      <a href="https://themakingofhostedbyjackpitts.com" target="_blank" rel="noopener">themakingofhostedbyjackpitts.com</a>
```

- [ ] **Step 3: Verify both links resolve to an existing file**

Run:
```bash
grep -c 'href="blog/index.html"' index.html
```
Expected: `2` (one in nav, one in footer).

- [ ] **Step 4: Visually confirm nav layout didn't break**

Run: `python3 -m http.server 8420 &`, open `http://localhost:8420/index.html`, confirm the nav bar shows "Jack Pitts." on the left and both "Blog" and "Book time ↗" grouped together on the right without wrapping oddly. Stop the server after.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: link the blog from main nav and footer"
```

---

## Task 10: Multi-agent quality review pass

**Files:**
- Modify: any of `blog/*.html` based on findings (no new files).

**Interfaces:**
- Consumes: all six post files from Tasks 2–7.

- [ ] **Step 1: Run the review workflow**

Invoke the `Workflow` tool with this script (this is the "fan out agents" pass Jack asked for):

```js
export const meta = {
  name: 'blog-quality-review',
  description: 'Review blog posts for voice authenticity, factual accuracy, and AEO structure',
  phases: [{ title: 'Review' }],
}

const POSTS = [
  { file: 'blog/who-i-am-and-why.html', label: 'who-i-am' },
  { file: 'blog/salt-creek-advisory.html', label: 'salt-creek' },
  { file: 'blog/five-cities-two-years.html', label: 'five-cities' },
  { file: 'blog/imposter-lonely-grateful.html', label: 'imposter' },
  { file: 'blog/any-idea-any-ai.html', label: 'any-idea-ai' },
  { file: 'blog/ai-lower-middle-market-ma.html', label: 'aeo-explainer' },
]

const FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          issue: { type: 'string' },
          suggestion: { type: 'string' },
        },
        required: ['issue', 'suggestion'],
      },
    },
  },
  required: ['findings'],
}

const results = await pipeline(POSTS, post =>
  parallel([
    () => agent(
      `Read /Users/jackpitts/dev/jackpitts-site/${post.file}. Does the prose sound like a genuine personal blog post written by a young Chicago-based M&A/AI founder, or does it read as generic AI-generated copy (cliche phrasing, over-explaining, corporate hedging, no specific concrete details)? List concrete issues and exact rewrite suggestions.`,
      { label: `voice:${post.label}`, phase: 'Review', schema: FINDINGS_SCHEMA }
    ),
    () => agent(
      `Read /Users/jackpitts/dev/jackpitts-site/${post.file}. Fact-check it against these known-true facts: Jack Pitts runs Salt Creek Advisory (M&A firm, lower-middle-market, run with his brother) and HelmIQ (AI operating system for dealmakers). Flag ANY claim about named real third parties, any invented statistic, or any overstated/unsupported claim about HelmIQ or Salt Creek Advisory.`,
      { label: `facts:${post.label}`, phase: 'Review', schema: FINDINGS_SCHEMA }
    ),
    post.label === 'aeo-explainer'
      ? () => agent(
          `Read /Users/jackpitts/dev/jackpitts-site/${post.file}. This post is meant to be cited by AI answer engines. Check: does it open with a direct answer (no throat-clearing intro), are the three <h2> sections scannable, is anything vague or filler? List concrete structural fixes.`,
          { label: `aeo:${post.label}`, phase: 'Review', schema: FINDINGS_SCHEMA }
        )
      : () => Promise.resolve({ findings: [] })
  ]).then(([voice, facts, aeo]) => ({ file: post.file, voice, facts, aeo }))
)

return results
```

- [ ] **Step 2: Read the findings and apply fixes**

For each entry in the returned results with non-empty `findings` arrays, open the corresponding file with the Edit tool and apply the suggested fix directly (rewrite the flagged sentence/paragraph). Do not apply a fix that would introduce a claim about a named real third party or a fabricated statistic — if a suggestion does that, discard it and rewrite the passage a different way instead.

- [ ] **Step 3: Re-run word count and structural checks on any file that was edited**

Re-run the exact grep and word-count commands from that post's original task (2–7) to confirm the edited file still passes.

- [ ] **Step 4: Commit**

```bash
git add blog/*.html
git commit -m "fix: apply multi-agent review findings to blog posts"
```

---

## Task 11: Ship it

**Files:**
- None (deploy step only).

**Interfaces:**
- Consumes: everything from Tasks 1–10.

- [ ] **Step 1: Confirm with Jack before pushing**

This is a real production deploy (Vercel auto-deploys `main`). Before running the push, ask Jack explicitly: "Ready to push the blog live to thejackpitts.com?" Do not push without an explicit yes in that conversation turn, even if earlier tasks were pre-approved.

- [ ] **Step 2: Push**

```bash
git push origin main
```

- [ ] **Step 3: Verify the live site**

Wait ~60 seconds for Vercel to build, then check each URL returns HTTP 200:
```bash
for f in "" who-i-am-and-why salt-creek-advisory five-cities-two-years imposter-lonely-grateful any-idea-any-ai ai-lower-middle-market-ma; do
  path="blog/${f:+$f.html}"
  [ -z "$f" ] && path="blog/index.html"
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://thejackpitts.com/$path")
  echo "$path -> $code"
done
```
Expected: every line ends in `200`.

- [ ] **Step 4: Verify the main site's new links resolve live**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://thejackpitts.com/blog/index.html
```
Expected: `200`.

---

## Self-Review Notes

- **Spec coverage:** all six posts (Task 2–7), shared stylesheet (Task 1), index page (Task 8), nav+footer integration (Task 9), multi-agent review (Task 10), SEO/AEO metadata (title/description/canonical/JSON-LD, embedded in every post task), and deploy (Task 11) — every section of the spec has a corresponding task.
- **Placeholder scan:** the only HTML comments in any task are explicitly marked as "must be replaced before shipping" and Step 2 of each post task greps to confirm they're gone (`grep -c "<!--"` expected `0`).
- **Type/name consistency:** every task reuses the exact class names defined in Task 1 (`.post-head`, `.post-body`, `.byline`, `.post-list`, `.blog-foot`, etc.) — no renamed classes across tasks. All six filenames match exactly between Tasks 2–7 (creation), Task 8 (index links), and Task 11 (deploy verification).
