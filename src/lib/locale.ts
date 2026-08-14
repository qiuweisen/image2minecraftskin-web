import {
  baseLocale,
  deLocalizeHref,
  getLocale,
  locales,
  localizeHref,
  type Locale,
} from '@/locale/paraglide/runtime';
import type { SupportedLang } from '@/lib/languages';

export {
  baseLocale,
  deLocalizeHref,
  getLocale,
  locales,
  localizeHref,
  type Locale,
};

type LocaleConfig = {
  flag: string;
  name: string;
  hreflang: string;
  ogLocale: string;
};

const localeNames: Record<string, string> = {
  en: 'English',
  zh: '简体中文',
  'es-419': 'Español',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  'zh-hans': '简体中文',
  'zh-hant': '繁體中文',
  ar: 'العربية',
  it: 'Italiano',
  nl: 'Nederlands',
  pl: 'Polski',
  tr: 'Türkçe',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  id: 'Bahasa Indonesia',
  hi: 'हिन्दी',
  he: 'עברית',
  fa: 'فارسی',
  uk: 'Українська',
  cs: 'Čeština',
  sv: 'Svenska',
  no: 'Norsk',
  da: 'Dansk',
  fi: 'Suomi',
  el: 'Ελληνικά',
  ro: 'Română',
  hu: 'Magyar',
  bg: 'Български',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
  sr: 'Српски',
  ms: 'Bahasa Melayu',
  bn: 'বাংলা',
  ur: 'اردو',
  ta: 'தமிழ்',
  te: 'తెలుగు',
};

const localeHreflangs: Record<string, string> = {
  zh: 'zh-Hans',
  'es-419': 'es',
  // Keep the production hreflang contract. The URL remains /pt, while the
  // current production site publishes `pt`, not `pt-BR`.
  pt: 'pt',
  'zh-hans': 'zh-Hans',
  'zh-hant': 'zh-Hant',
};

const localeOgLocales: Record<string, string> = {
  zh: 'zh_CN',
  'zh-hans': 'zh_CN',
  'zh-hant': 'zh_TW',
};

// TanStarter's native locale switcher uses a small `flag` string in the
// locale config. Keep that approach, but provide a real regional indicator
// for every language instead of using the generic globe placeholder.
const localeFlags: Record<string, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  'es-419': '🇲🇽',
  pt: '🇧🇷',
  fr: '🇫🇷',
  de: '🇩🇪',
  ru: '🇷🇺',
  ja: '🇯🇵',
  ko: '🇰🇷',
  'zh-hans': '🇨🇳',
  'zh-hant': '🇭🇰',
  ar: '🇸🇦',
  it: '🇮🇹',
  nl: '🇳🇱',
  pl: '🇵🇱',
  tr: '🇹🇷',
  vi: '🇻🇳',
  th: '🇹🇭',
  id: '🇮🇩',
  hi: '🇮🇳',
  he: '🇮🇱',
  fa: '🇮🇷',
  uk: '🇺🇦',
  cs: '🇨🇿',
  sv: '🇸🇪',
  no: '🇳🇴',
  da: '🇩🇰',
  fi: '🇫🇮',
  el: '🇬🇷',
  ro: '🇷🇴',
  hu: '🇭🇺',
  bg: '🇧🇬',
  sk: '🇸🇰',
  sl: '🇸🇮',
  sr: '🇷🇸',
  ms: '🇲🇾',
  bn: '🇧🇩',
  ur: '🇵🇰',
  ta: '🇮🇳',
  te: '🇮🇳',
};

export const localeConfig = Object.fromEntries(
  locales.map((locale) => [
    locale,
    {
      flag: localeFlags[locale] ?? '🌐',
      name: localeNames[locale] ?? locale,
      hreflang: localeHreflangs[locale] ?? locale,
      ogLocale:
        localeOgLocales[locale] ??
        (localeHreflangs[locale] ?? locale).replace('-', '_'),
    },
  ])
) as Record<Locale, LocaleConfig>;

// `zh` was introduced by the TanStarter migration, but the existing ChartMini
// site uses `/zh-hans` for Simplified Chinese. Keep `/zh` routable as a
// compatibility alias while making `/zh-hans` the only selectable locale.
const legacyLocaleAliases = new Set<Locale>(['zh']);

// Keep the most commonly used languages at the top of every native locale
// selector. Locales not listed here retain their configured order below them.
const commonLocaleOrder: Locale[] = [
  'en',
  'zh-hans',
  'zh-hant',
  'es-419',
  'pt',
  'fr',
  'de',
  'ja',
  'ko',
  'ru',
  'ar',
  'hi',
  'vi',
  'id',
  'it',
  'tr',
  'nl',
  'th',
  'pl',
];

const commonLocalePriority = new Map(
  commonLocaleOrder.map((locale, index) => [locale, index])
);

export const selectableLocales = locales
  .filter((locale) => !legacyLocaleAliases.has(locale))
  .sort(
    (left, right) =>
      (commonLocalePriority.get(left) ?? Number.MAX_SAFE_INTEGER) -
      (commonLocalePriority.get(right) ?? Number.MAX_SAFE_INTEGER)
  );

