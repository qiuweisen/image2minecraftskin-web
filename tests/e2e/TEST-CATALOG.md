# E2E Test Catalog

This catalog defines the active acceptance journeys for
`image2minecraftskin.com`. Follow `Spec -> Code -> Verify -> Test -> Green` for
user-facing changes.

## Test Harness

- Config: `playwright.config.ts`
- Public command: `pnpm e2e:public`
- Full template command: `pnpm e2e` with `E2E_USE_DB=true`
- Active product spec: `tests/e2e/specs/image2minecraftskin-homepage.spec.ts`
- Browser projects: desktop Chromium and Pixel 5 mobile emulation

The public product suite starts without D1 preparation because the current
converter is browser-local. Database setup remains available for future enabled
auth/storage suites.

## Product: Image To Minecraft Skin

**Priority:** P0

| # | Journey | Acceptance |
| --- | --- | --- |
| 1 | Homepage renders | Open `/`; verify the Image to Minecraft Skin H1 and generator are visible. |
| 2 | Local example conversion | Start the configured example; verify status becomes ready and the 3D placeholder disappears. |
| 3 | Java/Bedrock selection | Switch to Bedrock and verify the configured control becomes active. |
| 4 | PNG download | Download the generated texture and verify the Bedrock 128 filename. |
| 5 | Privacy boundary | Verify the journey sends no auth request and no POST/upload request. |
| 6 | Responsive journey | Run the same journey on desktop and Pixel 5 without control overflow or blocked actions. |
| 7 | Focused discovery | Verify generator-specific answer content, HowTo/FAQ schema, and the contextual handoff to the separate viewer. |
| 8 | Analytics boundary | Verify format and download events contain only allowlisted workflow metadata. |
| 9 | Optional source adjustment | Keep automatic conversion as the fast path; optionally adjust zoom and framing, reset it, and regenerate locally. |
| 10 | Result inspection | Prompt the user to inspect the 3D model and unfolded texture before download. |

## Product: Minecraft Skin Viewer

**Priority:** P0

| # | Journey | Acceptance |
| --- | --- | --- |
| 1 | Viewer page renders | Open `/minecraft-skin-viewer`; verify the viewer H1 and upload workspace are visible. |
| 2 | Example skin preview | Load the configured example; verify Java 64x64 metadata and a rendered 3D canvas. |
| 3 | Model selection | Switch between Auto, Classic, and Slim without changing layout dimensions. |
| 4 | Invalid texture | Uploading a non-PNG or unsupported dimensions shows a recoverable inline error. |
| 5 | Privacy boundary | Verify the example and upload flow send no POST/upload request. |
| 6 | Responsive journey | Run the viewer on desktop and Pixel 5 without horizontal overflow or blocked controls. |
| 7 | Focused discovery | Verify viewer-specific format/model content, HowTo/FAQ schema, and the contextual handoff to the generator. |
| 8 | Analytics boundary | Verify ready and model events contain no filename or image content. |

## Manual Visual Acceptance

- First viewport communicates image-to-skin transformation and exposes the real
  tool without signup.
- Desktop uses the dark workspace/light editorial shell composition from the
  approved design system.
- Mobile stacks upload, controls, 3D preview, and 2D texture without horizontal
  scrolling or text overlap.
- Generated examples visibly distinguish head, torso, arms, and legs; the 3D
  preview must not render as a blank or black silhouette.
- Java and Bedrock controls, download state, and error state remain legible at
  both viewports.

## Public SEO Routes

Verify `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/manifest.json` return
successful responses. The sitemap must list only current indexable product and
policy routes with explicit update dates. `llms.txt` must accurately distinguish
the generator from the viewer and contain no disabled template product copy.

## Deferred Template Coverage

Auth, dashboard, admin, file storage, cache, newsletter, and payment modules
remain reusable template infrastructure but are disabled in `websiteConfig`.
Their old product-specific E2E suites are not part of the current release gate.
They must be updated and re-enabled only when the corresponding feature is part
of the product contract.
