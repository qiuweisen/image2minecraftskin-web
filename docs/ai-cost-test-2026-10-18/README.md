# image2minecraftskin AI skin — KIE real-cost test (2026-10-18)

## Official price (source)
- https://kie.ai/nano-banana-2 (pricing line, EN): "8 credits ($0.04) for 1K, 12 credits ($0.06) for 2K, 18 credits ($0.09) for 4K"; same page ZH line: "1K 5 credits ($0.025), 2K 8 credits ($0.04), 4K 12 credits ($0.06)".
- 1 credit = $0.005 (1 USD = 200 credits); high-tier top-ups give +5–10% bonus credits.
- Docs: https://docs.kie.ai/market/google/nanobanana2 ; model id `nano-banana-2`, `resolution: 1K` (same as coloringeasy provider).
- **Actually billed: 5 credits ($0.025) per 1K call** (task record `creditsConsumed` = 5 on all 4 calls; balance 776 -> 756 for 4 calls; base64 upload is free).

## Cheaper alternatives on KIE (not tested)
| model id | 1K price |
|---|---|
| nano-banana-2-1 (Nano Banana 2.1) | 4 credits = $0.02 (2K 6, 4K 9) |
| nano-banana-2-lite | 4 credits = $0.02 |
| Nano Banana (Gemini 2.5 Flash Image) | 4 credits = $0.02 |
| Seedream 4.0 | 5 credits = $0.025 |

## Runs (`runs.jsonl`)
| input | credits | latency | layout L-front / R-back |
|---|---|---|---|
| portrait-selfie (wrong prompt, script bug) | 5 | 172 s | n/a |
| portrait-selfie | 5 | 34 s | OK |
| pet (cat) | 5 | 276 s | OK (model drew a black divider line; mapper strips it) |
| full-body (angel statue) | 5 | 63 s | OK (wings/crown widen the figure; mapping is rougher) |

Layout compliance 3/3 with the plan prompt. Skins in `skins/` come from a quick Python prototype (`map_skin.py`) of the plan's ai-sheet step (halves -> bbox -> 32-unit body proportions -> 64x64 Java classic); it is not the production mapper.

Sheet: `comparison-sheet.png`. Cost model: `cost-model.md`.
