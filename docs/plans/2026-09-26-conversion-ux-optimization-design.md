# Conversion UX Optimization Design

## Objective

Improve the generator experience and measurement without changing the existing
Minecraft UV mapping algorithm. Keep the current broad market positioning while
making successful output easier to understand, inspect, adjust, and download.

## Scope

- Preserve `mapImageToSkin` and all Java/Bedrock export behavior.
- Replace decorative example claims with one conversion case produced by the
  real generator.
- Present source, 3D preview, and unfolded texture as one verification flow.
- Add guidance near the result so users inspect the model before downloading.
- Measure upload, preview, source adjustment, download, and retry behavior.
- Add an optional, collapsed source adjustment experiment. Automatic generation
  remains the default path.

## Source Adjustment

The adjustment UI exposes only pan, zoom, and reset. It does not expose UV
coordinates or alter skin layouts. The adjusted source is rendered into a
square preprocessing canvas and then passed to the existing mapper.

The control remains secondary and collapsed after upload. This preserves the
fast path while providing a recovery path when the default framing is poor.
Desktop pointer and keyboard controls and mobile touch controls must share the
same bounded transform model.

## Case Presentation

The initial case uses the built-in aligned pixel character because its exported
texture has been verified in the real 3D viewer. The case must show honest
artifacts rather than generated mock output. Additional cases can be added only
after passing the same source-to-export verification.

## Analytics

Extend the privacy-safe event vocabulary with:

- `skin_preview_inspected`
- `skin_source_adjustment_opened`
- `skin_source_adjusted`
- `skin_source_adjustment_reset`
- `skin_retry_started`

Payloads contain only format, model, adjustment type, and numeric transform
values. No file names, image contents, or user text are collected.

## Error Handling

Invalid files continue to use the existing validation path. Adjustment controls
are unavailable until a valid image is decoded. Reset always restores the exact
uploaded source. A preprocessing failure falls back to the unadjusted source
instead of preventing download.

## Verification

- Unit-test transform bounds, reset behavior, and analytics payload filtering.
- Add E2E coverage for the default fast path and optional adjustment path.
- Verify source, 3D preview, texture, and download on desktop and mobile.
- Run `pnpm check`, relevant Playwright specs, and `pnpm build`.

## Rollback

The mapper remains untouched. The adjustment component and preprocessing helper
can be removed independently, and the default upload-to-download path remains
compatible with the current implementation.
