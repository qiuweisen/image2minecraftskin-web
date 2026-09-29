# Config-Driven Site Design

## Objective

Make `image2minecraftskin-web` a template-driven product customization rather
than a collection of product-specific component edits. Follow the configuration
boundaries already used by `ascii-image-web`, while adding explicit configuration
for homepage composition and the skin tool.

## Design Principles

1. Components render structure and behavior; they do not own product copy.
2. All visible text is resolved through Paraglide messages.
3. Navigation, footer, homepage sections, and tool options are typed config.
4. Product capabilities and Cloudflare resources are separate concerns.
   A binding may exist while its feature flag remains disabled.
5. Configuration changes must be sufficient for normal rebranding, navigation,
   localization, section ordering, and feature enablement.

## Configuration Architecture

Use the same layered approach as `ascii-image-web`:

- `src/config/website.ts`: brand metadata, assets, social accounts, UI behavior,
  and feature/provider flags.
- `src/config/navbar-config.ts`: localized primary navigation.
- `src/config/footer-config.ts`: localized footer sections and links.
- `src/config/homepage-config.ts`: localized hero facts, example cards,
  compatibility blocks, FAQ entries, and section visibility/order.
- `src/config/skin-tool-config.ts`: accepted MIME types, maximum file size,
  Java/Bedrock formats, arm models, default selections, and localized labels.
- `project.inlang/messages/*.json`: the only source of user-facing strings.

Config functions may call Paraglide message getters so switching locale resolves
the current language at render time. Components receive resolved configuration
objects and must not embed product strings.

## Component Boundaries

- `Navbar` and `NavbarMobile` render `getNavbarLinks()` and `websiteConfig`.
- `Footer` renders `getFooterLinks()`, `getSocialLinks()`, and configured tagline.
- `HomePage` iterates homepage section configuration and delegates interactive
  conversion to `SkinWorkspace`.
- `SkinWorkspace` owns browser state and conversion actions, but consumes all
  limits, choices, defaults, labels, and status text from skin tool config.
- Structured data is derived from the same homepage/FAQ configuration so visible
  content and JSON-LD cannot drift.

The converter algorithms remain code because they are product behavior, not
site customization.

## Locale Contract

English is the only enabled locale. Every config-owned label uses a Paraglide
message getter. Locale validation must reject empty keys in the enabled locale.

Adding a future locale should require only:

1. Adding the locale to the Inlang settings and locale metadata.
2. Supplying the same message keys.
3. Regenerating Paraglide output.

No navigation, footer, homepage, or tool component edits should be required.

## Cloudflare Resource Contract

Initialize resources using the same binding names as `ascii-image-web`:

| Resource | Remote name | Binding | Initial feature state |
| --- | --- | --- | --- |
| D1 | `image2minecraftskin-web` | `DB` | Available, unused by MVP |
| R2 | `image2minecraftskin-web` | `BUCKET` | `storage.enable: false` |
| KV | account-generated namespace | `CACHE` | `cache.enable: false` |

Before creation, Wrangler must list existing D1 databases, R2 buckets, and KV
namespaces to avoid duplicates. Created IDs are written to `wrangler.jsonc`.
This phase does not run remote migrations, upload user files, enable auth, or
introduce server-side conversion.

## Data And Failure Behavior

The current conversion remains browser-local. Missing Cloudflare resources must
not affect the public converter while the corresponding feature flags are off.
Configuration is statically typed so invalid section types, tool formats, or
feature providers fail during type checking/building.

## Verification

- Unit-test configuration shape, tool defaults, and localized menu resolution.
- Verify no product-facing literal strings remain in Navbar, Footer, HomePage,
  or SkinWorkspace.
- Run locale compilation and locale key checks.
- Run skin model unit tests and production build.
- Update E2E configuration so the public tool journey does not require D1 setup
  when database-backed features are disabled.
- Run the homepage Playwright journey on desktop and mobile.
- Run Wrangler dry-run and inspect bindings.
- Use Wrangler read-only list commands after initialization to verify resource
  names and IDs.

## Non-Goals

- Enabling authentication, payments, storage, cache, or AI generation.
- Applying remote D1 migrations.
- Uploading source images to R2.
- Introducing a CMS or JSON/YAML configuration layer.
- Attaching the custom domain in this configuration refactor.
