import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const JSON_MESSAGE_KEYS = [
  'auth_error_codes',
  'pricing_plans_free_features',
  'pricing_plans_free_limits',
  'pricing_plans_lifetime_features',
  'pricing_plans_lifetime_limits',
  'pricing_plans_pro_features',
  'pricing_plans_pro_limits',
  'marketing_market_replay_content',
  'marketing_forex_content',
  'marketing_crypto_content',
  'marketing_intraday_content',
] as const;

const MARKETING_ARRAY_MESSAGE_KEYS = [
  'marketing_market_replay_content',
  'marketing_forex_content',
  'marketing_crypto_content',
  'marketing_intraday_content',
] as const;

async function readMessages(locale: string) {
  const raw = await readFile(
    join('project.inlang/messages', `${locale}.json`),
    'utf8'
  );
  return JSON.parse(raw) as Record<string, string>;
}

const locales = (await readdir('project.inlang/messages'))
  .filter((file) => file.endsWith('.json'))
  .map((file) => file.slice(0, -'.json'.length))
  .sort();
const en = await readMessages('en');
const enKeys = Object.keys(en).sort();
const localeMessages = new Map(
  await Promise.all(
    locales.map(async (locale) => [locale, await readMessages(locale)] as const)
  )
);

const missingKeys: Record<string, string[]> = {};
const emptyValues: Array<{ locale: string; key: string }> = [];

for (const locale of locales) {
  const messages = localeMessages.get(locale);
  if (!messages) continue;

  const keys = Object.keys(messages).sort();
  const missing = enKeys.filter((key) => !keys.includes(key));
  if (missing.length) missingKeys[locale] = missing;

  for (const key of keys) {
    if (messages[key] === '') emptyValues.push({ locale, key });
  }
}

for (const key of JSON_MESSAGE_KEYS) {
  for (const [locale, messages] of localeMessages) {
    try {
      JSON.parse(messages[key] ?? '');
    } catch {
      throw new Error(`${locale}.${key} is not valid JSON`);
    }
  }
}

for (const key of MARKETING_ARRAY_MESSAGE_KEYS) {
  const expected = JSON.parse(en[key] ?? '');
  if (!Array.isArray(expected)) {
    throw new Error(`en.${key} must be a JSON array`);
  }
  for (const [locale, messages] of localeMessages) {
    const value = JSON.parse(messages[key] ?? '');
    if (!Array.isArray(value) || value.length !== expected.length) {
      throw new Error(`${locale}.${key} must contain ${expected.length} items`);
    }
  }
}

if (Object.keys(missingKeys).length || emptyValues.length) {
  console.error(JSON.stringify({ missingKeys, emptyValues }, null, 2));
  process.exit(1);
}

console.log(
  `Locale keys OK (${enKeys.length} keys, ${locales.length} locales)`
);
