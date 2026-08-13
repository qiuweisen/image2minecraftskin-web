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

if (Object.keys(missingKeys).length || emptyValues.length) {
  console.error(JSON.stringify({ missingKeys, emptyValues }, null, 2));
  process.exit(1);
}

console.log(
  `Locale keys OK (${enKeys.length} keys, ${locales.length} locales)`
);
