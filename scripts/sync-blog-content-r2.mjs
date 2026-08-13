#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const bucket = 'chartmini-v2-files';
const prefix = 'chartmini-content/blog';
const concurrency = Math.max(1, Number(process.env.BLOG_R2_CONCURRENCY ?? 4));
const wrangler = path.join(root, 'node_modules', '.bin', 'wrangler');

const files = fs
  .readdirSync(path.join(root, 'content', 'blog'), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => entry.name)
  .sort();

function upload(file) {
  return new Promise((resolve, reject) => {
    const source = path.join(root, 'content', 'blog', file);
    const destination = `${bucket}/${prefix}/${file}`;
    const child = spawn(
      wrangler,
      [
        'r2',
        'object',
        'put',
        destination,
        '--file',
        source,
        '--content-type',
        'text/markdown; charset=utf-8',
        '--cache-control',
        'public, max-age=31536000, immutable',
        '--remote',
        '--force',
        '--config',
        'wrangler.jsonc',
      ],
      { cwd: root, stdio: ['ignore', 'ignore', 'pipe'] }
    );

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${file}: wrangler exited ${code}\n${stderr}`));
      }
    });
  });
}

let nextIndex = 0;
let completed = 0;
const failures = [];

async function worker() {
  while (nextIndex < files.length) {
    const index = nextIndex++;
    const file = files[index];
    try {
      await upload(file);
      completed += 1;
      if (completed % 25 === 0 || completed === files.length) {
        console.log(`[blog:r2] uploaded ${completed}/${files.length}`);
      }
    } catch (error) {
      failures.push(String(error));
    }
  }
}

await Promise.all(
  Array.from({ length: Math.min(concurrency, files.length) }, () => worker())
);

if (failures.length > 0) {
  console.error(`[blog:r2] ${failures.length} uploads failed`);
  console.error(failures.slice(0, 10).join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `[blog:r2] synced ${completed} Markdown files to ${bucket}/${prefix}`
  );
}
