# image2minecraftskin-web — Deploy Notes

Generic Cloudflare Workers deploy procedure using an account API token
(`CF_DEPLOY_TOKEN`). Do not commit the token. Do not print it.

## Prerequisites

- Node 22 + pnpm
- Repo checked out on the commit you intend to ship
- `CF_DEPLOY_TOKEN` in the environment (box secret card or `export`)
- Account ID: `8db47976c18bf0ccb6e32d9671daedfb`
- Worker name: `image2minecraftskin-web`
- Production URL: `https://image2minecraftskin.com`
- D1 database: `image2minecraftskin-web` (`2c3ab668-8166-44a8-8f1a-f7eae5e96227`)

Also export for wrangler:

```bash
export CLOUDFLARE_API_TOKEN="$CF_DEPLOY_TOKEN"
export CLOUDFLARE_ACCOUNT_ID="8db47976c18bf0ccb6e32d9671daedfb"
export VITE_BASE_URL="https://image2minecraftskin.com"
```

## 1. Verify the token (never print it)

```bash
[ -n "$CF_DEPLOY_TOKEN" ] && echo "CF_DEPLOY_TOKEN: SET" || echo "CF_DEPLOY_TOKEN: EMPTY"

curl -sS -o /tmp/cf-verify.json -w "http=%{http_code}\n" \
  -H "Authorization: Bearer ${CF_DEPLOY_TOKEN}" \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/tokens/verify"

python3 - <<'PY'
import json
d=json.load(open("/tmp/cf-verify.json"))
print("success=", d.get("success"), "status=", (d.get("result") or {}).get("status"))
PY
```

Expect `success= True` and `status= active`.

## 2. Record the live version (rollback checkpoint)

```bash
pnpm exec wrangler deployments list --json > /tmp/wrangler-deps.json
python3 - <<'PY'
import json
raw=open("/tmp/wrangler-deps.json").read()
items=sorted(json.loads(raw[raw.find("["):]), key=lambda d: d.get("created_on") or "")
cur=items[-1]
vid=cur["versions"][0]["version_id"]
print("live_version_id=", vid)
print("live_created_on=", cur["created_on"])
open("/tmp/rollback-version.txt","w").write(vid+"\n")
PY
```

Rollback later (if needed):

```bash
pnpm exec wrangler rollback --message "rollback" "$(cat /tmp/rollback-version.txt)"
```

## 3. Remote D1 migrations (when schema changed)

```bash
pnpm db:migrate:remote
# equivalent: wrangler d1 migrations apply image2minecraftskin-web --remote
```

Inspect first if unsure:

```bash
pnpm exec wrangler d1 migrations list image2minecraftskin-web --remote
pnpm exec wrangler d1 execute image2minecraftskin-web --remote \
  --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

## 4. Build & deploy

Prefer local token deploy (GitHub Actions `deploy.yml` needs
`CLOUDFLARE_API_TOKEN` + many `VITE_*` secrets; past runs have failed when
those were missing):

```bash
pnpm run deploy
# = pnpm run build && wrangler deploy
```

Confirm the new Version ID in the wrangler output, then:

```bash
pnpm exec wrangler deployments list --json | python3 -c '
import json,sys
raw=sys.stdin.read(); items=sorted(json.loads(raw[raw.find("["):]), key=lambda d:d["created_on"])
print(items[-1]["created_on"], items[-1]["versions"][0]["version_id"])
'
```

## 5. Post-deploy live checks

1. Home: `https://image2minecraftskin.com/` → 200, GA id `G-VWSG4RTPT0` present
2. Generator: `/#generator` — upload half-body + pet fixtures, wait for
   “Ready to download”, 3D canvas visible
3. Waitlist: click **AI HD version — looks more like you**, submit email,
   confirm UI success and a row in `ai_waitlist`
4. GA events (devtools / dataLayer): see list below

```bash
pnpm exec wrangler d1 execute image2minecraftskin-web --remote \
  --command "SELECT email, created_at FROM ai_waitlist ORDER BY created_at DESC LIMIT 5;"
```

## 6. GA4 key events (manual mark)

Google Analytics token available to agents is **read-only**. Mark these as
**Key events** in GA4 Admin → Events (property for `G-VWSG4RTPT0`):

| Event | When |
| --- | --- |
| `skin_upload` | User picks a source image |
| `skin_generate_done` | Local skin generation finished |
| `skin_generation_completed` | Generation completed (origin/format/model) |
| `skin_download` / `skin_downloaded` | User downloads PNG |
| `ai_door_click` | Opens AI HD waitlist dialog |
| `ai_waitlist_submit` | Waitlist form submitted |
| `skin_models_load` / `skin_models_failed` | MediaPipe model load |
| `skin_generation_failed` | Generation error |

Optional (lower priority): `skin_format_selected`, `skin_model_selected`,
`skin_preview_inspected`, `skin_ai_improve_*`, `skin_viewer_*`.

## GitHub Actions path (fallback)

Workflow: `.github/workflows/deploy.yml` on `push` to `main` or
`workflow_dispatch`. Requires repo secrets:

- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_DATABASE_ID`
- `VITE_BASE_URL`, `VITE_GOOGLE_ANALYTICS_ID`, other `VITE_*` as listed in the workflow

If Actions secrets are incomplete, cancel the run and use the local token
path in §4.

## 2026-10-18 skin-quality-v2 ship

- Merged PR #1 → `5fa7c17` (Asia/Shanghai 14:47)
- Pre-deploy live version (rollback): `ac1b034d-2a80-40a1-b855-fad8481dc1e6`
  (deployed 2026-10-13T00:41:03Z)
- Remote D1: applied `0000`…`0005` (incl. `ai_waitlist`)
- Deployed version: `01575775-f725-481e-b173-7262aca693ef`
  (2026-10-18T06:49:09Z ≈ Asia/Shanghai 14:49)
- Live-check: home OK, half-body + pet generate OK, waitlist row OK, GA events fire