export function getCanonicalLocale(locale: Locale): Locale {
  return locale === 'zh' ? 'zh-hans' : locale;
}

/**
 * Adapter for legacy ChartMini dictionaries that still use the historical
 * language identifiers. Paraglide uses URL-safe BCP 47 identifiers while the
 * simulator copy modules predate the migration.
 */
const legacyLangByLocale: Record<string, SupportedLang> = {
  en: 'en',
  zh: 'zh-Hans',
  'zh-hans': 'zh-Hans',
  'zh-hant': 'zh-Hant',
  'es-419': 'es',
  pt: 'pt',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  ja: 'ja',
  ko: 'ko',
  ar: 'ar',
  it: 'it',
  nl: 'nl',
  pl: 'pl',
  tr: 'tr',
  vi: 'vi',
  th: 'th',
  id: 'id',
  hi: 'hi',
  he: 'he',
  fa: 'fa',
  uk: 'uk',
  cs: 'cs',
  sv: 'sv',
  no: 'no',
  da: 'da',
  fi: 'fi',
  el: 'el',
  ro: 'ro',
  hu: 'hu',
  bg: 'bg',
  sk: 'sk',
  sl: 'sl',
  sr: 'sr',
  ms: 'ms',
  bn: 'bn',
  ur: 'ur',
  ta: 'ta',
  te: 'te',
};

export function toLegacySupportedLang(locale: string): SupportedLang {
  return legacyLangByLocale[locale] ?? 'en';
}

/**
 * Public locale prefixes from the current ChartMini site. These are kept
 * separate from the Paraglide locale list so sitemap output and URL
 * compatibility remain explicit and do not invent or remove public URLs.
 */
export const chartMiniLocalePaths = [
  { prefix: '/', hreflang: 'en' },
  { prefix: '/zh-hans', hreflang: 'zh-Hans' },
  { prefix: '/es-419', hreflang: 'es' },
  { prefix: '/pt', hreflang: 'pt' },
  { prefix: '/fr', hreflang: 'fr' },
  { prefix: '/de', hreflang: 'de' },
  { prefix: '/ru', hreflang: 'ru' },
  { prefix: '/ja', hreflang: 'ja' },
  { prefix: '/ko', hreflang: 'ko' },
  { prefix: '/zh-hant', hreflang: 'zh-Hant' },
  { prefix: '/ar', hreflang: 'ar' },
  { prefix: '/it', hreflang: 'it' },
  { prefix: '/nl', hreflang: 'nl' },
  { prefix: '/pl', hreflang: 'pl' },
  { prefix: '/tr', hreflang: 'tr' },
  { prefix: '/vi', hreflang: 'vi' },
  { prefix: '/th', hreflang: 'th' },
  { prefix: '/id', hreflang: 'id' },
  { prefix: '/hi', hreflang: 'hi' },
  { prefix: '/he', hreflang: 'he' },
  { prefix: '/fa', hreflang: 'fa' },
  { prefix: '/uk', hreflang: 'uk' },
  { prefix: '/cs', hreflang: 'cs' },
  { prefix: '/sv', hreflang: 'sv' },
  { prefix: '/no', hreflang: 'no' },
  { prefix: '/da', hreflang: 'da' },
  { prefix: '/fi', hreflang: 'fi' },
  { prefix: '/el', hreflang: 'el' },
  { prefix: '/ro', hreflang: 'ro' },
  { prefix: '/hu', hreflang: 'hu' },
  { prefix: '/bg', hreflang: 'bg' },
  { prefix: '/sk', hreflang: 'sk' },
  { prefix: '/sl', hreflang: 'sl' },
  { prefix: '/sr', hreflang: 'sr' },
  { prefix: '/ms', hreflang: 'ms' },
  { prefix: '/bn', hreflang: 'bn' },
  { prefix: '/ur', hreflang: 'ur' },
  { prefix: '/ta', hreflang: 'ta' },
  { prefix: '/te', hreflang: 'te' },
] as const;

export function parseMessageJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getMessageList(value: string) {
  return parseMessageJson<string[]>(value, []);
}

export function getCanonicalPathname(pathname: string) {
  return deLocalizeHref(pathname).split('?')[0]?.split('#')[0] ?? pathname;
}

/**
 * Paths that are fully translated and should get hreflang alternates
 * in sitemap / SEO metadata. Blog content currently falls back to the
 * English production article and is intentionally not marked as localized.
 */
export const LOCALIZED_PATHS = new Set([
  '/',
  '/about',
  '/ai',
  '/changelog',
  '/contact',
  '/cookie',
  '/day-trading-simulator',
  '/market-replay',
  '/intraday-trading-practice',
  '/forex-trading-simulator',
  '/crypto-trading-simulator',
  '/resources',
  '/languages',
  '/privacy-policy',
  '/user-agreement',
  '/play',
  '/pricing',
  '/privacy',
  '/roadmap',
  '/terms',
  '/waitlist',
]);

/**
 * True for any user-visible path that exists in every locale and therefore
 * needs hreflang alternates (English ↔ Chinese, x-default). Used by both
 * `seo()` metadata and the dynamic sitemap.
 */
export function isLocalizedPath(path: string): boolean {
  return LOCALIZED_PATHS.has(path);
}
