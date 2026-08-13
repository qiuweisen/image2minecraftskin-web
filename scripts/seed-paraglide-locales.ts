import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { join, resolve } from 'node:path';

type Messages = Record<string, string>;
type Meta = {
  title: string;
  description: string;
};

const messageDir = resolve('project.inlang/messages');
const legacyLocaleDir = resolve(
  '../../TradeGame-cloudflare-migration-test/src/locales'
);

const localeToLegacyFile: Record<string, string> = {
  'es-419': 'es',
  pt: 'pt',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  ja: 'ja',
  ko: 'ko',
  'zh-hans': 'zh-Hans',
  'zh-hant': 'zh-Hant',
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

const homeMappings: Record<string, string> = {
  common_home: 'home',
  home_hero_title_line_1: 'heroH1Line1',
  home_hero_title_line_2: 'heroH1Line2',
  home_hero_description: 'heroTitle',
  home_hero_introduction: 'badgeAI',
  home_features_items_item_1_title: 'feature1Title',
  home_features_items_item_1_description: 'feature1Desc',
  home_features_items_item_2_title: 'feature2Title',
  home_features_items_item_2_description: 'feature2Desc',
  home_features_items_item_3_title: 'feature3Title',
  home_features_items_item_3_description: 'feature3Desc',
  home_features_items_item_4_title: 'feature4Title',
  home_features_items_item_4_description: 'feature4Desc',
  home_how_it_works_title: 'howItWorksTitle',
  home_how_it_works_step_1_title: 'step1Title',
  home_how_it_works_step_1_description: 'step1Desc',
  home_how_it_works_step_2_title: 'step2Title',
  home_how_it_works_step_2_description: 'step2Desc',
  home_how_it_works_step_3_title: 'step3Title',
  home_how_it_works_step_3_description: 'step3Desc',
  home_stats_items_item_1_title: 'statsSessions',
  home_stats_items_item_2_title: 'statsLanguages',
  home_stats_items_item_3_title: 'statsAssets',
  home_stats_items_item_4_title: 'statsFree',
  home_stats_title: 'statsTitle',
  home_stats_subtitle: 'statsTitle',
  home_faqs_title: 'faqTitle',
  home_faqs_subtitle: 'faqTitle',
  home_body_title: 'bodyTitle',
  home_body_paragraph_1: 'bodyParagraph1',
  home_body_paragraph_2: 'bodyParagraph2',
  home_call_to_action_title: 'ctaTitle',
  home_call_to_action_description: 'ctaSubtitle',
  home_call_to_action_primary_button: 'ctaButton',
  home_call_to_action_secondary_button: 'ctaButton',
};

for (let index = 1; index <= 8; index += 1) {
  homeMappings[`home_faqs_items_item_${index}_question`] = `faq${index}Q`;
  homeMappings[`home_faqs_items_item_${index}_answer`] = `faq${index}A`;
}

function toMessageKey(key: string) {
  return key
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

async function readLegacyDictionary(locale: string): Promise<Messages> {
  const module = (await import(
    pathToFileURL(join(legacyLocaleDir, `${locale}.ts`)).href
  )) as Record<string, unknown>;
  const dictionary = Object.values(module).find(
    (value) => value && typeof value === 'object' && !Array.isArray(value)
  );

  if (!dictionary) {
    throw new Error(`Could not find dictionary in legacy locale ${locale}`);
  }

  return dictionary as Messages;
}

async function readLegacySeo() {
  const metaModule = (await import(
    pathToFileURL(
      resolve('../../TradeGame-cloudflare-migration-test/src/lib/i18n/meta.ts')
    ).href
  )) as {
    default?: {
      metaByLang: Record<string, Meta>;
      getPlayMeta: (locale: string) => Meta;
    };
    metaByLang?: Record<string, Meta>;
    getPlayMeta?: (locale: string) => Meta;
  };
  const module = metaModule.default ?? metaModule;

  const dayTradingModule = (await import(
    pathToFileURL(
      resolve(
        '../../TradeGame-cloudflare-migration-test/src/lib/i18n/dayTrading.ts'
      )
    ).href
  )) as {
    default?: {
      getDayTradingMeta: (locale: string) => Meta;
    };
    getDayTradingMeta?: (locale: string) => Meta;
  };
  const dayTrading = dayTradingModule.default ?? dayTradingModule;

  if (
    !module.metaByLang ||
    !module.getPlayMeta ||
    !dayTrading.getDayTradingMeta
  ) {
    throw new Error('Could not load legacy SEO dictionaries');
  }

  return {
    metaByLang: module.metaByLang,
    getPlayMeta: module.getPlayMeta,
    getDayTradingMeta: dayTrading.getDayTradingMeta,
  };
}

const english = JSON.parse(
  await readFile(join(messageDir, 'en.json'), 'utf8')
) as Messages;
const legacySeo = await readLegacySeo();

for (const [locale, legacyFile] of Object.entries(localeToLegacyFile)) {
  const legacy = await readLegacyDictionary(legacyFile);
  const messages: Messages = { ...english };

  for (const [key, value] of Object.entries(legacy)) {
    const messageKey = `simulator_${toMessageKey(key)}`;
    if (messageKey in messages) messages[messageKey] = value;
  }

  for (const [messageKey, legacyKey] of Object.entries(homeMappings)) {
    const value = legacy[legacyKey];
    if (typeof value === 'string' && messageKey in messages) {
      messages[messageKey] = value;
    }
  }

  const homeMeta = legacySeo.metaByLang[legacyFile];
  if (homeMeta) {
    messages.site_title = homeMeta.title;
    messages.site_description = homeMeta.description;
  }

  const playMeta = legacySeo.getPlayMeta(legacyFile);
  if (playMeta) {
    messages.seo_play_title = playMeta.title;
    messages.seo_play_description = playMeta.description;
  }

  const dayTradingMeta = legacySeo.getDayTradingMeta(legacyFile);
  if (dayTradingMeta) {
    messages.seo_day_trading_title = dayTradingMeta.title;
    messages.seo_day_trading_description = dayTradingMeta.description;
  }

  await writeFile(
    join(messageDir, `${locale}.json`),
    `${JSON.stringify(messages, null, 2)}\n`
  );
  console.log(`Seeded ${locale} from ${legacyFile}.ts`);
}
