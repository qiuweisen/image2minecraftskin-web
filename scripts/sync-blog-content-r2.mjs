#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

const root = process.cwd();
const bucket = 'chartmini-v2-files';
const prefix = 'chartmini-content/blog';
const renderedPrefix = 'chartmini-content/blog-rendered';
const concurrency = Math.max(1, Number(process.env.BLOG_R2_CONCURRENCY ?? 4));
const wrangler = path.join(root, 'node_modules', '.bin', 'wrangler');
const fullSyncRequested =
  process.env.BLOG_R2_FULL_SYNC === 'true' || process.argv.includes('--full');
const dryRunRequested =
  process.env.BLOG_R2_DRY_RUN === 'true' || process.argv.includes('--dry-run');

const allFiles = fs
  .readdirSync(path.join(root, 'content', 'blog'), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => entry.name)
  .sort();
const allFileSet = new Set(allFiles);

function stripFrontmatter(markdown) {
  if (!markdown.startsWith('---')) return markdown;
  const end = markdown.indexOf('\n---', 3);
  if (end < 0) return markdown;
  return markdown.slice(end + 4).replace(/^\s+/, '');
}

function extractBlogContent(markdown) {
  const rawContent = stripFrontmatter(markdown);
  const schemas = [];
  const scriptRegex =
    /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  let match = scriptRegex.exec(rawContent);
  while (match !== null) {
    const schema = match[1]?.trim();
    if (schema) schemas.push(schema);
    match = scriptRegex.exec(rawContent);
  }

  const content = rawContent
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gim, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  return { content, schemas };
}

async function renderBlogContent(markdown) {
  const { content, schemas } = extractBlogContent(markdown);
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: ['anchor'] },
    })
    .use(rehypeStringify)
    .process(content);

  return JSON.stringify({ contentHtml: String(result), schemas });
}

function isZeroSha(value) {
  return /^0+$/.test(value);
}

function blogFileFromGitPath(value) {
  const normalized = value?.replaceAll('\\', '/');
  const blogPrefix = 'content/blog/';
  if (!normalized?.startsWith(blogPrefix)) return null;

  const file = normalized.slice(blogPrefix.length);
  if (!file || file.includes('/') || !file.endsWith('.md')) return null;
  return file;
}

function getFullSyncPlan() {
  return { uploadFiles: allFiles, deleteFiles: [] };
}

function getIncrementalSyncPlan() {
  const baseSha = process.env.BLOG_R2_BASE_SHA?.trim();
  const headSha = process.env.BLOG_R2_HEAD_SHA?.trim() || 'HEAD';

  if (!baseSha || !headSha || isZeroSha(baseSha)) {
    console.warn(
      '[blog:r2] Missing a usable Git range; falling back to a full sync'
    );
    return getFullSyncPlan();
  }

  let diff;
  try {
    diff = execFileSync(
      'git',
      ['diff', '--name-status', '-M', baseSha, headSha, '--', 'content/blog'],
      { cwd: root, encoding: 'utf8' }
    );
  } catch (error) {
    console.warn(
      `[blog:r2] Could not inspect ${baseSha}..${headSha}; falling back to a full sync`
    );
    console.warn(String(error));
    return getFullSyncPlan();
  }

  const uploadFiles = new Set();
  const deleteFiles = new Set();

  for (const line of diff.split('\n')) {
    if (!line.trim()) continue;

    const [rawStatus, oldPath, newPath] = line.split('\t');
    const status = rawStatus?.[0];

    if (status === 'D') {
      const file = blogFileFromGitPath(oldPath);
      if (file) deleteFiles.add(file);
      continue;
    }

    if (status === 'R') {
      const oldFile = blogFileFromGitPath(oldPath);
      const newFile = blogFileFromGitPath(newPath);
      if (oldFile) deleteFiles.add(oldFile);
      if (newFile && allFileSet.has(newFile)) uploadFiles.add(newFile);
      continue;
    }

    if (status === 'C') {
      const file = blogFileFromGitPath(newPath);
      if (file && allFileSet.has(file)) uploadFiles.add(file);
      continue;
    }

    const file = blogFileFromGitPath(oldPath);
    if (file && allFileSet.has(file)) uploadFiles.add(file);
  }

  // If a path appears in both sets because of an unusual Git change, the
  // current file wins and should be uploaded after the stale object is replaced.
  for (const file of uploadFiles) deleteFiles.delete(file);

  return {
    uploadFiles: [...uploadFiles].sort(),
    deleteFiles: [...deleteFiles].sort(),
  };
}

