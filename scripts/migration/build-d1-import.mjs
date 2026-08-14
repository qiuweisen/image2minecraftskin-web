#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith('--')) continue;
    const [key, inlineValue] = value.slice(2).split('=', 2);
    args[key] = inlineValue ?? argv[index + 1];
    if (inlineValue === undefined) index += 1;
  }
  return args;
}

function sql(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('SQL value must be finite');
    return String(value);
  }
  const text = String(value).replaceAll("'", "''");
  return `'${text}'`;
}

function epochMs(value, label) {
  const date = new Date(value);
  const timestamp = date.getTime();
  if (!Number.isFinite(timestamp)) throw new Error(`Invalid date in ${label}`);
  return timestamp;
}

function requiredString(value, label) {
  if (typeof value !== 'string' || value.length === 0)
    throw new Error(`${label} must be a non-empty string`);
  return value;
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const BAR_COUNT_STUDY_ID = 'Bar Count@tv-basicstudies-1';
const BAR_COUNT_STUDY_NAME = 'Bar Count';

function isBarCountSource(source) {
  const metaInfo = isRecord(source.metaInfo) ? source.metaInfo : null;
  const state = isRecord(source.state) ? source.state : null;
  const ids = [
    source.id,
    source.name,
    metaInfo?.id,
    metaInfo?.name,
    metaInfo?.description,
    state?.shortName,
  ];

  return ids.some(
    (value) => value === BAR_COUNT_STUDY_ID || value === BAR_COUNT_STUDY_NAME
  );
}

function isUserIndicatorSource(source) {
  if (!isRecord(source)) return false;
  const type = typeof source.type === 'string' ? source.type : '';
  if (type !== 'Study' && !type.startsWith('study_')) return false;
  return !isBarCountSource(source);
}

function sortJson(value) {
  if (Array.isArray(value)) return value.map(sortJson);
  if (!isRecord(value)) return value;

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, sortJson(child)])
  );
}

function emptyIndicatorTemplate() {
  return { version: 1, panes: [] };
}

/**
 * Convert the legacy full TradingView layout into the compact profile used by
 * v2. Symbols, intervals, drawings, the main series, and page-owned studies
 * are intentionally omitted. An empty profile is retained as a tombstone so
 * a stale local profile cannot resurrect indicators the user removed.
 */
function extractIndicatorTemplate(studiesText, label) {
  let value;
  try {
    value = JSON.parse(studiesText);
  } catch {
    throw new Error(`Invalid TradingView settings JSON in ${label}`);
  }

  const layout =
    isRecord(value) && isRecord(value.layout) ? value.layout : value;
  const chart =
    isRecord(layout) &&
    Array.isArray(layout.charts) &&
    isRecord(layout.charts[0])
      ? layout.charts[0]
      : null;
  if (!chart || !Array.isArray(chart.panes)) return emptyIndicatorTemplate();

  const panes = chart.panes
    .filter(isRecord)
    .map((pane) => {
      const sources = Array.isArray(pane.sources)
        ? pane.sources.filter(isUserIndicatorSource)
        : [];
      return { ...pane, sources };
    })
    .filter((pane) => pane.sources.length > 0);

  return { version: 1, panes };
}

function serializeIndicatorTemplate(template) {
  return JSON.stringify(sortJson(template));
}

function hashIndicatorTemplate(templateJson) {
  return crypto.createHash('sha256').update(templateJson).digest('hex');
}

function accountId(provider, providerAccountId) {
  const digest = crypto
    .createHash('sha256')
    .update(`${provider}\u0000${providerAccountId}`)
    .digest('hex')
    .slice(0, 32);
  return `legacy_${digest}`;
}

function upsert(table, columns, values, conflictColumns, updateColumns) {
  const assignments = updateColumns
    .map((column) => `"${column}" = excluded."${column}"`)
    .join(', ');
  return `INSERT INTO "${table}" (${columns.map((column) => `"${column}"`).join(', ')}) VALUES (${values.map(sql).join(', ')}) ON CONFLICT (${conflictColumns.map((column) => `"${column}"`).join(', ')}) DO UPDATE SET ${assignments};`;
}

