#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const workflowDir = path.join(root, 'docs', 'seo', 'v2', '_workflow');
const requiredFiles = [
  path.join(root, 'docs', 'seo', 'README.md'),
  path.join(workflowDir, 'README.md'),
  path.join(workflowDir, 'current-state.md'),
  path.join(workflowDir, 'protected-pages.md'),
  path.join(workflowDir, 'candidate-backlog.csv'),
  path.join(workflowDir, 'intent-ownership-registry.csv'),
  path.join(workflowDir, 'gsc-submission-log.md'),
  path.join(workflowDir, 'observation-board.csv'),
  path.join(workflowDir, 'active-task-lock.md'),
  path.join(workflowDir, 'agent-activity-log.md'),
  path.join(workflowDir, 'today-queue.md'),
  path.join(workflowDir, 'multi-agent-start-prompt.md'),
  path.join(root, 'docs', 'seo', 'v2', 'flowtrace', 'README.md'),
];

const errors = [];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    errors.push(`missing required file: ${path.relative(root, file)}`);
  }
}

if (errors.length === 0) {
  const currentState = fs.readFileSync(
    path.join(workflowDir, 'current-state.md'),
    'utf8'
  );
  if (!currentState.includes('Baseline generation: v2')) {
    errors.push('current-state.md is not marked as a v2 baseline');
  }

  const activeLock = fs.readFileSync(
    path.join(workflowDir, 'active-task-lock.md'),
    'utf8'
  );
  if (!/^Status: (?:cleared|active)$/m.test(activeLock)) {
    errors.push(
      'active-task-lock.md must declare Status: cleared or Status: active'
    );
  }

  const candidateCsv = fs.readFileSync(
    path.join(workflowDir, 'candidate-backlog.csv'),
    'utf8'
  );
  const sourceMatches = [
    ...candidateCsv.matchAll(/content\/blog\/[^,"\n]+\.md/g),
  ];
  for (const match of sourceMatches) {
    const sourcePath = match[0];
    if (!fs.existsSync(path.join(root, sourcePath))) {
      errors.push(`candidate source does not exist: ${sourcePath}`);
    }
  }
}

const blogDir = path.join(root, 'content', 'blog');
const blogCount = fs.existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter((name) => name.endsWith('.md')).length
  : 0;

if (errors.length > 0) {
  console.error('[seo:v2:workflow:check] FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('[seo:v2:workflow:check] PASS');
console.log(`- required workflow files: ${requiredFiles.length}`);
console.log(`- current blog markdown files: ${blogCount}`);
console.log(
  '- legacy SEO files are not treated as active v2 workflow by this check'
);
