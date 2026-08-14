import { m } from '@/locale/paraglide/messages';

function parseMessageJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getAuthErrorMessages() {
  return Object.fromEntries(
    parseMessageJson<Array<[string, string]>>(m.auth_error_codes(), [])
  );
}

const authErrorMessageAliases: Record<string, string> = {
  'Invalid email or password': 'invalid_email_or_password',
  'Invalid email or password.': 'invalid_email_or_password',
};

type AuthErrorInput = {
  code?: string;
  message?: string;
};

export function getAuthErrorMessage(error: AuthErrorInput) {
  const messages = getAuthErrorMessages();
  const code = error.code;
  const message = error.message;
  const normalizedCode = code?.toLowerCase();
  const aliasedCode = message ? authErrorMessageAliases[message] : undefined;

  return (
    (code ? messages[code] : undefined) ??
    (normalizedCode ? messages[normalizedCode] : undefined) ??
    (aliasedCode ? messages[aliasedCode] : undefined) ??
    message ??
    m.auth_error_try_again()
  );
}