function usage() {
  console.error(
    'Usage: node scripts/migration/build-d1-import.mjs --input=/path/source.json --out=/path/import.sql'
  );
}

const args = parseArgs(process.argv.slice(2));
if (!args.input || !args.out) {
  usage();
  process.exit(2);
}

const inputFile = path.resolve(args.input);
const outputFile = path.resolve(args.out);
const document = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

if (document.format !== 'chartmini-postgres-export' || document.version !== 1) {
  throw new Error('Unsupported source export format');
}

const users = Array.isArray(document.users) ? document.users : [];
const sourceAccounts = Array.isArray(document.accounts)
  ? document.accounts
  : [];
const chartSettings = Array.isArray(document.userChartSettings)
  ? document.userChartSettings
  : [];
const aiUsage = Array.isArray(document.aiAnalysisDailyUsage)
  ? document.aiAnalysisDailyUsage
  : [];
const userIds = new Set(
  users.map((user) => requiredString(user.id, 'user.id'))
);
const normalizedEmailCounts = new Map();
for (const user of users) {
  const email = requiredString(user.email, `user.email:${user.id}`).trim();
  const normalizedEmail = email.toLowerCase();
  normalizedEmailCounts.set(
    normalizedEmail,
    (normalizedEmailCounts.get(normalizedEmail) ?? 0) + 1
  );
}
const duplicateNormalizedEmailGroups = [
  ...normalizedEmailCounts.values(),
].filter((count) => count > 1).length;
if (duplicateNormalizedEmailGroups > 0) {
  console.warn(
    `Case-insensitive email collisions preserved for ${duplicateNormalizedEmailGroups} groups; normalized_email will be NULL for those users.`
  );
}
const statements = [
  '-- ChartMini legacy PostgreSQL -> TanStarter D1 import',
  `-- Generated at ${new Date().toISOString()}`,
  '-- Sessions, verification tokens, and OAuth token values are intentionally not imported.',
  'PRAGMA foreign_keys = ON;',
];

for (const user of users) {
  const id = requiredString(user.id, 'user.id');
  const email = requiredString(user.email, `user.email:${id}`).trim();
  const normalizedEmail = email.toLowerCase();
  const storedNormalizedEmail =
    normalizedEmailCounts.get(normalizedEmail) === 1 ? normalizedEmail : null;
  const name =
    typeof user.name === 'string' && user.name.trim()
      ? user.name
      : email.split('@')[0] || 'ChartMini trader';
  const password = user.passwordHash ?? null;
  const createdAt = epochMs(user.createdAt, `user.createdAt:${id}`);
  const updatedAt = epochMs(user.updatedAt, `user.updatedAt:${id}`);
  statements.push(
    upsert(
      'user',
      [
        'id',
        'name',
        'email',
        'email_verified',
        'image',
        'created_at',
        'updated_at',
        'normalized_email',
        'is_premium',
      ],
      [
        id,
        name,
        email,
        // The legacy production auth flow allowed existing accounts to sign
        // in without Better Auth's email-verification gate. Treat those
        // already-existing accounts as verified during migration so Google
        // and email users do not enter an auth redirect loop. New accounts
        // created in v2 still follow requireEmailVerification.
        true,
        user.image ?? null,
        createdAt,
        updatedAt,
        storedNormalizedEmail,
        Boolean(user.isPremium),
      ],
      ['id'],
      [
        'name',
        'email',
        'email_verified',
        'image',
        'updated_at',
        'normalized_email',
        'is_premium',
      ]
    )
  );

  if (password !== null && password !== undefined) {
    statements.push(
      upsert(
        'account',
        [
          'id',
          'account_id',
          'provider_id',
          'user_id',
          'password',
          'created_at',
          'updated_at',
        ],
        [
          accountId('credential', id),
          id,
          'credential',
          id,
          password,
          createdAt,
          updatedAt,
        ],
        ['id'],
        ['account_id', 'provider_id', 'user_id', 'password', 'updated_at']
      )
    );
  }
}

