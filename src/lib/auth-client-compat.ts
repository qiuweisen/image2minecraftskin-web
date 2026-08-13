import { authClient } from '@/auth/client';

export type SimulatorSession = {
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
};

export async function getSimulatorSession(): Promise<SimulatorSession | null> {
  const result = await authClient.getSession();
  if (!result.data?.user) return null;
  return { user: result.data.user };
}

export async function signInWithEmail(email: string, password: string) {
  return authClient.signIn.email({
    email,
    password,
    callbackURL: typeof window !== 'undefined' ? window.location.href : '/',
  });
}

export async function signUpWithEmail(email: string, password: string) {
  return authClient.signUp.email({
    email,
    password,
    name: email.split('@')[0] || 'ChartMini trader',
    callbackURL: typeof window !== 'undefined' ? window.location.href : '/',
  });
}

export async function signInWithGoogle() {
  return authClient.signIn.social({
    provider: 'google',
    callbackURL: typeof window !== 'undefined' ? window.location.href : '/',
  });
}
