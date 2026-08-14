#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const blogDirectory = path.join(root, 'content', 'blog');
const outputFile = path.join(root, 'src', 'generated', 'blog-manifest.json');
const contentPrefix = 'chartmini-content/blog';

function parseValue(raw) {
  const value = raw.trim();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value.startsWith('[') && value.endsWith(']')) {
    try {
      return JSON.parse(value);
    } catch {
      return value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    }
  }
  return value.replace(/^['"]|['"]$/g, '').trim();
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) return {};
  const end = markdown.indexOf('\n---', 3);
  if (end < 0) return {};

  const frontmatter = markdown.slice(3, end).trim();
  return Object.fromEntries(
    frontmatter
      .split(/\r?\n/)
      .map((line) => line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/))
      .filter(Boolean)
      .map((match) => [match[1], parseValue(match[2])])
  );
}

function toString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function toStringArray(value) {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

const files = fs
  .readdirSync(blogDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => entry.name)
  .sort();

const posts = files.map((file) => {
  const markdown = fs.readFileSync(path.join(blogDirectory, file), 'utf8');
  const frontmatter = parseFrontmatter(markdown);
  const fileSlug = file.replace(/\.md$/, '');
  const categories = toStringArray(frontmatter.categories);
  const category =
    toString(frontmatter.category) ?? categories?.[0] ?? 'Trading';

  return {
    slug: toString(frontmatter.slug) ?? fileSlug,
    fileSlug,
    contentKey: `${contentPrefix}/${file}`,
    locale: 'en',
    title: toString(frontmatter.title) ?? fileSlug,
    metaTitle: toString(frontmatter.metaTitle),
    description: toString(frontmatter.description) ?? '',
    date: toString(frontmatter.date) ?? '1970-01-01',
    dateModified: toString(frontmatter.dateModified),
    category,
    categories,
    tags: toStringArray(frontmatter.tags),
    image: toString(frontmatter.image),
    pinned: frontmatter.pinned === true ? true : undefined,
    indexable:
      typeof frontmatter.indexable === 'boolean'
        ? frontmatter.indexable
        : undefined,
    noindex: frontmatter.noindex === true ? true : undefined,
    redirectTo: toString(frontmatter.redirectTo),
  };
});

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(posts, null, 2)}\n`);
console.log(
  `[blog:manifest] wrote ${posts.length} posts → ${path.relative(root, outputFile)}`
);