for (const sourceAccount of sourceAccounts) {
  const userId = requiredString(sourceAccount.userId, 'account.userId');
  if (!userIds.has(userId))
    throw new Error(`Account references missing user: ${userId}`);
  const provider = requiredString(
    sourceAccount.provider,
    `account.provider:${userId}`
  );
  const providerAccountId = requiredString(
    sourceAccount.providerAccountId,
    `account.providerAccountId:${userId}`
  );
  if (provider === 'credential' || provider === 'credentials') continue;
  const createdAt = epochMs(
    sourceAccount.createdAt,
    `account.createdAt:${provider}:${providerAccountId}`
  );
  const updatedAt = epochMs(
    sourceAccount.updatedAt,
    `account.updatedAt:${provider}:${providerAccountId}`
  );
  statements.push(
    upsert(
      'account',
      [
        'id',
        'account_id',
        'provider_id',
        'user_id',
        'scope',
        'created_at',
        'updated_at',
      ],
      [
        accountId(provider, providerAccountId),
        providerAccountId,
        provider,
        userId,
        sourceAccount.scope ?? null,
        createdAt,
        updatedAt,
      ],
      ['id'],
      ['account_id', 'provider_id', 'user_id', 'scope', 'updated_at']
    )
  );
}

for (const row of chartSettings) {
  const id = requiredString(row.id, 'userChartSettings.id');
  const userId = requiredString(row.userId, `userChartSettings.userId:${id}`);
  if (!userIds.has(userId))
    throw new Error(`UserChartSettings references missing user: ${userId}`);
  const studies = requiredString(
    row.studies,
    `userChartSettings.studies:${id}`
  );
  const template = extractIndicatorTemplate(studies, id);
  const templateJson = serializeIndicatorTemplate(template);
  statements.push(
    upsert(
      'user_indicator_profiles',
      [
        'user_id',
        'scope',
        'template_json',
        'template_hash',
        'version',
        'updated_at',
      ],
      [
        userId,
        'shared',
        templateJson,
        hashIndicatorTemplate(templateJson),
        template.version,
        epochMs(row.updatedAt, `userChartSettings.updatedAt:${id}`),
      ],
      ['user_id', 'scope'],
      ['template_json', 'template_hash', 'version', 'updated_at']
    )
  );
}

for (const row of aiUsage) {
  const id = requiredString(row.id, 'aiAnalysisDailyUsage.id');
  const userId = requiredString(
    row.userId,
    `aiAnalysisDailyUsage.userId:${id}`
  );
  if (!userIds.has(userId))
    throw new Error(`AiAnalysisDailyUsage references missing user: ${userId}`);
  statements.push(
    upsert(
      'ai_analysis_daily_usage',
      ['id', 'user_id', 'day', 'count', 'created_at', 'updated_at'],
      [
        id,
        userId,
        epochMs(row.day, `aiAnalysisDailyUsage.day:${id}`),
        Number(row.count),
        epochMs(row.createdAt, `aiAnalysisDailyUsage.createdAt:${id}`),
        epochMs(row.updatedAt, `aiAnalysisDailyUsage.updatedAt:${id}`),
      ],
      ['id'],
      ['user_id', 'day', 'count', 'updated_at']
    )
  );
}

const output = `${statements.join('\n')}\n`;
fs.mkdirSync(path.dirname(outputFile), { recursive: true, mode: 0o700 });
fs.writeFileSync(outputFile, output, { mode: 0o600 });
fs.chmodSync(outputFile, 0o600);

console.log(`D1 import SQL written: ${outputFile}`);
console.log(`Users: ${users.length}`);
console.log(
  `Credential accounts: ${users.filter((user) => user.passwordHash).length}`
);
console.log(
  `OAuth accounts: ${sourceAccounts.filter((account) => !['credential', 'credentials'].includes(account.provider)).length}`
);
console.log(`TradingView profiles: ${chartSettings.length}`);
console.log(
  `TradingView profiles with indicators: ${
    chartSettings.filter((row) => {
      const template = extractIndicatorTemplate(
        requiredString(row.studies, `userChartSettings.studies:${row.id}`),
        row.id
      );
      return template.panes.length > 0;
    }).length
  }`
);
console.log(`AI daily usage rows: ${aiUsage.length}`);
