import { createAuthClient } from 'better-auth/react';
import { getBaseUrl } from '@/lib/urls';

/**
 * Minimal client for public layouts that only need session state and sign-out.
 * Admin/API-key plugins stay in `auth/client.ts` and are loaded by protected
 * or authentication routes instead of every marketing-page visit.
 */
export const sessionClient = createAuthClient({
  baseURL: getBaseUrl(),
});
