# Generator iteration - 2026-09-30

## Data caveats (old events)

Events before this change can't be used to compute a funnel:

- `skin_generation_completed` fired on every slider tick and format toggle, and on the auto-generated example. 461 is not a count of attempts.
- `skin_source_adjusted` fired on every slider tick. 263 is not "3.65 adjustments per user".
- `skin_downloaded` included example downloads, so 58/72 is not an upload-to-download rate.

What the data does support: most sessions never upload (72 uploads, 101 sessions over the same window), and AI Improve was almost unused (2 clicks).

## New event semantics

- `skin_generation_completed`: once per source, with `origin: example | upload`.
- `skin_source_adjusted`: once per axis per source, with `origin`.
- `skin_downloaded`: adds `origin` and `framing: pose_parts | transform`.
- `skin_source_improved`: `trigger: auto_upload | button`.
- `skin_ai_improve_completed`: `mode: pose_parts | pose_parts_auto | framing`.

Funnel to track: upload sessions → `skin_downloaded` with `origin=upload`, split by `framing`.

## Algorithm changes

1. Face-aware mapping. The front crop used to be repeated on all six faces of each part, which put the face on the back and top of the head. Hidden faces now sample edge strips of the front crop, the head back uses the hair band, and body backs mirror the front.
2. Area-averaged, alpha-weighted downsampling instead of single-pixel sampling. Java→Bedrock scaling stays nearest-neighbour.
3. Pose-based part crops (MediaPipe) sized from shoulder and hip width. They run automatically in the background after upload. A manual framing change cancels a pending result.

Verified in Chrome: on the full-body sample the default crop is mostly background, while pose crops map hair, face, jacket and jeans correctly. First detection takes about 18s (model download from CDN), later runs about 160ms.

## Known gaps

- Arm crops still pick up some background colour.
- Non-human images (pets, logos) fall back to fixed proportions.
- Pose detection depends on jsdelivr and Google storage CDNs being reachable.

## Next review (after 7 days of new events)

- Upload rate per session.
- Upload → download rate, `pose_parts` vs `transform`.
- `skin_ai_improve_failed` reasons for `auto:`.
