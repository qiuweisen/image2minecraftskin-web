# Locale

This project uses Paraglide JS for runtime locale support.

## Locales

- Base locale: `en`
- Canonical selectable locales: English, Simplified Chinese, Traditional
  Chinese, and the other historical
  ChartMini languages configured in `project.inlang/settings.json`
- Default English URLs are unprefixed: `/about`
- Simplified Chinese URLs use the original prefix: `/zh-hans/about`
- The migration-only `/zh/...` alias redirects to `/zh-hans/...` so the
  historical SEO URL remains canonical.

## Files

- Source messages: `project.inlang/messages/*.json`
- Paraglide settings: `project.inlang/settings.json`
- Generated runtime: `src/locale/paraglide/`
- Project locale helpers: `src/lib/locale.ts`
- Server middleware wrapper: `src/locale/middleware.ts`

Markdown content stays in the same collection directory. English content uses
the base filename, while localized variants add the locale before `.md`:

```txt
content/blog/getting-started.md
content/blog/getting-started.zh-hans.md
content/changelog/v1.0.0.md
content/changelog/v1.0.0.zh-hans.md
content/pages/privacy.md
content/pages/privacy.zh-hans.md
```

`content-collections.ts` strips the locale suffix from the route slug. Existing
`.zh.md` files are treated as Simplified Chinese for compatibility, so
`getting-started.md` and `getting-started.zh-hans.md` both map to
`/blog/getting-started` under their respective URL locale.

`src/locale/paraglide/` is generated code and is ignored by git.

## Commands

```bash
pnpm locale:sort      # sort message keys by prefix/name in all locale JSON files
pnpm locale:check     # verify every configured locale has the same keys
pnpm locale:compile   # compile Paraglide runtime manually
```

`pnpm dev` and `pnpm build` also compile the Paraglide runtime via Vite.

## Message Access

Application code reads messages directly from the generated Paraglide module:

```ts
import { m } from '@/locale/paraglide/messages';

m.auth_login_email();
```

`project.inlang/messages/*.json` is the single source of UI and email message
truth. Do not add parallel TS message source files or nested compatibility
layers.

When a server-side workflow must always render in English, pass an explicit
locale option:

```ts
m.mail_verify_email_subject(undefined, { locale: 'en' });
```

Small arrays and record-like values, such as pricing feature lists, are stored
as JSON strings in Paraglide messages and parsed through `parseMessageJson()`
in `src/lib/locale.ts`.

Structured UI content, such as Homepage, AI Playground, and Roadmap copy, still
uses individual message keys in `project.inlang/messages/*.json`. Do not store a
whole page or block tree as one JSON-string message. Components should call the
generated flat `m.key()` functions directly. If a component needs a list, define
that list in the component and use `m.key()` for the translatable fields.

## Adding Copy

- Short UI copy: add the same key to `project.inlang/messages/en.json` and
  `project.inlang/messages/zh-hans.json`, run `pnpm locale:sort`, then call the
  generated `m.key()`.
- Email copy: add the key to the JSON files and read it through
  `m.key(undefined, { locale: 'en' })`.
- Homepage, AI, or Roadmap structured copy: add or update individual message
  keys in the JSON files, then call the generated `m.key()` functions directly
  from the component.
- Long-form content: add Markdown files, for example `post.md` and
  `post.zh.md`.

## Current Scope

The current implementation supports:

- Runtime UI messages through `@/locale/paraglide/messages`
- Homepage blocks through direct `m.key()` calls
- AI Playground UI through direct `m.key()` calls
- Roadmap board content through direct `m.key()` calls
- Blog Markdown content with locale-aware content collections
- Changelog Markdown content with locale-aware content collections
- Legal Markdown pages with locale-aware content collections
- Locale-aware canonical, hreflang, and sitemap output

The current implementation intentionally does not handle:

- User profile locale storage
- Email locale
