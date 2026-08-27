import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('production build', () => {
  it('uses the Wrangler-aware build runner', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts.build).toBe('tsx scripts/build.ts');
  });
});
