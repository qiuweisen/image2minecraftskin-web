# Config-Driven Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move product customization into typed configuration and initialize dormant Cloudflare D1, R2, and KV resources without enabling server-backed features.

**Architecture:** Follow `ascii-image-web`: `website.ts` owns brand and feature flags, dedicated config modules own navigation/footer/page/tool composition, and Paraglide owns every visible string. UI components remain reusable renderers. Cloudflare bindings exist independently from disabled feature flags.

**Tech Stack:** TypeScript, React 19, TanStack Start, Paraglide JS, Vitest, Playwright, Cloudflare Workers, Wrangler, D1, R2, KV.

---

### Task 1: Record Product And Technical Contracts

**Files:**
- Create: `docs/product-requirements.md`
- Create: `docs/technical-solution.md`
- Reference: `docs/plans/2026-08-25-config-driven-site-design.md`

**Step 1: Write the product contract**

Document the English-only local converter journey, SEO owner keyword, MVP and
non-goals, privacy promise, configurable landing order, locale requirement,
acceptance criteria, and later AI adapter.

**Step 2: Write the technical contract**

Document the browser-only data flow, template reuse map, config ownership map,
Cloudflare resource ledger, disabled feature flags, test gates, rollback, and
production verification.

**Step 3: Verify documents contain required sections**

Run:

```bash
rtk rg "Acceptance Criteria|Configuration|Cloudflare|Rollback" docs/product-requirements.md docs/technical-solution.md
```

Expected: every contract section is present.

**Step 4: Commit**

```bash
rtk git add docs/product-requirements.md docs/technical-solution.md
rtk git commit -m "docs: define image2minecraftskin product contracts"
```

### Task 2: Add Typed Configuration Contracts

**Files:**
- Modify: `src/types/index.d.ts`
- Create: `src/config/homepage-config.ts`
- Create: `src/config/skin-tool-config.ts`
- Create: `tests/unit/site-config.test.ts`

**Step 1: Write the failing configuration tests**

Test that:

- homepage section IDs are unique and ordered;
- the hero has three localized facts;
- FAQ entries provide resolved questions and answers;
- Java defaults to 64 and Bedrock defaults to 128;
- accepted types are PNG/JPEG/WEBP and the maximum is 10 MB;
- default format/model are valid configured options.

**Step 2: Run the test and verify failure**

```bash
rtk pnpm vitest run tests/unit/site-config.test.ts
```

Expected: FAIL because config modules do not exist.

**Step 3: Define the minimal typed config**

Extend `WebsiteConfig` with layout content fields such as `footer.tagline`.
Create getter functions that resolve current Paraglide messages at call time:

```ts
export function getHomepageConfig(): HomepageConfig {
  return {
    sections: [
      { id: 'generator', enabled: true },
      { id: 'examples', enabled: true },
      { id: 'compatibility', enabled: true },
      { id: 'faq', enabled: true },
    ],
    // All copy is returned by m.*() getters.
  };
}
```

Keep algorithm functions and runtime texture data out of configuration.

**Step 4: Run the test and verify pass**

```bash
rtk pnpm vitest run tests/unit/site-config.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
rtk git add src/types/index.d.ts src/config/homepage-config.ts src/config/skin-tool-config.ts tests/unit/site-config.test.ts
rtk git commit -m "feat: add typed product configuration"
```

### Task 3: Localize Navigation And Footer Configuration

**Files:**
- Modify: `src/config/website.ts`
- Modify: `src/config/navbar-config.ts`
- Modify: `src/config/footer-config.ts`
- Modify: `project.inlang/messages/en.json`
- Modify: `project.inlang/messages/zh.json`
- Test: `tests/unit/site-config.test.ts`

**Step 1: Add failing assertions**

Assert that navbar/footer entries contain no unresolved empty labels and that
the configured Footer tagline resolves from the English message catalog.

**Step 2: Run the narrow test**

```bash
rtk pnpm vitest run tests/unit/site-config.test.ts
```

Expected: FAIL on current hard-coded `Generator`, `Guides`, and Footer tagline.

**Step 3: Move all text to messages and config**

Replace literals in navigation/footer configuration with `m.skin_nav_*()` and
add a localized `websiteConfig.footer.tagline`. Preserve route constants and
external flags in configuration.

**Step 4: Compile and verify locale parity**

```bash
rtk pnpm locale:check
rtk pnpm locale:compile
rtk pnpm vitest run tests/unit/site-config.test.ts
```

Expected: all commands PASS.

**Step 5: Commit**

```bash
rtk git add src/config project.inlang/messages tests/unit/site-config.test.ts
rtk git commit -m "refactor: configure localized site navigation"
```

### Task 4: Convert Homepage And Tool Components To Config Consumers

