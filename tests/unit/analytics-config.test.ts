import { describe, expect, it } from 'vitest';
import { resolveClarityProjectId } from '@/config/analytics-config';

describe('resolveClarityProjectId', () => {
  it('uses the configured Clarity project ID when provided', () => {
    expect(resolveClarityProjectId('custom-project')).toBe('custom-project');
  });

  it('defaults to the production Clarity project ID', () => {
    expect(resolveClarityProjectId(undefined)).toBe('yoncymzurl');
  });
});
