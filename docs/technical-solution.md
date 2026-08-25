# image2minecraftskin Technical Solution

## Request And Data Flow

```text
Browser -> TanStack Start SSR -> configured homepage
Browser file -> File/Canvas APIs -> skin mapper -> 2D/3D preview -> PNG download
```

The source image and generated texture remain in browser memory. The MVP does
not call D1, R2, KV, authentication, payment, or an AI provider.

## Template Reuse Map

| Existing module | Product responsibility |
| --- | --- |
| `src/config/website.ts` | Brand, assets, UI and feature flags |
| `src/config/navbar-config.ts` | Localized public navigation |
| `src/config/footer-config.ts` | Localized Footer information architecture |
| `src/components/layout/*` | Reusable navigation and Footer renderers |
| `project.inlang` / Paraglide | Visible copy and locale resolution |
| `src/storage/provider/*` | Dormant future R2 provider boundary |
| `src/cache/*` | Dormant future KV provider boundary |
| `src/db/*` | Dormant future D1/Drizzle boundary |
| `src/lib/skin/*` | Product-specific browser conversion behavior |

New `homepage-config.ts` and `skin-tool-config.ts` are required because the
template has no configuration boundary for landing composition or converter
options. No parallel auth, storage, button, dialog, or upload protocol is added.

## Configuration Ownership

- `website.ts`: brand metadata, assets, social links, footer tagline, locale and
  theme controls, provider flags.
- `navbar-config.ts` and `footer-config.ts`: link structure and localized labels.
- `homepage-config.ts`: hero facts, examples, compatibility, FAQ, section order.
- `skin-tool-config.ts`: input limits, accepted MIME types, formats, models,
  defaults, status and accessibility labels.
- `project.inlang/messages/en.json`: user-facing strings.

Components render resolved config and own only interaction state. FAQ JSON-LD is
derived from the same config as the visible FAQ.

## Cloudflare Configuration Ledger

| Binding/value | Owner | Purpose | Location | Status |
| --- | --- | --- | --- | --- |
| `VITE_BASE_URL` | Product | Canonical origin | `wrangler.jsonc` | Set to custom domain |
| `DB` | Cloudflare | Future relational data | D1 + `wrangler.jsonc` | Created and bound, unused |
| `BUCKET` | Cloudflare | Future private files | R2 + `wrangler.jsonc` | Created and bound, disabled |
| `CACHE` | Cloudflare | Future cache/rate state | KV + `wrangler.jsonc` | Created and bound, disabled |
| AI provider key/model | User/provider | Later AI conversion | Worker secret/config | Later |
| Analytics ID | User | Product measurement | Environment/config | Later |
| Legal contact | User | Legal/support pages | Config/messages | Later |

Wrangler first lists account resources and reuses exact matches. It creates only
missing resources. No secrets or migrations are involved.

## Schema And Authorization

The existing Drizzle/auth schema stays dormant. This phase creates no new tables
and applies no local or remote D1 migration. Authorization becomes required only
when a future feature persists user-owned data or incurs provider cost.

## Storage And Async Work

R2 remains disabled through `websiteConfig.storage.enable`. A future server upload
must validate MIME and size again, use private user-scoped keys, and serve results
through ownership checks. AI conversion should use a provider adapter plus a
Workflow/queue if provider latency or expiring URLs require it.

## Tests

- Vitest validates config shapes/defaults and skin texture behavior.
- Locale compilation/key validation validates the enabled English locale.
- Playwright validates the real public conversion and download journey without
  auth/upload requests on desktop and mobile.
- Production build and Wrangler dry-run validate Worker packaging and bindings.

## Rollback

Code rollback uses the prior Git commit and Cloudflare Worker version rollback.
Bindings can remain present because disabled features never access them. Remote
resources are not deleted during rollback; deletion requires a separate explicit
request after confirming they are empty and unused.

## Production Verification

Verify `/`, `/robots.txt`, `/sitemap.xml`, and `/manifest.json`; inspect canonical,
OG, WebApplication and FAQ metadata; run one local example conversion for Java
and Bedrock; download both PNG sizes; confirm browser network logs contain no
source upload or auth request; and verify `DB`, `BUCKET`, `CACHE` bindings in the
deployed Worker when a later deployment is explicitly requested.
