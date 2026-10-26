const SKIN_TOOL = 'skin.kie';
const RETRYABLE = new Set(['succeeded', 'failed']);

export type FreeRetryParentView = {
  id: string;
  userId: string;
  toolId: string;
  status: string;
  cost: number;
  inputJson: string;
  inputR2Key: string | null;
  preset: string | null;
};

export function parseTaskInputJson(
  inputJson: string
): Record<string, unknown> | null {
  try {
    const value = JSON.parse(inputJson) as unknown;
    if (!value || typeof value !== 'object' || Array.isArray(value))
      return null;
    return value as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Canonical input_json fragment used to detect an existing free-retry child. */
export function retryOfNeedle(parentId: string): string {
  return `"retry_of":${JSON.stringify(parentId)}`;
}

/**
 * Gate for layout-invalid / failed → one free regenerate.
 * Parent must be a paid skin.kie task in succeeded|failed; no chaining off a free retry.
 */
export function assertSkinFreeRetryAllowed(opts: {
  parent: FreeRetryParentView | null;
  requesterUserId: string;
  existingRetryId: string | null;
}): { inputR2Key: string; preset: string } {
  if (!opts.parent) throw new Error('RETRY_PARENT_NOT_FOUND');
  if (opts.parent.userId !== opts.requesterUserId)
    throw new Error('RETRY_NOT_OWNED');
  if (opts.parent.toolId !== SKIN_TOOL) throw new Error('RETRY_INVALID_TOOL');
  if (!RETRYABLE.has(opts.parent.status))
    throw new Error('RETRY_PARENT_NOT_RETRYABLE');
  if (opts.parent.cost <= 0) throw new Error('RETRY_PARENT_NOT_PAID');
  const params = parseTaskInputJson(opts.parent.inputJson);
  if (params && typeof params.retry_of === 'string' && params.retry_of)
    throw new Error('RETRY_OF_RETRY_NOT_ALLOWED');
  if (opts.existingRetryId) throw new Error('FREE_RETRY_ALREADY_USED');
  if (!opts.parent.inputR2Key) throw new Error('RETRY_PARENT_MISSING_INPUT');
  return {
    inputR2Key: opts.parent.inputR2Key,
    preset: opts.parent.preset ?? 'classic-person',
  };
}

export function isSkinFreeRetryCandidate(
  task: FreeRetryParentView,
  requesterUserId: string,
  existingRetryId: string | null
): boolean {
  try {
    assertSkinFreeRetryAllowed({
      parent: task,
      requesterUserId,
      existingRetryId,
    });
    return true;
  } catch {
    return false;
  }
}
