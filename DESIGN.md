# Image2MinecraftSkin Design System

## 1. Design Intent

**Direction:** Minecraft Skin Workshop / terminal editorial utility.

The site should feel like a focused browser instrument for turning an image into
a Minecraft skin that can be previewed and exported. The product is expressed
through real input imagery, skin texture layouts, 3D character previews, output
formats, and clear conversion states. Minecraft references come from the
product itself, not decorative game scenery or pixel-art wallpaper.

The entire landing page uses one dark workspace language. Marketing sections
explain the workflow, but they must look like extensions of the tool rather
than a separate SaaS template.

## 2. Core Tokens

```css
:root {
  --color-bg: #0b1011;
  --color-surface: #11191b;
  --color-surface-raised: #162326;
  --color-fg: #f1f3ed;
  --color-muted: #8d9a9a;
  --color-border: #21464a;
  --color-border-strong: #2a7378;
  --color-accent: #36d8d4;
  --color-success: #a8dd45;
  --color-warning: #f28b72;
  --color-grid: rgba(110, 170, 172, 0.12);

  --font-display: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  --font-body: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: var(--font-display);

  --container-wide: 1240px;
  --container-tool: 1180px;
  --gutter: clamp(20px, 4vw, 60px);
  --radius-control: 4px;
  --border-hairline: 1px;
  --section-space: clamp(64px, 8vw, 112px);
}
```

Use the existing Tailwind/theme tokens where possible. Do not introduce one-off
section palettes, gradients, glassmorphism, glow effects, or large decorative
pixel backgrounds.

## 3. Typography

- Display headings use the mono display family for the terminal/product voice.
- Body copy uses the readable sans family above; it must not be forced into a
  dense monospace paragraph style.
- Metadata, dimensions, file names, statuses, format labels, and step numbers
  use uppercase or compact monospace treatment.
- Keep letter spacing at `0`; use hierarchy through size, weight, color, and
  placement instead.
- H1 is compact and product-specific, usually two to four lines. Body measure
  stays near 60-70 characters.

## 4. Page Composition

The landing page is a continuous dark canvas with thin horizontal separators.
Use one container and one border language throughout.

1. **Navigation:** minimal brand mark, sparse links, one primary action.
2. **Hero proof:** headline and CTA beside a real three-stage visual:
   source image -> Minecraft character -> flat skin texture.
3. **Generator workspace:** the first major interaction and visual anchor. Use
   upload/settings, 2D texture, and 3D preview as one bounded work surface.
4. **Conversion model:** Input -> Texture -> Preview -> Export.
5. **Features:** numbered editorial grid, not unrelated marketing cards.
6. **How to use:** four connected steps with a visible directional flow.
7. **Formats:** Java 64x64 and Bedrock 128x128 as product capabilities.
8. **Privacy/trust:** only claims the implementation can verify.
9. **FAQ:** compact bordered rows using the shared Accordion component.
10. **Footer:** minimal, dark, configuration-driven.

The tool must be visible in the first viewport or immediately below the hero.
The page must not switch to a light background for lower sections.

## 5. Component Rules

- Reuse TanStarter `Container`, `HeaderSection`, `Button`, `Card`,
  `Accordion`, `Navbar`, and `Footer` primitives.
- Add business-specific components only for upload, skin mapping, texture
  preview, 3D preview, format selection, and export states.
- Cards are for repeated items only. Do not nest cards or place the whole page
  inside a floating card.
- Use 4-8px corners consistently; controls are at least 44px tall.
- Primary actions use cyan or lime with clear text. Secondary actions use a
  transparent dark surface and cyan border.
- Empty, loading, success, and error states use both labels and color. Never
  communicate state by color alone.
- Texture previews use a stable square/grid aspect ratio. 3D preview regions
  keep a fixed minimum height so loading text cannot move the layout.

## 6. Product Visual Language

- Show actual or representative portrait input, block character output, and
  skin texture layout whenever a section explains the conversion.
- Texture grids, output size labels, format controls, and preview states are
  primary visual elements.
- Avoid abstract blobs, generic AI illustrations, fake statistics,
  testimonials, game scenery, and CSS-built character art.
- Do not claim AI generation unless an actual model-backed workflow is enabled.

## 7. Responsive and Accessibility Rules

- At widths below 920px, the workspace becomes a single-column flow:
  upload/settings -> texture -> 3D preview -> export.
- At narrow mobile widths, controls become full-width and texture/preview
  regions preserve stable dimensions.
- Keyboard users can operate upload, format controls, tabs, preview controls,
  and export actions. Use visible `:focus-visible` outlines.
- Status updates use an `aria-live` region. File limits and local-processing
  behavior are stated near the upload control.
- Respect `prefers-reduced-motion` by removing non-essential transitions.

## 8. Quality Bar

Before shipping, verify:

1. The whole page reads as one Minecraft Skin Workshop, not mixed templates.
2. The first viewport shows a real conversion proof and a clear upload action.
3. Generator states are visually complete, including an example-ready state.
4. Java/Bedrock and 64x64/128x128 differences are obvious.
5. No section introduces unrelated colors, card styles, or typography.
6. Desktop and mobile layouts have no overlap or unstable resizing.
