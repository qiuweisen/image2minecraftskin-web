#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const messagesDirectory = path.join(root, 'project.inlang', 'messages');
const outputDirectory = path.join(root, 'public', 'marketing-content');

const pageKeys = {
  'market-replay': 'marketing_market_replay_content',
  forex: 'marketing_forex_content',
  crypto: 'marketing_crypto_content',
  intraday: 'marketing_intraday_content',
};

function parseContent(locale, key, rawValue) {
  if (typeof rawValue !== 'string') {
    throw new Error(
      `[marketing-content] ${locale}.${key} must be a JSON string`
    );
  }

  let value;
  try {
    value = JSON.parse(rawValue);
  } catch (error) {
    throw new Error(
      `[marketing-content] ${locale}.${key} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(
      `[marketing-content] ${locale}.${key} must contain an array of strings`
    );
  }

  return value;
}

const localeFiles = fs
  .readdirSync(messagesDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
  .map((entry) => entry.name)
  .sort();

fs.mkdirSync(outputDirectory, { recursive: true });

let generatedFiles = 0;
for (const file of localeFiles) {
  const locale = file.replace(/\.json$/, '');
  const messages = JSON.parse(
    fs.readFileSync(path.join(messagesDirectory, file), 'utf8')
  );
  const localeDirectory = path.join(outputDirectory, locale);
  fs.mkdirSync(localeDirectory, { recursive: true });

  for (const [page, key] of Object.entries(pageKeys)) {
    const content = parseContent(locale, key, messages[key]);
    fs.writeFileSync(
      path.join(localeDirectory, `${page}.json`),
      `${JSON.stringify(content)}\n`
    );
    generatedFiles += 1;
  }
}

console.log(
  `[marketing-content] wrote ${generatedFiles} locale page assets → ${path.relative(root, outputDirectory)}`
);
