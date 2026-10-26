const MAX_INPUT_SIZE = 10 * 1024 * 1024;

export function ownsSkinInput(
  key: string,
  userId: string,
  hasObject: boolean,
  size: number,
  contentType: string,
  ownerId?: string
) {
  return (
    hasObject &&
    key.startsWith(`credit-inputs/${userId}/`) &&
    !key.includes('..') &&
    size > 0 &&
    size <= MAX_INPUT_SIZE &&
    ['image/jpeg', 'image/png', 'image/webp'].includes(contentType) &&
    ownerId === userId
  );
}
