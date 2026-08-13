import bcrypt from 'bcryptjs';

const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_SALT_BYTES = 16;
const PBKDF2_HASH_BYTES = 32;
const PBKDF2_PREFIX = '$pbkdf2-sha256$';
const BCRYPT_PREFIX_RE = /^\$2[aby]\$/;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function deriveBits(
  password: string,
  salt: Uint8Array,
  iterations: number,
  lengthBytes: number
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: salt as BufferSource,
      iterations,
    },
    key,
    lengthBytes * 8
  );
  return new Uint8Array(derived);
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

/**
 * Keep the source project's PBKDF2 format for new v2 passwords while the
 * migration is in progress. This lets old bcrypt and PBKDF2 users sign in;
 * a later cleanup can rehash them to the final project-wide format.
 */
export async function hashLegacyPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(PBKDF2_SALT_BYTES));
  const hash = await deriveBits(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_HASH_BYTES
  );
  return `${PBKDF2_PREFIX}${PBKDF2_ITERATIONS}$${bytesToBase64(salt)}$${bytesToBase64(hash)}`;
}

export async function verifyLegacyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  if (BCRYPT_PREFIX_RE.test(stored)) {
    return bcrypt.compare(password, stored);
  }

  if (!stored.startsWith(PBKDF2_PREFIX)) return false;
  const parts = stored.split('$');
  if (parts.length !== 5) return false;

  const iterations = Number(parts[2]);
  if (
    !Number.isInteger(iterations) ||
    iterations < 1_000 ||
    iterations > 1_000_000
  ) {
    return false;
  }

  try {
    const salt = base64ToBytes(parts[3]);
    const expected = base64ToBytes(parts[4]);
    const actual = await deriveBits(
      password,
      salt,
      iterations,
      expected.length
    );
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
