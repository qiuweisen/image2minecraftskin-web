import type { auth } from './auth';

/**
 * Better Auth infers the types
 * https://www.better-auth.com/docs/concepts/typescript#inferring-types
 */
export type Session = typeof auth.$Infer.Session;
export type SessionUser = typeof auth.$Infer.Session.user;

/**
 * Fields used by the public user menu. Keep this narrower than SessionUser so
 * lightweight session clients do not need to load every auth plugin merely to
 * render an avatar and sign-out menu.
 */
export type SessionUserIdentity = Pick<SessionUser, 'name' | 'email' | 'image'>;
