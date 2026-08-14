#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
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

const files = fs
  .readdirSync(path.join(root, 'content', 'blog'), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => entry.name)
  .sort();

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
    `[blog:r2] synced ${completed} Markdown + rendered files to ${bucket}/${prefix}`
  );
}
