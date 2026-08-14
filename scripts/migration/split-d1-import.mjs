#!/usr/bin/env node

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

function usage() {
  console.error(
    'Usage: node scripts/migration/split-d1-import.mjs --input=/path/import.sql --out-dir=/path/chunks [--max-statements=700]'
  );
}

const args = parseArgs(process.argv.slice(2));
if (!args.input || !args['out-dir']) {
  usage();
  process.exit(2);
}

const maxStatements = Number(args['max-statements'] ?? 700);
if (!Number.isInteger(maxStatements) || maxStatements < 1) {
  throw new Error('--max-statements must be a positive integer');
}

const inputFile = path.resolve(args.input);
const outputDirectory = path.resolve(args['out-dir']);
const lines = fs.readFileSync(inputFile, 'utf8').split(/\r?\n/);
const statements = lines.filter((line) =>
  line.trim().startsWith('INSERT INTO ')
);

if (statements.length === 0) {
  throw new Error(`No INSERT statements found in ${inputFile}`);
}

fs.mkdirSync(outputDirectory, { recursive: true, mode: 0o700 });
for (const entry of fs.readdirSync(outputDirectory, { withFileTypes: true })) {
  if (entry.isFile() && /^chunk-\d+\.sql$/.test(entry.name)) {
    throw new Error(
      `Refusing to overwrite existing chunk: ${path.join(outputDirectory, entry.name)}`
    );
  }
}

const totalChunks = Math.ceil(statements.length / maxStatements);
for (let index = 0; index < totalChunks; index += 1) {
  const start = index * maxStatements;
  const chunk = statements.slice(start, start + maxStatements);
  const filename = `chunk-${String(index + 1).padStart(3, '0')}.sql`;
  const outputFile = path.join(outputDirectory, filename);
  const header = [
    '-- ChartMini production user-data import chunk',
    `-- Chunk ${index + 1}/${totalChunks}; ${chunk.length} statements`,
    'PRAGMA foreign_keys = ON;',
  ];
  fs.writeFileSync(outputFile, `${header.concat(chunk).join('\n')}\n`, {
    mode: 0o600,
  });
  fs.chmodSync(outputFile, 0o600);
}

fs.chmodSync(outputDirectory, 0o700);
console.log(
  `Split ${statements.length} statements into ${totalChunks} chunks of at most ${maxStatements}: ${outputDirectory}`
);
