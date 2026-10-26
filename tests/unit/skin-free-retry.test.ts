import { describe, expect, it } from 'vitest';
import {
  assertSkinFreeRetryAllowed,
  isSkinFreeRetryCandidate,
  parseTaskInputJson,
  retryOfNeedle,
  type FreeRetryParentView,
} from '@/credits/skin-free-retry';

function parent(
  overrides: Partial<FreeRetryParentView> = {}
): FreeRetryParentView {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    userId: 'user-a',
    toolId: 'skin.kie',
    status: 'succeeded',
    cost: 1,
    inputJson:
      '{"inputKey":"credit-inputs/user-a/x","preset":"classic-person"}',
    inputR2Key: 'credit-inputs/user-a/x',
    preset: 'classic-person',
    ...overrides,
  };
}

describe('skin free retry gate', () => {
  it('allows one free retry for a paid succeeded parent', () => {
    expect(
      assertSkinFreeRetryAllowed({
        parent: parent(),
        requesterUserId: 'user-a',
        existingRetryId: null,
      })
    ).toEqual({
      inputR2Key: 'credit-inputs/user-a/x',
      preset: 'classic-person',
    });
  });

  it('allows free retry for a paid failed parent', () => {
    expect(
      isSkinFreeRetryCandidate(parent({ status: 'failed' }), 'user-a', null)
    ).toBe(true);
  });

  it('rejects when parent missing or not owned', () => {
    expect(() =>
      assertSkinFreeRetryAllowed({
        parent: null,
        requesterUserId: 'user-a',
        existingRetryId: null,
      })
    ).toThrow('RETRY_PARENT_NOT_FOUND');
    expect(() =>
      assertSkinFreeRetryAllowed({
        parent: parent(),
        requesterUserId: 'user-b',
        existingRetryId: null,
      })
    ).toThrow('RETRY_NOT_OWNED');
  });

  it('rejects non-retryable status and unpaid / free-retry parents', () => {
    expect(() =>
      assertSkinFreeRetryAllowed({
        parent: parent({ status: 'running' }),
        requesterUserId: 'user-a',
        existingRetryId: null,
      })
    ).toThrow('RETRY_PARENT_NOT_RETRYABLE');
    expect(() =>
      assertSkinFreeRetryAllowed({
        parent: parent({ cost: 0 }),
        requesterUserId: 'user-a',
        existingRetryId: null,
      })
    ).toThrow('RETRY_PARENT_NOT_PAID');
    expect(() =>
      assertSkinFreeRetryAllowed({
        parent: parent({
          inputJson:
            '{"inputKey":"k","preset":"classic-person","retry_of":"22222222-2222-2222-2222-222222222222"}',
        }),
        requesterUserId: 'user-a',
        existingRetryId: null,
      })
    ).toThrow('RETRY_OF_RETRY_NOT_ALLOWED');
  });

  it('rejects when a free retry child already exists', () => {
    expect(() =>
      assertSkinFreeRetryAllowed({
        parent: parent(),
        requesterUserId: 'user-a',
        existingRetryId: 'child-1',
      })
    ).toThrow('FREE_RETRY_ALREADY_USED');
    expect(isSkinFreeRetryCandidate(parent(), 'user-a', 'child-1')).toBe(false);
  });

  it('builds canonical retry_of needle and parses input json', () => {
    expect(retryOfNeedle('abc')).toBe('"retry_of":"abc"');
    expect(parseTaskInputJson('{"retry_of":"x"}')).toEqual({ retry_of: 'x' });
    expect(parseTaskInputJson('not-json')).toBeNull();
  });
});
