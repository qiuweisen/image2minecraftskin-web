#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const { Client } = pg;

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

function readEnvFile(filePath) {
  const values = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

function dateToIso(value, label) {
  if (value === null || value === undefined) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date in ${label}`);
  }
  return date.toISOString();
}

function jsonText(value, label) {
  if (typeof value === 'string') {
    try {
      JSON.parse(value);
      return value;
    } catch {
      throw new Error(`Invalid JSON in ${label}`);
    }
  }
  const text = JSON.stringify(value);
  if (!text) throw new Error(`Missing JSON in ${label}`);
  return text;
}

function countBy(items, key) {
  const counts = new Map();
  for (const item of items) {
    const value = item[key] ?? '(null)';
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Object.fromEntries(
    [...counts.entries()].sort(([a], [b]) => a.localeCompare(b))
  );
}

function ensureUnique(values, label) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  if (duplicates.size > 0) {
    throw new Error(`${label} contains duplicates (${duplicates.size})`);
  }
}

function usage() {
  console.error(
    'Usage: node scripts/migration/export-source-postgres.mjs --source-env=/path/to/.env --out=/path/to/source.json'
  );
}

function sslForConnection(connectionString) {
  try {
    const hostname = new URL(connectionString).hostname;
    if (
      hostname.endsWith('.supabase.co') ||
      hostname.endsWith('.supabase.com')
    ) {
      return { rejectUnauthorized: false };
    }
  } catch {
    // Let node-postgres report the original connection-string error below.
  }
  return undefined;
}

function createSourceClient(
  connectionString,
  applicationName,
  timeoutMillis = 120000
) {
  const sourceClient = new Client({
    connectionString,
    ssl: sslForConnection(connectionString),
    options: '-c default_transaction_read_only=on',
    connectionTimeoutMillis: 10000,
    statement_timeout: timeoutMillis,
    query_timeout: timeoutMillis,
    keepAlive: true,
    application_name: applicationName,
  });
  // The query promise still reports errors; this prevents a remote pooler
  // disconnect from becoming an unhandled process-level event.
  sourceClient.on('error', () => {});
  return sourceClient;
}

async function fetchChartSettingsByBatches(connectionString, ids) {
  const batchSize = 50;
  const batches = [];
  for (let index = 0; index < ids.length; index += batchSize) {
    batches.push(ids.slice(index, index + batchSize));
  }

  const rows = [];
  let nextBatch = 0;
  let completedBatches = 0;
  const workerCount = Math.min(8, batches.length);

  async function worker(workerIndex) {
    let workerClient;
    try {
      while (true) {
        const batchIndex = nextBatch;
        nextBatch += 1;
        if (batchIndex >= batches.length) break;

        let lastError;
        for (let attempt = 1; attempt <= 3; attempt += 1) {
          try {
            if (!workerClient) {
              workerClient = createSourceClient(
                connectionString,
                `chartmini-v2-source-export-settings-${workerIndex}`
              );
              await workerClient.connect();
            }
            const result = await workerClient.query(
              'SELECT id, "userId", studies, "updatedAt" FROM "UserChartSettings" WHERE id = ANY($1::text[])',
              [batches[batchIndex]]
            );
            rows.push(...result.rows);
            lastError = undefined;
            break;
          } catch (error) {
            lastError = error;
            await workerClient?.end().catch(() => {});
            workerClient = undefined;
            if (attempt < 3) {
              await new Promise((resolve) =>
                setTimeout(resolve, 250 * 2 ** (attempt - 1))
              );
            }
          }
        }

        if (lastError) throw lastError;
        completedBatches += 1;
        if (
          completedBatches === batches.length ||
          completedBatches % 10 === 0
        ) {
          console.error(
            `Chart settings batches fetched: ${completedBatches}/${batches.length}`
          );
        }
      }
    } finally {
      await workerClient?.end().catch(() => {});
    }
  }

  await Promise.all(
    Array.from({ length: workerCount }, (_, index) => worker(index + 1))
  );
  rows.sort((left, right) => String(left.id).localeCompare(String(right.id)));
  return { rows };
}

const args = parseArgs(process.argv.slice(2));
const sourceEnvFile = args['source-env'] ?? process.env.SOURCE_ENV_FILE;
const outputFile = args.out;

if (!sourceEnvFile || !outputFile) {
  usage();
  process.exit(2);
}

if (!fs.existsSync(sourceEnvFile)) {
  console.error(`Source env file not found: ${sourceEnvFile}`);
  process.exit(2);
}

const sourceEnv = readEnvFile(sourceEnvFile);
const connectionCandidates = [
  ['DATABASE_URL', sourceEnv.DATABASE_URL],
  ['DIRECT_URL', sourceEnv.DIRECT_URL],
].filter(([, value]) => Boolean(value));

if (connectionCandidates.length === 0) {
  console.error('Source env file has neither DATABASE_URL nor DIRECT_URL.');
  process.exit(2);
}

let client;
let connectedWith;
let connectedConnectionString;
let lastError;
for (const [key, connectionString] of connectionCandidates) {
  const candidate = createSourceClient(
    connectionString,
    'chartmini-v2-source-export-readonly',
    300000
  );
  try {
    await candidate.connect();
    client = candidate;
    connectedWith = key;
    connectedConnectionString = connectionString;
    break;
  } catch (error) {
    lastError = error;
    await candidate.end().catch(() => {});
  }
}

if (!client) {
  console.error(
    'Unable to connect to the source PostgreSQL database with the configured URLs.'
  );
  if (lastError)
    console.error(
      `Last error: ${String(lastError.message ?? lastError).split('\n')[0]}`
    );
  process.exit(1);
}

const expectedTables = [
  'User',
  'Account',
  'Session',
  'VerificationToken',
  'UserChartSettings',
  'AiAnalysisDailyUsage',
];

try {
  const tableResult = await client.query(
    `SELECT table_name
       FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY($1::text[])
      ORDER BY table_name`,
    [expectedTables]
  );
  const availableTables = new Set(
    tableResult.rows.map((row) => row.table_name)
  );
  const missingTables = expectedTables.filter(
    (table) => !availableTables.has(table)
  );
  if (missingTables.length > 0) {
    console.warn(`Missing source tables: ${missingTables.join(', ')}`);
  }

  if (!availableTables.has('User') || !availableTables.has('Account')) {
    throw new Error('Source database must contain User and Account tables.');
  }

  const usersResult = await client.query(`
    SELECT id, name, email, "emailVerified", image, "isPremium", password, "createdAt", "updatedAt"
      FROM "User"
     ORDER BY id
  `);
  const accountsResult = await client.query(`
    SELECT "userId", type, provider, "providerAccountId", scope, "createdAt", "updatedAt"
      FROM "Account"
     ORDER BY provider, "providerAccountId"
  `);
  const sessionsResult = availableTables.has('Session')
    ? await client.query('SELECT COUNT(*)::text AS count FROM "Session"')
    : { rows: [{ count: '0' }] };
  const verificationResult = availableTables.has('VerificationToken')
    ? await client.query(
        'SELECT COUNT(*)::text AS count FROM "VerificationToken"'
      )
    : { rows: [{ count: '0' }] };
  const sessionCount = Number(sessionsResult.rows[0]?.count ?? 0);
  const verificationTokenCount = Number(verificationResult.rows[0]?.count ?? 0);
  let chartSettingsResult = { rows: [] };
  if (availableTables.has('UserChartSettings')) {
    const chartSettingIdsResult = await client.query(
      'SELECT id FROM "UserChartSettings" ORDER BY id'
    );
    chartSettingsResult = await fetchChartSettingsByBatches(
      connectedConnectionString,
      chartSettingIdsResult.rows.map((row) => row.id)
    );
  }
  const aiUsageResult = availableTables.has('AiAnalysisDailyUsage')
    ? await client.query(
        'SELECT id, "userId", day, count, "createdAt", "updatedAt" FROM "AiAnalysisDailyUsage" ORDER BY id'
      )
    : { rows: [] };

  const users = usersResult.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    emailVerified: dateToIso(row.emailVerified, `User.emailVerified:${row.id}`),
    image: row.image,
    isPremium: Boolean(row.isPremium),
    passwordHash: row.password,
    createdAt: dateToIso(row.createdAt, `User.createdAt:${row.id}`),
    updatedAt: dateToIso(row.updatedAt, `User.updatedAt:${row.id}`),
  }));

  ensureUnique(
    users.map((user) => user.id),
    'User.id'
  );
  ensureUnique(
    users.map((user) => user.email),
    'User.email'
  );
  const normalizedEmailCounts = new Map();
  for (const user of users) {
    const normalizedEmail = user.email.trim().toLowerCase();
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
      `Case-insensitive email collisions preserved for ${duplicateNormalizedEmailGroups} groups; import will leave normalized_email NULL for those users.`
    );
  }

  const userIds = new Set(users.map((user) => user.id));
  const accounts = accountsResult.rows.map((row) => ({
    userId: row.userId,
    type: row.type,
    provider: row.provider,
    providerAccountId: row.providerAccountId,
    scope: row.scope,
    createdAt: dateToIso(
      row.createdAt,
      `Account.createdAt:${row.provider}:${row.providerAccountId}`
    ),
    updatedAt: dateToIso(
      row.updatedAt,
      `Account.updatedAt:${row.provider}:${row.providerAccountId}`
    ),
  }));

  for (const account of accounts) {
    if (!userIds.has(account.userId)) {
      throw new Error(`Account references missing User: ${account.userId}`);
    }
  }
  ensureUnique(
    accounts.map(
      (account) => `${account.provider}\u0000${account.providerAccountId}`
    ),
    'Account.provider/providerAccountId'
  );

  const chartSettings = chartSettingsResult.rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    studies: jsonText(row.studies, `UserChartSettings.studies:${row.id}`),
    updatedAt: dateToIso(
      row.updatedAt,
      `UserChartSettings.updatedAt:${row.id}`
    ),
  }));
  for (const row of chartSettings) {
    if (!userIds.has(row.userId))
      throw new Error(
        `UserChartSettings references missing User: ${row.userId}`
      );
  }
  ensureUnique(
    chartSettings.map((row) => row.userId),
    'UserChartSettings.userId'
  );

  const aiAnalysisDailyUsage = aiUsageResult.rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    day: dateToIso(row.day, `AiAnalysisDailyUsage.day:${row.id}`),
    count: row.count,
    createdAt: dateToIso(
      row.createdAt,
      `AiAnalysisDailyUsage.createdAt:${row.id}`
    ),
    updatedAt: dateToIso(
      row.updatedAt,
      `AiAnalysisDailyUsage.updatedAt:${row.id}`
    ),
  }));
  for (const row of aiAnalysisDailyUsage) {
    if (!userIds.has(row.userId))
      throw new Error(
        `AiAnalysisDailyUsage references missing User: ${row.userId}`
      );
  }

  const exportDocument = {
    format: 'chartmini-postgres-export',
    version: 1,
    exportedAt: new Date().toISOString(),
    sourceConnection: connectedWith,
    oauthTokensIncluded: false,
    notes: [
      'Source sessions and verification tokens are included only for audit counts and are intentionally not exported.',
      'OAuth access, refresh, and ID tokens are intentionally omitted; Google accounts are re-linked by provider account ID.',
    ],
    counts: {
      users: users.length,
      accounts: accounts.length,
      sessions: sessionCount,
      verificationTokens: verificationTokenCount,
      userChartSettings: chartSettings.length,
      aiAnalysisDailyUsage: aiAnalysisDailyUsage.length,
    },
    accountProviders: countBy(accounts, 'provider'),
    users,
    accounts,
    userChartSettings: chartSettings,
    aiAnalysisDailyUsage,
  };

  const resolvedOutput = path.resolve(outputFile);
  fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true, mode: 0o700 });
  fs.writeFileSync(
    resolvedOutput,
    `${JSON.stringify(exportDocument, null, 2)}\n`,
    { mode: 0o600 }
  );
  fs.chmodSync(resolvedOutput, 0o600);

  console.log(`Export written: ${resolvedOutput}`);
  console.log(`Source connection: ${connectedWith}`);
  console.log(`Users: ${users.length}`);
  console.log(`Accounts: ${accounts.length}`);
  console.log(`TradingView settings: ${chartSettings.length}`);
  console.log(`AI daily usage rows: ${aiAnalysisDailyUsage.length}`);
  console.log(`Source sessions observed but not exported: ${sessionCount}`);
  console.log(
    `Source verification tokens observed but not exported: ${verificationTokenCount}`
  );
  console.log('OAuth token fields exported: no');
} catch (error) {
  console.error(
    `Source export failed: ${error instanceof Error ? error.message : String(error)}`
  );
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
