# SEO, SERP, and AI Referral Analysis

Date: 2026-09-26

## Executive conclusion

The site is not suffering from a traffic decline. It is a new property that has
just started to be discovered. Google has correctly assigned the homepage to
the core conversion topic, but it usually ranks outside the click-producing
range. The next iteration should strengthen the homepage as the single owner of
the image-to-skin intent, get the viewer page indexed, and create evidence-rich
answer blocks around the modifiers already appearing in GSC.

ChatGPT referral traffic is a useful validation signal, but the referrer does
not expose the user's prompt. Keyword decisions should therefore combine GSC
queries, ChatGPT/Google SERP questions, landing-page behavior, and a lightweight
on-site "what were you trying to make?" input rather than guessing prompts from
`chatgpt.com` alone.

## GSC evidence

Comparison windows:

- Current: 2026-08-27 to 2026-09-23
- Previous: 2026-07-30 to 2026-08-26
- Property: `sc-domain:image2minecraftskin.com`
- Target-market filter: United States

Site totals:

| Metric | Current | Previous |
|---|---:|---:|
| Clicks | 22 | 0 |
| Impressions | 288 | 1 |
| CTR | 7.64% | 0% |
| Average position | 34.30 | 65.00 |

This is early growth from an almost-zero baseline. The headline CTR is not a
useful measure of the core keyword yet because most reported clicks came from a
small set of other queries and GSC suppresses low-volume query rows.

Core-query signals:

| Query | Impressions | Clicks | Avg. position | Interpretation |
|---|---:|---:|---:|---|
| `image2skin` | 30 | 2 | 6.5 | First proven discovery term |
| `image to minecraft skin` | 31 | 0 | 32.6 | Correct topic, insufficient rank |
| `minecraft skin generator from image` | 4 | 0 | 31.5 | Relevant emerging modifier |
| `convert image to minecraft skin` | 2 | 0 | 43.0 | Relevant but too little data |
| `upload image to minecraft skin` | 1 | 0 | 11.0 | Promising workflow language |
| `photo to minecraft skin` | 6 | 0 | 62.0 | Relevant, currently weak |
| `png to minecraft skin converter` | 3 | 0 | 78.0 | Relevant format modifier |

In the United States, `image to minecraft skin` averaged position 15.6 across
9 impressions. This is better than the global average and is the nearest
meaningful opportunity, but the sample is still too small for CTR rewriting.

Page ownership is clean: every tracked conversion query belongs to the
homepage. There is no cannibalization yet.

## Indexing evidence

The URL Inspection API reported:

- `/`: `Submitted and indexed`, last crawled 2026-09-23, canonical accepted.
- `/minecraft-skin-viewer`: `Discovered - currently not indexed`; Google has
  not fetched the page yet.

A US English desktop `site:image2minecraftskin.com` check on 2026-09-26 showed
only the homepage and privacy page. The viewer is present in the sitemap and is
indexable in the rendered HTML, so the immediate problem is discovery/priority,
not a robots or canonical block.

## Live SERP findings

Checks were made on Google US, English, desktop, non-personalized (`pws=0`) on
2026-09-26.

### Image-to-skin cluster

The SERPs for `image to minecraft skin`, `convert image to minecraft skin`,
`minecraft skin generator from image`, and `minecraft skin maker from image`
have strong tool intent. Common winners include:

- `imagetominecraftskin.com`: dedicated free generator homepage
- `mcskins.top/image-to-skin`: image converter with 64x64 and 128x128 choices
- `mcskincraft.com/Tools`: direct image/photo converter
- AI generator pages from NanoMaker, SeaArt, Felo, YouWare, and Arnis
- Reddit and YouTube demonstrations

Repeated winning snippet concepts are: free, instant, online, upload a photo,
64x64/128x128, Java/Bedrock, 3D preview, and download PNG. The result page also
contains image packs, video, Reddit, People Also Ask, and sometimes an AI
Overview. Ranking alone will not capture all available attention.

The site's title and description already cover several of these concepts. The
larger gap is authority and demonstrable output quality, not another round of
keyword stuffing.

### Viewer cluster

`minecraft skin viewer` is a distinct intent. Top pages emphasize one or both
of these workflows:

1. Look up a player by username or UUID.
2. Upload a skin and rotate/animate it in 3D.

