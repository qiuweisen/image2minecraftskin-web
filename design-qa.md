# Practice Modes Card — Design QA

Source visual:

`/Users/iven/.codex/generated_images/01a0033c-2927-7500-b135-234e051f056f/exec-d1408268-cfad-4798-8a67-88703e2b2133.png`

Implementation:

- `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2/src/components/blog/practice-modes-card.tsx`
- `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2/src/routes/blog/$slug.tsx`
- `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2/src/lib/blog-content.ts`

## Evidence

The implementation was checked in the in-app browser against a real local blog article at 1280×720 and 390×844 viewports.

- Light desktop: `/tmp/chartmini-practice-modes-qa/desktop-light-compact.png`
- Dark desktop: `/tmp/chartmini-practice-modes-qa/desktop-dark-compact.png`
- Light mobile: `/tmp/chartmini-practice-modes-qa/mobile-light-final.png`
- Dark mobile: `/tmp/chartmini-practice-modes-qa/mobile-dark-final.png`

## Review

- Typography: the badge, heading, description, and destination labels preserve the selected visual hierarchy and use the existing site font and semantic text tokens.
- Layout: the card follows the selected wide desktop composition; the destination group is split by a vertical separator on desktop and stacks with a horizontal separator on mobile.
- Compact refinement: the desktop card now measures about 896×299px (previously 896×339px); the mobile card measures about 358×368px (previously 358×400px), while the article width and type scale remain unchanged.
- Color: all card surfaces, borders, text, hover states, and shadows use TanStarter semantic tokens. Light and dark surfaces remain isolated; no fixed light/dark color is embedded in the component.
- Icons: Tabler calendar and chart-bar icons provide the same compact utility-icon treatment as the reference.
- Copy: `Practice Modes`, `Practice with ChartMini`, `Two ways to practice. Build consistency and improve your edge.`, `Daily Replay`, and `Day Trading Simulator` match the selected reference.
- Placement: the card is inserted between the first and second article H2 sections. If an article has only one H2, it falls back to the end of the article without splitting a table, list, or code block.
- Semantics: the two destinations are real TanStack Router links with `/play` and `/day-trading-simulator` hrefs. A first pass used Base UI Button composition and produced a native-button warning; it was replaced with a real Link using the native `buttonVariants` styling. The final browser console had no errors or warnings.

## Verification

- `pnpm check` — passed
- `pnpm build` — passed
- `pnpm seo:v2:workflow:check` — passed
- `pnpm locale:check` — passed
- Browser verification — passed for light/dark desktop and mobile layouts, placement, visibility, and both destinations

final result: passed