**Files:**
- Modify: `src/components/blocks/homepage.tsx`
- Modify: `src/components/skin/skin-workspace.tsx`
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/routes/index.tsx`
- Modify: `tests/e2e/specs/image2minecraftskin-homepage.spec.ts`

**Step 1: Extend the E2E acceptance spec**

Assert configured navigation, localized Footer tagline, section order, Java and
Bedrock choices, local example conversion, PNG download, and absence of auth or
upload requests.

**Step 2: Add a literal-string guard**

Run:

```bash
rtk rg -n "Local conversion|No signup|Portrait|Character art|Generator|Guides|Turn images into" src/components
```

Expected before refactor: matches in product components.

**Step 3: Refactor components**

- Render homepage blocks from `getHomepageConfig()`.
- Consume accepted types, size limit, format/model lists, and defaults from
  `getSkinToolConfig()`.
- Render Footer tagline from `websiteConfig`.
- Derive FAQ JSON-LD from the same FAQ config rendered on screen.
- Keep upload state, Canvas mapping, preview, and download behavior in the tool.

**Step 4: Verify no product literals remain**

Repeat the literal-string guard. Expected: no matches in the four reusable
components, except non-visible technical values or accessibility fallbacks that
are also moved to locale where user-facing.

**Step 5: Run unit/build checks**

```bash
rtk pnpm locale:check
rtk pnpm vitest run tests/unit/site-config.test.ts tests/unit/skin-model.test.ts
rtk pnpm build
```

Expected: PASS.

**Step 6: Commit**

```bash
rtk git add src/components src/routes/index.tsx tests/e2e/specs/image2minecraftskin-homepage.spec.ts
rtk git commit -m "refactor: render product pages from configuration"
```

### Task 5: Make Public E2E Independent From Disabled D1 Features

**Files:**
- Modify: `playwright.config.ts`
- Modify: `scripts/prepare-e2e-state.ts` only if required
- Test: `tests/e2e/specs/image2minecraftskin-homepage.spec.ts`

**Step 1: Reproduce the failure**

```bash
rtk pnpm exec playwright test tests/e2e/specs/image2minecraftskin-homepage.spec.ts
```

Expected before fix: webServer fails because D1 name is absent.

**Step 2: Make E2E setup conditional**

When auth/database-backed fixtures are disabled, start Vite without preparing or
migrating D1. Retain the existing database setup path for suites that explicitly
enable it.

**Step 3: Run the homepage journey**

```bash
rtk pnpm exec playwright test tests/e2e/specs/image2minecraftskin-homepage.spec.ts
```

Expected: PASS on desktop Chromium.

**Step 4: Add and run mobile project coverage**

Add a mobile viewport/project for this public spec and verify no overflow or
overlap in the first viewport and workspace controls.

**Step 5: Commit**

```bash
rtk git add playwright.config.ts scripts/prepare-e2e-state.ts tests/e2e/specs/image2minecraftskin-homepage.spec.ts
rtk git commit -m "test: decouple public E2E from D1"
```

### Task 6: Initialize Cloudflare Resources

**Required skills:** `cloudflare`, `wrangler`

**Files:**
- Modify: `wrangler.jsonc`
- Update: `docs/technical-solution.md`

**Step 1: Confirm account and list existing resources**

```bash
rtk pnpm exec wrangler whoami
rtk pnpm exec wrangler d1 list
rtk pnpm exec wrangler r2 bucket list
rtk pnpm exec wrangler kv namespace list
```

Expected: authenticated account and no conflicting product resources, or exact
existing resource IDs to reuse.

**Step 2: Create only missing resources**

```bash
rtk pnpm exec wrangler d1 create image2minecraftskin-web
rtk pnpm exec wrangler r2 bucket create image2minecraftskin-web
rtk pnpm exec wrangler kv namespace create CACHE
```

Record returned IDs without exposing secrets. Do not run migrations.

**Step 3: Add bindings**

Add `d1_databases` binding `DB`, `r2_buckets` binding `BUCKET`, and
`kv_namespaces` binding `CACHE`, mirroring `ascii-image-web`. Keep
`storage.enable` and `cache.enable` false.

**Step 4: Verify configuration**

```bash
rtk pnpm cf-typegen
rtk pnpm build
rtk pnpm exec wrangler deploy --dry-run
```

Expected: build and dry-run show all three bindings.

**Step 5: Update the resource ledger and commit**

```bash
rtk git add wrangler.jsonc worker-configuration.d.ts docs/technical-solution.md
rtk git commit -m "chore: initialize Cloudflare resource bindings"
```

### Task 7: Final Verification And Push

**Required skill:** `verification-before-completion`

**Files:**
- Verify all changed files

**Step 1: Run the scoped quality gate**

```bash
rtk pnpm locale:check
rtk pnpm vitest run tests/unit/site-config.test.ts tests/unit/skin-model.test.ts
rtk pnpm exec playwright test tests/e2e/specs/image2minecraftskin-homepage.spec.ts
rtk pnpm build
rtk pnpm exec wrangler deploy --dry-run
```

Expected: all PASS. Run broader `pnpm check` and report any remaining template
debt separately rather than hiding failures.

**Step 2: Review diff and repository status**

```bash
rtk git diff --check
rtk git status --short
rtk git log --oneline -8
```

Expected: no whitespace errors; unrelated user files remain untouched.

**Step 3: Push the feature branch**

```bash
rtk git push image2minecraft feat/image2minecraftskin-mvp
```

Expected: GitHub branch updates successfully. Do not deploy or attach the custom
domain unless separately requested after verification.