function getSyncPlan() {
  if (fullSyncRequested) return getFullSyncPlan();
  return getIncrementalSyncPlan();
}

function putObject(destination, { file, body, contentType }) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      wrangler,
      [
        'r2',
        'object',
        'put',
        destination,
        ...(file ? ['--file', file] : ['--pipe']),
        '--content-type',
        contentType,
        '--cache-control',
        'public, max-age=31536000, immutable',
        '--remote',
        '--force',
        '--config',
        'wrangler.jsonc',
      ],
      { cwd: root, stdio: [body ? 'pipe' : 'ignore', 'ignore', 'pipe'] }
    );

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    if (body) child.stdin.end(body);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${destination}: wrangler exited ${code}\n${stderr}`));
      }
    });
  });
}

function deleteObject(destination) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      wrangler,
      [
        'r2',
        'object',
        'delete',
        destination,
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
        reject(new Error(`${destination}: wrangler exited ${code}\n${stderr}`));
      }
    });
  });
}

async function putObjectWithRetry(destination, options) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await putObject(destination, options);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }
  throw lastError;
}

async function deleteObjectWithRetry(destination) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await deleteObject(destination);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }
  throw lastError;
}

async function upload(file) {
  const source = path.join(root, 'content', 'blog', file);
  const markdown = fs.readFileSync(source, 'utf8');
  await putObjectWithRetry(`${bucket}/${prefix}/${file}`, {
    file: source,
    contentType: 'text/markdown; charset=utf-8',
  });

  const rendered = await renderBlogContent(markdown);
  const renderedFile = file.replace(/\.md$/i, '.json');
  await putObjectWithRetry(`${bucket}/${renderedPrefix}/${renderedFile}`, {
    body: rendered,
    contentType: 'application/json; charset=utf-8',
  });
}

async function removeFromR2(file) {
  const renderedFile = file.replace(/\.md$/i, '.json');
  await deleteObjectWithRetry(`${bucket}/${prefix}/${file}`);
  await deleteObjectWithRetry(`${bucket}/${renderedPrefix}/${renderedFile}`);
}

const { uploadFiles, deleteFiles } = getSyncPlan();
const operations = [
  ...deleteFiles.map((file) => ({ type: 'delete', file })),
  ...uploadFiles.map((file) => ({ type: 'upload', file })),
];

console.log(
  `[blog:r2] ${fullSyncRequested ? 'full' : 'incremental'} sync: ${uploadFiles.length} uploads, ${deleteFiles.length} deletes, concurrency=${concurrency}`
);

if (dryRunRequested) {
  console.log(
    `[blog:r2] dry run files: ${operations.map(({ type, file }) => `${type}:${file}`).join(', ') || '(none)'}`
  );
  process.exit(0);
}

if (operations.length === 0) {
  console.log('[blog:r2] no changed blog files; skipping R2 sync');
  process.exit(0);
}

let nextIndex = 0;
let completed = 0;
const failures = [];

async function worker() {
  while (nextIndex < operations.length) {
    const index = nextIndex++;
    const operation = operations[index];
    try {
      if (operation.type === 'delete') {
        await removeFromR2(operation.file);
      } else {
        await upload(operation.file);
      }
      completed += 1;
      if (completed % 25 === 0 || completed === operations.length) {
        console.log(`[blog:r2] completed ${completed}/${operations.length}`);
      }
    } catch (error) {
      failures.push(`${operation.type}:${operation.file} ${String(error)}`);
    }
  }
}

await Promise.all(
  Array.from({ length: Math.min(concurrency, operations.length) }, () =>
    worker()
  )
);

if (failures.length > 0) {
  console.error(`[blog:r2] ${failures.length} uploads failed`);
  console.error(failures.slice(0, 10).join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `[blog:r2] completed ${completed} operations for ${bucket}/${prefix}`
  );
}
