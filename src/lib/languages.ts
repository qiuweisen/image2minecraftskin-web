export const supportedLangs = [
  'en',
  'es',
  'pt',
  'fr',
  'de',
  'ru',
  'ja',
  'ko',
  'zh-Hans',
  'zh-Hant',
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

export type SupportedLang = (typeof supportedLangs)[number];

export const rtlLangs = new Set<SupportedLang>([
  'ar',
  'he',
  'fa',
  'ur',
] as const);

const supportedLangSet = new Set<string>(supportedLangs as readonly string[]);

export function asSupportedLang(
  value: string | null | undefined
): SupportedLang | null {
  if (!value) return null;
  return supportedLangSet.has(value) ? (value as SupportedLang) : null;
}

export function detectSupportedLang(
  candidates: readonly string[]
): SupportedLang | null {
  for (const raw of candidates) {
    const nav = raw.toLowerCase();
    const primary = nav.split('-')[0];

    if (primary === 'zh') {
      return nav.includes('hant') ||
        nav.includes('tw') ||
        nav.includes('hk') ||
        nav.includes('mo')
        ? 'zh-Hant'
        : 'zh-Hans';
    }

    if (primary === 'nb' || primary === 'nn' || primary === 'no') {
      return supportedLangSet.has('no') ? 'no' : null;
    }

    if (supportedLangSet.has(primary)) {
      return primary as SupportedLang;
    }
  }

  return null;
}

export function parseAcceptLanguage(
  headerValue: string | null | undefined
): SupportedLang | null {
  if (!headerValue) return null;

  const candidates = headerValue
    .split(',')
    .map((part) => {
      const [tagPart, ...params] = part.trim().split(';');
      const qParam = params.find((param) => param.trim().startsWith('q='));
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
      return {
        tag: tagPart.trim(),
        q: Number.isFinite(q) ? q : 0,
      };
    })
    .filter((item) => item.tag && item.tag !== '*')
    .sort((a, b) => b.q - a.q)
    .map((item) => item.tag);

  return detectSupportedLang(candidates);
}

// Map internal lang code -> path prefix
export const langToPrefix: Record<SupportedLang, string> = {
  en: '/en',
  es: '/es-419',
  pt: '/pt',
  fr: '/fr',
  de: '/de',
  ru: '/ru',
  ja: '/ja',
  ko: '/ko',
  'zh-Hans': '/zh-hans',
  'zh-Hant': '/zh-hant',
  ar: '/ar',
  it: '/it',
  nl: '/nl',
  pl: '/pl',
  tr: '/tr',
  vi: '/vi',
  th: '/th',
  id: '/id',
  hi: '/hi',
  he: '/he',
  fa: '/fa',
  uk: '/uk',
  cs: '/cs',
  sv: '/sv',
  no: '/no',
  da: '/da',
  fi: '/fi',
  el: '/el',
  ro: '/ro',
  hu: '/hu',
  bg: '/bg',
  sk: '/sk',
  sl: '/sl',
  sr: '/sr',
  ms: '/ms',
  bn: '/bn',
  ur: '/ur',
  ta: '/ta',
  te: '/te',
};

export const prefixToLang: Record<string, SupportedLang> = Object.fromEntries(
  Object.entries(langToPrefix).map(([k, v]) => [v, k as SupportedLang])
) as Record<string, SupportedLang>;

export const hreflangByLang: Record<SupportedLang, string> = {
  en: 'en',
  es: 'es',
  pt: 'pt-BR',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  ja: 'ja',
  ko: 'ko',
  'zh-Hans': 'zh-Hans',
  'zh-Hant': 'zh-Hant',
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

export function getPublicLocalePath(lang: SupportedLang): string {
  return lang === 'en' ? '/' : langToPrefix[lang];
}

export function getHreflang(lang: SupportedLang): string {
  return hreflangByLang[lang];
}

export function langFromLocaleParam(
  locale: string | null | undefined
): SupportedLang | null {
  if (!locale) return null;
  return prefixToLang[`/${locale.toLowerCase()}`] || null;
}

export const localizedLocaleParams = supportedLangs
  .filter((lang) => lang !== 'en')
  .map((lang) => langToPrefix[lang].slice(1));

// Hreflang mapping for <head> alternates (SEO). Keep zh/tw/es keys as requested.
export const alternatesLanguages: Record<string, string> = {
  en: '/',
  es: '/es-419',
  ru: '/ru',
  ja: '/ja',
  ko: '/ko',
  de: '/de',
  fr: '/fr',
  pt: '/pt',
  ar: '/ar',
  it: '/it',
  nl: '/nl',
  pl: '/pl',
  tr: '/tr',
  vi: '/vi',
  th: '/th',
  id: '/id',
  hi: '/hi',
  he: '/he',
  fa: '/fa',
  uk: '/uk',
  cs: '/cs',
  sv: '/sv',
  no: '/no',
  da: '/da',
  fi: '/fi',
  el: '/el',
  ro: '/ro',
  hu: '/hu',
  bg: '/bg',
  sk: '/sk',
  sl: '/sl',
  sr: '/sr',
  ms: '/ms',
  bn: '/bn',
  ur: '/ur',
  ta: '/ta',
  te: '/te',
  'zh-Hans': '/zh-hans',
  'zh-Hant': '/zh-hant',
  'x-default': '/',
};

export function stripLocale(p: string): string {
  const prefixes = Object.values(langToPrefix)
    .map((s) => s.replace('/', '')) // 'en', 'es-419', 'zh-hans' ...
    .join('|');
  const re = new RegExp(`^/(?:${prefixes})(?=/|$)`);
  return p.replace(re, '');
}

// Map site language -> Open Graph locale code
export function ogLocaleOf(lang: SupportedLang): string {
  const map: Partial<Record<SupportedLang, string>> = {
    es: 'es_LA',
    en: 'en_US',
    fr: 'fr_FR',
    de: 'de_DE',
    it: 'it_IT',
    nl: 'nl_NL',
    pl: 'pl_PL',
    ru: 'ru_RU',
    ja: 'ja_JP',
    ko: 'ko_KR',
    ar: 'ar_AR',
    tr: 'tr_TR',
    vi: 'vi_VN',
    th: 'th_TH',
    id: 'id_ID',
    hi: 'hi_IN',
    he: 'he_IL',
    fa: 'fa_IR',
    uk: 'uk_UA',
    cs: 'cs_CZ',
    sv: 'sv_SE',
    no: 'nb_NO',
    da: 'da_DK',
    fi: 'fi_FI',
    el: 'el_GR',
    ro: 'ro_RO',
    hu: 'hu_HU',
    bg: 'bg_BG',
    sk: 'sk_SK',
    sl: 'sl_SI',
    sr: 'sr_RS',
    ms: 'ms_MY',
    bn: 'bn_BD',
    ur: 'ur_PK',
    ta: 'ta_IN',
    te: 'te_IN',
    'zh-Hans': 'zh_CN',
    'zh-Hant': 'zh_TW',
    pt: 'pt_BR',
  };
  return map[lang] || 'en_US';
}

export function ogAlternateLocales(current: SupportedLang): string[] {
  const all = (supportedLangs as readonly SupportedLang[]).map(ogLocaleOf);
  const cur = ogLocaleOf(current);
  return Array.from(new Set(all.filter((x) => x !== cur)));
}
