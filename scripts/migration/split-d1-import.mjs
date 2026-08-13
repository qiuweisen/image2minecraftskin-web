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
    'Usage: node scripts/migration/split-d1-import.mjs --input=/path/import.sql --out-dir=/path/chunks --max-bytes=8000000'
  );
}

const args = parseArgs(process.argv.slice(2));
const inputFile = args.input;
const outputDirectory = args['out-dir'];
const maxBytes = Number(args['max-bytes'] ?? 8000000);

if (!inputFile || !outputDirectory || !Number.isInteger(maxBytes) || maxBytes < 100000) {
  usage();
  process.exit(2);
}

const source = fs.readFileSync(path.resolve(inputFile), 'utf8');
const lines = source.split(/\r?\n/).filter((line) => line.trim().length > 0);
const firstInsertIndex = lines.findIndex((line) =>
  line.startsWith('INSERT INTO')
);
if (firstInsertIndex < 0) throw new Error('Import file contains no INSERT statements');

const header = lines.slice(0, firstInsertIndex).join('\n') + '\n';
const statements = lines.slice(firstInsertIndex);
const resolvedOutputDirectory = path.resolve(outputDirectory);
fs.mkdirSync(resolvedOutputDirectory, { recursive: true, mode: 0o700 });
const existingEntries = fs.readdirSync(resolvedOutputDirectory);
if (existingEntries.length > 0) {
  throw new Error(`Output directory must be empty: ${resolvedOutputDirectory}`);
}

const chunks = [];
let current = header;
let currentBytes = Buffer.byteLength(current);

for (const statement of statements) {
  const serialized = `${statement}\n`;
  const statementBytes = Buffer.byteLength(serialized);
  if (statementBytes + Buffer.byteLength(header) > maxBytes) {
    throw new Error('A single SQL statement exceeds the requested chunk size');
  }
  if (current !== header && currentBytes + statementBytes > maxBytes) {
    chunks.push(current);
    current = header;
    currentBytes = Buffer.byteLength(header);
  }
  current += serialized;
  currentBytes += statementBytes;
}
if (current !== header) chunks.push(current);

for (let index = 0; index < chunks.length; index += 1) {
  const fileName = `part-${String(index + 1).padStart(3, '0')}.sql`;
  const filePath = path.join(resolvedOutputDirectory, fileName);
  fs.writeFileSync(filePath, chunks[index], { mode: 0o600 });
  fs.chmodSync(filePath, 0o600);
}

console.log(`Chunks written: ${chunks.length}`);
console.log(`Output directory: ${resolvedOutputDirectory}`);
console.log(`Maximum chunk bytes: ${maxBytes}`);
console.log(`Statements: ${statements.length}`);
