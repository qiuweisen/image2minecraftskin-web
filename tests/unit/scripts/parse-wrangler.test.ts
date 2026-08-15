import { describe, expect, test } from 'vitest';

import {
  getD1Database,
  parseWranglerConfig,
} from '../../../scripts/parse-wrangler';

describe('Wrangler JSONC parsing', () => {
  test('preserves wildcard route strings while stripping comments', () => {
    const config = parseWranglerConfig();

    expect(getD1Database()?.name).toBe('chartmini-v2');
    expect(config).toMatchObject({
      routes: expect.arrayContaining([
        expect.objectContaining({ pattern: 'chartmini.com/*' }),
      ]),
    });
  });
});