The current viewer supports the second workflow and has suitable metadata, but
it has no GSC impressions because it is not indexed. Do not merge this intent
into the homepage.

## Keyword map

Keep one intent owner per URL:

| Page | Primary cluster | Supporting modifiers |
|---|---|---|
| `/` | image to Minecraft skin | converter, generator from image, photo to skin, PNG to skin, online, free, Java 64x64, Bedrock 128x128 |
| `/minecraft-skin-viewer` | Minecraft skin viewer | 3D, upload, online, 64x64, 128x128, classic vs slim |
| Future guide | how to turn an image into a Minecraft skin | best source image, import steps, Java vs Bedrock, troubleshooting |
| Future guide | Minecraft skin size and format | 64x64 vs 128x128, PNG layout, classic vs slim |

Do not create separate thin pages for every wording variant. Only create a new
URL when the user task or tool behavior is materially different.

## GPT and AI referral strategy

The supplied 24-hour analytics screenshot shows 14 visitors from ChatGPT among
19 visitors with a listed referrer (74% of that referrer breakdown). It does not
mean 74% of all 56 visitors came from ChatGPT, and it does not reveal prompts.

Use four sources to build an AI-intent keyword set:

1. GSC: phrases Google already associates with the site.
2. AI/Google answer checks: questions such as "Can ChatGPT make a Minecraft
   skin?", "Can I turn any image into a Minecraft skin?", and "How do I import
   the PNG?"
3. Product behavior: upload, generate, preview, download, reset, output size,
   and failure events segmented by referrer and landing page.
4. First-party voice: after download, ask one optional short question such as
   "What were you making?" with choices like selfie, game character, pixel art,
   pet, logo, and other.

Content intended for AI citations should contain self-contained answers,
specific supported formats, real before/after examples, limitations, and dated
testing notes. A useful original-data asset would be a small benchmark comparing
how portraits, pixel art, anime characters, pets, and logos convert at 64x64 and
128x128. That is more citable than generic Minecraft history.

`/llms.txt` currently returns 404 in production, while the repository copy
still describes ChartMini. Replace it only after the content is corrected; an
accurate file is useful for machine-readable product context, but it is not a
substitute for indexable HTML or third-party mentions.

## Recommended iteration order

### P0: this week

1. Request indexing for `/minecraft-skin-viewer` in GSC and strengthen one or
   two crawlable contextual links to it from the homepage. Recheck inspection
   status after 7-14 days.
2. Replace the stale `public/llms.txt` with accurate product, capability,
   privacy, homepage, viewer, and sitemap information; ensure it returns 200.
3. Preserve the homepage as the only owner of the image-to-skin cluster.
4. Add analytics for generation success/failure, output size, preview use,
   download, source-image category, landing page, and referrer domain. Never log
   image content or local filenames.

### P1: next 2-3 weeks

1. Add real, crawlable before/after examples for portrait, character art, and
   pixel art, including the exact output size and a concise limitation note.
2. Add direct answer sections for Java 64x64 vs Bedrock 128x128, classic vs slim,
   supported inputs, and importing the downloaded PNG.
3. Publish one strong how-to guide and one format/size guide, then link both to
   the generator and viewer with descriptive anchors.
4. Create a short video demonstration and distribute a genuine build/example
   post where Minecraft creators already discuss tools. The current SERP shows
   that YouTube and Reddit can win visibility before a young domain ranks top 3.

### P2: after more data

1. Consider username/UUID lookup only if viewer impressions show demand; it is
   a separate product capability, not a copy change.
2. Consider an AI generation mode only if the product actually uses an image
   model and output quality is competitive. Do not label deterministic mapping
   as AI.
3. Localize only after a market has enough impressions or product usage to
   justify a complete page experience. Current country samples are too small.

## Measurement gates

Review weekly, but make page-level decisions on a rolling 28-day window:

- Viewer changes from discovered/not indexed to indexed.
- Homepage reaches at least 100 impressions for the core cluster before testing
  title variants.
- Track the share of core-cluster impressions in positions 1-10, 11-20, and
  21+ rather than relying only on average position.
- Compare generation-to-download conversion by Google, ChatGPT, direct, and
  social referral.
- Track AI citation presence monthly across a fixed 10-query test set; record
  cited domains and answer wording, not just whether the brand is mentioned.

Raw GSC comparison data is stored beside this report in
`docs/research/gsc-2026-09-26/`.
