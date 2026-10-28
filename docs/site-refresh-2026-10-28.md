# Site refresh, 2026-10-28: open items

Internal notes (excluded from the deploy by `.vercelignore`). Branch: `site-refresh-2026-10`. Baseline: local tag `baseline-2026-10-28`.

## Answered by Jack (2026-10-28, round 2)

- Salt Creek wording approved; site mirrors saltcreekadvisory.com ("family-owned, Chicago-based investment bank", "work every engagement personally", Connor's bio).
- Connor joined full-time in September 2026 (now on the site).
- ButcherJoseph: say "worked there" (kept).
- No preschool work: line removed from the Salt Creek post.
- Contact: email jack@saltcreekadvisory.com first; owners can book via saltcreekadvisory.com/book-a-call (the firm's owner page), never the raw calendar link.
- HelmIQ reason: own our data.
- Fonts: now Source Serif 4 + Inter, self-hosted, no slanted display type (matches the firm site).

## Still open

1. Firm founding date (Oct 2025 vs Jan 2026 vs "2026"): still left off.
2. "Kingfish Capital" vs "Kingfish Group": using Kingfish Capital, as on the firm site.
3. Unverified London PE job in "Five Cities": left as written.
4. Disclosures line "Salt Creek Advisory only represents an owner under a signed written agreement": confirm.

## Search Console

The "Page with redirect" list (http://, www., /index.html, /blog/index.html) is expected. Those addresses forward to the real pages, so Google correctly doesn't index them; don't try to "fix" them. Checked 2026-10-28: every one ends at the right page in 1 to 2 hops, and www + /index.html now goes straight to the homepage. After deploying: resubmit sitemap.xml, use URL Inspection to request indexing for / and /blog/, and check the Pages report shows the https://thejackpitts.com/ versions as indexed.

## Legal review (counsel)

- `privacy.html` and `disclosures.html` are written to match what the site actually does (Vercel hosting logs, Google Fonts, email, no cookies, no analytics, no forms). They have not been reviewed by a lawyer. No page can prevent lawsuits; accurate pages lower the risk.
- Vercel answers `/_vercel/speed-insights/script.js` with 200, but no page loads it. Check the Vercel dashboard. If Speed Insights or Web Analytics is turned on and later injected, update the privacy page first.

## Booking calendar (helmiq.net, not changed here)

- The site no longer links to `helmiq.net/book/jack-pitts` or the Google guest calendar anywhere.
- That does **not** make the calendar private. Anyone who has the URL can still book. If you want invite-only booking, it has to be enforced in HelmIQ, for example with per-invite tokens or approval before the booking is confirmed.
- The podcast website's guest section still links to the public Google guest calendar. That's a separate site and was not touched.

## Substack (account settings; not done from this repo)

- [ ] Update the publication tagline. It says "23, back in Chicago..." and will go out of date. Consider leading with Salt Creek and the podcasts.
- [ ] Add thejackpitts.com and saltcreekadvisory.com to the Substack "About" page and profile links.
- [ ] Set a publication logo and cover image so links shared from Substack look finished.
- [ ] Decide what to do with the old Beehiiv newsletter (jackinprogress.beehiiv.com is still live). Point readers to Substack, or import its subscribers into Substack, but only people who agreed to receive email.
- [ ] Refresh the homepage list after new posts: `node tools/substack-snapshot.mjs`, then commit.

## Measurement

- The site has no analytics today, so organic visits, owner-inquiry clicks, podcast clicks and Substack referrals can't be measured yet. Options: turn on Vercel Web Analytics (cookieless) or reuse an existing tool. Either way, update the privacy page first. Never send names, emails or message text to analytics. A click to Substack is not a confirmed subscription; use Substack's own subscriber stats for that.
- Search Console: verify thejackpitts.com, submit `sitemap.xml`, and check indexing. One sample of searches on 2026-10-28 didn't show the site for "Jack Pitts" or the podcast names; that's one sample, not ranking data.

## Content ideas (grounded in real work; not written)

1. "What I tell owners before they talk to a buyer": the questions owners actually ask on first calls.
2. "Why we only represent sellers": the sell-side-only choice, in your words.
3. Short write-ups of published podcast episodes that link to the episode on the show's site, with no copied transcripts.
4. "What I learned working in private equity deal origination": a personal piece that ties to your background.

## Round 3 (2026-10-28)

- Blog hidden: not linked, `noindex, follow`, out of the sitemap. Every post still loads at its old URL (nothing deleted). Writing = Substack.
- London is fall 2023 (fall of junior year, class of May 2025). Timeline is now in order: Chicago, Vanderbilt, London 2023, St. Louis 2024, New York 2025, Chicago now.
- Lower Middle Market Brief: Spotify + Apple, official artwork. No website, not on YouTube.
- HelmIQ: new logo; "built it myself with Claude Code, a few firms license it, not out selling it."
- Socials: TikTok removed; Instagram @thejackpitts and @saltcreekadvisory.
- New social share image: `assets/og-jack-pitts-2026.jpg` (new filename so LinkedIn and other platforms fetch the new one). After deploy, run the homepage through LinkedIn Post Inspector to refresh LinkedIn's preview.

## SEO plan (round 4, 2026-10-28)

Keyword map (one main topic per URL, so the sites don't compete with each other):

| Search people make | Page that should rank |
|---|---|
| Jack Pitts; Jack Pitts Chicago; Jack Pitts Salt Creek Advisory; Jack Pitts Vanderbilt | thejackpitts.com/ (the H1 now names Jack and his role) |
| Lower Middle Market Brief; Lower Middle Market Brief podcast | thejackpitts.com/lower-middle-market-brief/ (new; the show had no web page) |
| The Making Of Hosted by Jack Pitts | themakingofhostedbyjackpitts.com (this site links to it, not competing) |
| sell-side M&A Chicago; selling a family business; M&A advisor lower middle market | saltcreekadvisory.com (this site links to its guides) |
| HelmIQ | helmiq.net |

Refresh episodes after a new Brief: `node tools/lmmb-snapshot.mjs`, then commit.

IndexNow (Bing, Yandex, and the search behind ChatGPT and Copilot): key file `/eba6c4f56581130135674d38a3988b9b.txt` ships with this PR. After deploy, notify once with:
`curl -s "https://api.indexnow.org/indexnow?url=https://thejackpitts.com/lower-middle-market-brief/&key=eba6c4f56581130135674d38a3988b9b"` (and the same for /). Not sent yet; it's an external submission.

Off-site checklist (where rankings will actually move):
- [ ] Search Console: resubmit sitemap.xml; URL Inspection, then request indexing for / and /lower-middle-market-brief/.
- [ ] Bing Webmaster Tools: add the site (it can import from Search Console) and submit the sitemap.
- [ ] Spotify and Apple show descriptions for Lower Middle Market Brief: add "thejackpitts.com/lower-middle-market-brief". Set the RSS channel link (currently the bare text "saltcreekadvisory.com") to that page in Riverside.
- [ ] Every Lower Middle Market Brief and The Making Of episode description: one line linking thejackpitts.com.
- [ ] LinkedIn, Instagram, and Substack bios: link thejackpitts.com.
- [ ] Ask hosts and event pages that feature Jack to use the press bio and link thejackpitts.com.
- [ ] LinkedIn Post Inspector on / and /lower-middle-market-brief/ after deploy.
