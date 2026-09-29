# Focused Tool Pages and AI Discovery Design

Date: 2026-09-26
Status: Approved

## Goal

Increase qualified traffic from ChatGPT and Google while keeping every tool
page focused on one user task. Content explains and supports the tool on that
page; it does not turn tool pages into broad topic hubs.

## Product principles

1. One page owns one task and one primary search intent.
2. Pages connect through the user's next action, not generic related-content
   lists.
3. Visible content, metadata, structured data, and analytics use the same task
   vocabulary.
4. Claims must match implemented behavior. The deterministic converter is not
   described as AI.
5. The core workflow remains free. Paid-intent experiments are out of scope.

## Page ownership

### Generator: `/`

Primary task: convert an ordinary image into a Minecraft skin texture.

Owns:

- image/photo/artwork upload
- Java 64x64 and Bedrock 128x128 output selection
- Classic and Slim model selection
- conversion, preview, and PNG download
- generator-specific input, output, privacy, and import answers

Does not own:

- detailed validation of an existing skin file
- username or UUID lookup
- pixel editing

The handoff to the viewer appears only after the viewer is relevant: after a
skin exists and in a compact supporting section near the output workflow.

### Viewer: `/minecraft-skin-viewer`

Primary task: validate and inspect an existing Minecraft skin PNG.

Owns:

- 64x64 and 128x128 PNG validation
- unfolded texture inspection
- Classic, Slim, and automatic arm-model selection
- interactive 3D preview
- viewer-specific format and troubleshooting answers

Does not own:

- converting an ordinary photo
- generating a new design
- username or UUID lookup
- editing pixels

The handoff to the generator appears only when the visitor does not yet have a
valid skin or wants to start again from an ordinary image.

## User flow and internal links

```text
Ordinary image -> Generator -> skin PNG -> Viewer (optional validation)
Existing skin PNG -> Viewer -> Generator (only when a new skin is needed)
```

Links use action-oriented anchors:

- Generator to Viewer: `Inspect a skin in the 3D viewer`
- Viewer to Generator: `Create a skin from an image`

The links must be server-rendered, crawlable, and visually secondary to each
page's primary action.

## AI and search content

Each page includes short, self-contained answer blocks that can be understood
without surrounding marketing copy. They cover only the current tool's task.

Generator answer topics:

- what the converter does
- which source images and formats are accepted
- which texture sizes it exports
- how local processing and download work

Viewer answer topics:

- what a skin viewer does
- which skin files are valid
- how Classic and Slim arms differ
- what the 2D and 3D views reveal

Answers use concrete formats, dimensions, and limitations. No generic
Minecraft history, artificial statistics, or unsupported quality claims are
added.

## Machine-readable discovery

- Replace the stale ChartMini `public/llms.txt` with concise, accurate product
  context and canonical links to the generator, viewer, privacy page, terms,
  and sitemap.
- Keep each page's `WebApplication` JSON-LD independent.
- Add `HowTo` only where the visible page contains the matching steps.
- Keep `FAQPage` synchronized with visible questions and answers.
- Keep viewer breadcrumbs and add no schema for unsupported features.
- Add meaningful `lastmod` values to sitemap entries using explicit content
  update constants rather than request-time timestamps.

## Analytics

Replace the inherited ASCII event vocabulary with privacy-safe skin workflow
events. Do not capture image contents, filenames, user prompts, or personal
data.

Generator events:

- `skin_upload`
- `skin_generation_completed`
- `skin_generation_failed`
- `skin_format_selected`
- `skin_model_selected`
- `skin_downloaded`
- `skin_viewer_handoff_clicked`

Viewer events:

- `skin_viewer_upload`
- `skin_viewer_validation_failed`
- `skin_viewer_ready`
- `skin_viewer_model_selected`
- `skin_generator_handoff_clicked`

Allowed properties are narrow enums and numeric file size/dimensions. Umami,
GA, and Plausible receive the same sanitized event contract.

## Error handling

- Analytics remains optional and never blocks a user action.
- Failed input validation explains the accepted type and dimensions in the
  active tool.
- Cross-tool links remain available even if client-side analytics is absent.
- Structured data is generated from the same page configuration used for
  visible FAQ and step content to prevent drift.

## Verification

- Unit tests cover analytics payload allowlists and event dispatch.
- Route/head tests cover canonical metadata and page-specific JSON-LD.
- E2E tests confirm each tool's H1, primary workspace, focused supporting copy,
  and contextual cross-tool link.
- Production build confirms static assets including `/llms.txt` are emitted.
- Browser verification checks desktop and mobile layout, rendered JSON-LD,
  internal links, and absence of console errors.

## Out of scope

- paid plans or pricing tests
- a Minecraft skin editor
- username/UUID lookup
- standalone generic blog posts
- thin pages for every keyword modifier
- claiming AI generation without a model-backed implementation
