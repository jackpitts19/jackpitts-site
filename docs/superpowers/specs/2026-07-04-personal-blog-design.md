# Personal Blog — Design Spec

**Date:** 2026-07-04
**Status:** Approved by Jack, ready for implementation planning

## Goal

Launch a six-post personal blog on jackpitts-site, written in Jack's voice, that (a) gives the site real long-form content about who Jack is and why he's building what he's building, and (b) is structured so individual posts can be indexed and cited by search engines and AI answer engines (AEO). This is phase one of a larger SEO/AEO effort — the rest (structured data audit, cross-site consistency, deeper answer-engine strategy) is a separate future design.

## Non-goals

- No CMS, no build step, no database. Matches the existing site's "single hand-written HTML file, no dependencies" philosophy, just extended to multiple files.
- No fabricated claims about real third parties (no invented "top X people" rankings). Post 6 avoids naming/ranking anyone.
- No AI-authorship disclosure on posts (explicit user decision — posts are signed "Jack Pitts").

## Architecture

New `/blog/` directory, sibling to `index.html`:

```
blog/
  index.html                       — post list (title, date, one-line teaser, link)
  who-i-am-and-why.html
  salt-creek-advisory.html
  five-cities-two-years.html
  imposter-lonely-grateful.html
  any-idea-any-ai.html
  ai-lower-middle-market-ma.html
assets/
  blog.css                         — shared stylesheet for all blog pages (new)
```

