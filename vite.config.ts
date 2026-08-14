import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath, URL } from 'url';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import contentCollections from '@content-collections/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

// Keep localized root URLs identical to production (`/zh-hans`, not
// `/zh-hans/`). Paraglide's default pattern uses `/:path(.*)?`, which leaves
// the separator when the optional path is empty. The server canonicalizes
// trailing slashes away, so that combination would create a redirect loop.
const paraglideLocales = [
  'en',
  'zh',
  'es-419',
  'pt',
  'fr',
  'de',
  'ru',
  'ja',
  'ko',
  'zh-hans',
  'zh-hant',
  'ar',
  'it',
  'nl',
  'pl',
  'tr',
  'vi',
  'th',
  'id',
  'hi',
  'he',
  'fa',
  'uk',
  'cs',
  'sv',
  'no',
  'da',
  'fi',
  'el',
  'ro',
  'hu',
  'bg',
  'sk',
  'sl',
  'sr',
  'ms',
  'bn',
  'ur',
  'ta',
  'te',
] as const;

const paraglideUrlPatterns = [
  // Keep localized homepages slashless (`/zh-hans`), matching the existing
  // production URL contract. A separate root pattern is necessary because
  // URLPattern's `:path*` form does not match an empty pathname.
  {
    pattern: ':protocol://:domain(.*)::port?/',
    localized: [
      ...paraglideLocales
        .filter((locale) => locale !== 'en')
        .map(
          (locale) =>
            [locale, `:protocol://:domain(.*)::port?/${locale}`] as [
              string,
              string,
            ]
        ),
      ['en', ':protocol://:domain(.*)::port?/'] as [string, string],
    ],
  },
  // All non-root paths retain the locale prefix and may contain any number
  // of nested segments.
  {
    pattern: ':protocol://:domain(.*)::port?/:path+',
    localized: [
      ...paraglideLocales
        .filter((locale) => locale !== 'en')
        .map(
          (locale) =>
            [locale, `:protocol://:domain(.*)::port?/${locale}/:path+`] as [
              string,
              string,
            ]
        ),
      ['en', ':protocol://:domain(.*)::port?/:path+'] as [string, string],
    ],
  },
];

const stripeE2EConfig =
  process.env.STRIPE_E2E_RUN === 'true'
    ? {
        vars: {
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
          STRIPE_WEBHOOK_SECRET: process.env.STRIPE_E2E_WEBHOOK_SECRET ?? '',
          VITE_BASE_URL: process.env.VITE_BASE_URL ?? '',
          BETTER_AUTH_SECRET:
            process.env.BETTER_AUTH_SECRET ??
            'e2e-better-auth-secret-at-least-32-characters',
        },
      }
    : undefined;

/**
 * Vite configuration
 * https://vite.dev/config/
 */
const config = defineConfig({
  // TanStack Start's SSR output is uploaded as separate Worker modules.
  // Vite does not minify that output by default, so enable it explicitly to
  // stay within Cloudflare Workers Free's 3 MiB compressed script limit.
  build: {
    minify: 'esbuild',
  },
  server: {
    allowedHosts: ['.trycloudflare.com', '.tanstarter.dev'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    devtools({
      eventBusConfig: {
        port: 0,
      },
    }),
    tailwindcss(),
    contentCollections(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/locale/paraglide',
      strategy: ['url', 'cookie', 'baseLocale'],
      urlPatterns: paraglideUrlPatterns,
      routeStrategies: [
        { match: '/api/:path(.*)?', exclude: true },
        { match: '/robots.txt', exclude: true },
        { match: '/sitemap.xml', exclude: true },
        { match: '/manifest.json', exclude: true },
      ],
      emitTsDeclarations: true,
      isServer: 'import.meta.env?.SSR === true',
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    // https://tanstack.dev/start/latest/docs/framework/react/build-from-scratch
    tanstackStart({
      srcDirectory: 'src',
      start: { entry: './start.tsx' },
      server: { entry: './server.ts' },
    }),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
    // https://developers.cloudflare.com/workers/vite-plugin/
    cloudflare({
      config: stripeE2EConfig,
      persistState: process.env.E2E_PERSIST_PATH
        ? { path: process.env.E2E_PERSIST_PATH }
        : undefined,
      viteEnvironment: {
        name: 'ssr',
      },
    }),
  ],
});

export default config;
