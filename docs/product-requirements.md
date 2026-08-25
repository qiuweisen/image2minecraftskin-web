# image2minecraftskin Product Requirements

## Product Contract

| State | Decision |
| --- | --- |
| Confirmed | English-first browser tool at `image2minecraftskin.com` |
| Confirmed | Convert an image into Java 64x64 or Bedrock 128x128 PNG |
| Confirmed | Free, no login, no payment, and no source-image upload in MVP |
| Confirmed | Site customization is configuration-driven and localized |
| Confirmed | Cloudflare D1, R2, and KV are initialized but initially unused |
| Later | AI generation through a provider adapter |
| Later | Additional translated locales beyond English and Chinese |

## Users And Value

| User | Scenario | Outcome | Willingness to pay |
| --- | --- | --- | --- |
| Minecraft player | Has a photo or character image | Downloads a usable skin quickly | MVP is free |
| Mobile player | Needs a Bedrock-compatible texture | Downloads 128x128 PNG on mobile | MVP is free |
| Skin creator | Wants a fast starting texture | Uses 2D and 3D previews before export | Later AI features may be paid |

## Information Architecture

- `/`: owns the `image to minecraft skin` query and the complete conversion journey.
- `/privacy`: explains browser-local processing and future provider disclosures.
- `/terms`: use terms and Minecraft trademark independence.
- `/cookie`: cookie policy.
- `/robots.txt`, `/sitemap.xml`, `/manifest.json`: crawl and install metadata.

## Homepage Order

1. Navigation and brand.
2. Hero with the product category and real transformation proof.
3. Browser-local generator workspace.
4. Configured examples.
5. Java and Bedrock compatibility.
6. FAQ.
7. Configured Footer.

The generator is available in the first working viewport, not behind signup or
marketing navigation.

## MVP

- Validate PNG, JPG/JPEG, and WEBP up to 10 MB.
- Process images in the browser.
- Select Java 64x64 or Bedrock 128x128.
- Select Classic or Slim arm model.
- Preview the texture in 2D and a character in 3D.
- Download a PNG with the configured dimensions.
- Work on current desktop and mobile browsers.
- Resolve all product copy from enabled locale message files.
- Configure brand, navigation, Footer, homepage content, and tool choices outside
  reusable rendering components.

## Non-Goals

- Gallery, accounts, payments, server uploads, remote conversion, or AI generation.
- Typo doorway pages or broad `minecraft skins` gallery intent.
- Official Minecraft assets, logos, fonts, or implied endorsement.
- Applying production D1 migrations during resource initialization.

## Privacy And Errors

The standard converter must not transmit the source image. Invalid type, size,
decode, and conversion errors are localized and recoverable. Existing Cloudflare
bindings must not cause network traffic while storage/cache features are disabled.

## Configuration

`website.ts` owns brand and feature flags. Navigation, Footer, homepage, and tool
configuration live in dedicated typed modules. Paraglide messages are the only
source of visible product strings. Adding a supported locale must not require
editing Navbar, Footer, homepage, or tool components.

## Success Metrics

- Generator start rate.
- Successful local conversion rate.
- PNG download rate.
- Java versus Bedrock selection.
- No source-image upload requests in the standard converter.
- Search impressions/clicks for the homepage owner keyword.

## Release Phases

1. Config-driven local converter and Cloudflare resource initialization.
2. Conversion quality and crop/mapping improvements.
3. Supporting SEO guides.
4. Optional AI adapter with explicit privacy, cost, and rate-limit controls.

## Acceptance Criteria

- A user can use an example or upload a valid image, select an output, preview,
  and download a correctly sized PNG without authentication.
- Navigation, Footer, homepage copy/ordering, tool options, and locale labels are
  changed through typed configuration/messages rather than product literals in
  components.
- English and Chinese locale keys pass parity validation.
- D1 `DB`, R2 `BUCKET`, and KV `CACHE` bindings exist while their features remain
  disabled.
- Unit tests, the public Playwright journey, production build, and Wrangler
  dry-run pass before release.