Each post is a real static HTML file with its own URL — deliberately NOT integrated into the existing single-page-app tab system in `index.html` (that system swaps `<main class="page">` blocks via JS and uses `#/` hash routing, which doesn't give individual crawlable URLs — bad for a blog meant to be found and cited).

Site integration (two touch points only):
1. Main nav in `index.html`: add a "Blog" link next to the existing "Book time ↗" link (`.book-mini` pattern), pointing to `blog/index.html`.
2. Footer link directory in the Contact/"Your Move" chapter (`.index-links`): add one entry, "Blog", linking to `blog/index.html`. Individual posts are not each listed here — the blog index page is the hub that links to all six.

## Visual design: "Journal" style

Chosen over two alternatives (Editorial — too close to a generic "AI blog template" look; Minimal/Notes — too stripped down) via a visual mockup comparison. Journal style, shared via `assets/blog.css`:

- Background: `--paper-deep` (#ece7da), matching the site's warm paper palette.
- Dog-eared corner fold (CSS triangle, top-right) on each post's header area — small decorative detail that echoes the site's existing corner-bracket motif (`.logo-card::before/::after`) without copying it directly.
- Headline: Fraunces serif, italic, weight 400, not the bold/serif-with-italic-accent-word pattern used on the main site (avoids the "editorial" look that read as too polished/templated).
- Opening paragraph: drop-cap first letter (Fraunces, orange accent color) — one per post, first paragraph only.
- Body copy: Inter sans, narrow measure (~34ch max-width) for readability, `--ink-soft`-equivalent color.
- Date/location stamp: small JetBrains Mono tag, e.g. "JUN 09 · CHICAGO", inverted (dark bg / light text) block above the headline.
- Byline: "— Jack Pitts" at the end of each post, mono, small caps treatment consistent with the rest of the site.
- Post 6 (the AEO explainer) uses the same visual chrome but with H2 subheads and short scannable paragraphs/lists in the body instead of pure diary-style prose — content structure differs, visual system doesn't.

`blog/index.html` reuses the same palette/fonts for consistency (post list as a simple vertical list: date stamp, title, one-line teaser, "Read →" link) — no separate visual system needed for the index.

## Posts

All posts: casual-but-professional first-person voice matching the site's established tone (short sentences, occasional self-aware humor, no corporate speak). Signed "— Jack Pitts."

### 1. Who I Am, and Why I'm Doing This
**File:** `who-i-am-and-why.html` · **Date:** June 9, 2026 · **Length:** ~250–350 words

Origin story and motivation. Key facts to include:
- Grew up middle class — not from money, not from a finance family.
- Dad worked in PR. Mom works in insurance claims. One grandfather was a union electrician. Other grandparents worked for the government.
- Nobody in the family had done a deal before Jack did — private equity and building his own firm was new territory, not inherited.
- Contrast: went into private equity in New York, realized the owners (not the fund people) were building the real wealth and having more fun doing it — that's the actual "why" behind Salt Creek Advisory and HelmIQ.
- Tone: grounded, not falsely modest, not braggy about being "self-made" either — just factual about where he started.

### 2. The Firm: Salt Creek Advisory
**File:** `salt-creek-advisory.html` · **Date:** June 17, 2026 · **Length:** ~250–350 words

Behind-the-scenes on the M&A firm. "A family business that sells family businesses" — the brother partnership, the lower-middle-market focus, why no-junior-team/no-handoffs matters to owners going through a once-in-a-lifetime sale.

### 3. Five Cities in Two Years
**File:** `five-cities-two-years.html` · **Date:** June 25, 2026 · **Length:** ~250–350 words

Chicago → Nashville → London → New York → Chicago. Reflection on the restlessness of moving that much in two years — what each place taught him, why landing back in Chicago actually felt like a choice rather than a default.

### 4. Imposter Syndrome, Loneliness, and Feeling Blessed
**File:** `imposter-lonely-grateful.html` · **Date:** July 4, 2026 · **Length:** ~250–350 words

The most vulnerable post. Key beat supplied directly by Jack: "Alone in Chicago right now with my dog Harvey, just working." Feeling disconnected from peers right now — explicitly NOT framed as superiority or "I'm better than my friends," just an honest, unglamorous description of where he is. Close on gratitude — lonely in the moment, but genuinely blessed for the position he's built.

### 5. Any Idea, Any AI
**File:** `any-idea-any-ai.html` · **Date:** July 8, 2026 · **Length:** ~250–350 words

AI democratizing ideas — the case that anyone with a real idea and enough understanding of it can now go build it themselves, without needing permission, capital, or a technical co-founder in the old sense. Ties naturally to HelmIQ's own origin (built the tool because building it themselves was suddenly possible).

### 6. How AI Is Actually Changing Lower-Middle-Market Dealmaking
**File:** `ai-lower-middle-market-ma.html` · **Date:** July 10, 2026 · **Length:** ~400–600 words (longer — this is the reference/explainer piece, not a diary entry)

The dedicated AEO piece. Structured, factual, answers specific questions a person (or an AI answering on their behalf) would actually ask: what's changing, what isn't, where AI actually helps in sourcing/diligence/follow-up vs. where it doesn't replace judgment. Grounded in Jack's actual expertise via Salt Creek Advisory + HelmIQ. Format: clear H2 subheads, short paragraphs, no fluff, no rankings or claims about named third parties. This is the post AEO/SEO metadata gets the most attention on (see below).

## SEO / AEO metadata (baseline, all posts)

Every post (`blog/*.html`) gets in `<head>`:
- Unique, descriptive `<title>`
- Unique meta description (1–2 sentences, matches actual post content)
- `BlogPosting` JSON-LD structured data: headline, datePublished, author (Person: Jack Pitts), description
- Canonical `<link rel="canonical">` pointing to the post's own URL

This is baseline hygiene, not the full AEO strategy — deeper work (site-wide Person/Organization schema, cross-site consistency audit, backlink strategy) is intentionally deferred to a future design pass, per earlier discussion with Jack.

## Quality assurance

Per Jack's explicit request to "fan out agents" for quality: after first drafts of all six posts exist, run a multi-agent review pass — at minimum on Post 6 (the AEO piece, highest scrutiny since it's meant to be cited and must not misstate anything), ideally lightly across all six. Review lenses:
- **Voice/authenticity** — does this sound like Jack, not like generic AI copy? (Directly responsive to his "you can tell it's AI" feedback on the Editorial visual option — same instinct applies to prose.)
- **Factual accuracy** — no invented claims, no unverifiable specifics, nothing overstated about HelmIQ/Salt Creek Advisory.
- **AEO structure** (Post 6 specifically) — scannable, directly answers likely questions, no filler.

Findings get applied as edits before the posts are considered final — this is a review-and-revise loop, not just a report.

## Open items carried to implementation

- Exact wording of all six posts (drafted during implementation, following the briefs above).
- Final copy for `blog/index.html` teasers.
