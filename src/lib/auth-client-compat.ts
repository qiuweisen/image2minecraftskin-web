import { authClient } from '@/auth/client';

const GOOGLE_POPUP_TIMEOUT_MS = 2 * 60 * 1000;
const GOOGLE_POPUP_FEATURES = [
  'popup=yes',
  'width=480',
  'height=640',
  'left=200',
  'top=80',
  'resizable=yes',
  'scrollbars=yes',
].join(',');

export type SimulatorSession = {
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
};

export async function getSimulatorSession(): Promise<SimulatorSession | null> {
  try {
    const result = await authClient.getSession();
    if (!result.data?.user) return null;
    return { user: result.data.user };
  } catch {
    // Treat an unavailable or malformed session endpoint as signed out. The
    // simulator must still be able to show the login prompt instead of
    // silently aborting the AI-analysis action.
    return null;
  }
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

async function waitForGooglePopup(popup: Window) {
  return new Promise<boolean>((resolve) => {
    const startedAt = Date.now();
    let checking = false;
    let settled = false;

    const finish = (authenticated: boolean) => {
      if (settled) return;
      settled = true;
      window.clearInterval(interval);
      try {
        popup.close();
      } catch {
        // The popup may already be closed by the browser or the user.
      }
      resolve(authenticated);
    };

    const check = async () => {
      if (settled || checking) return;
      checking = true;
      try {
        if (popup.closed) {
          finish(false);
          return;
        }

        const session = await getSimulatorSession();
        if (session?.user) {
          finish(true);
          return;
        }

        if (Date.now() - startedAt >= GOOGLE_POPUP_TIMEOUT_MS) {
          finish(false);
        }
      } finally {
        checking = false;
      }
    };

    const interval = window.setInterval(() => void check(), 500);
    void check();
  });
}

export async function signInWithGoogle() {
  const callbackURL =
    typeof window !== 'undefined' ? window.location.href : '/';

  // Open the blank window synchronously from the click handler so browsers do
  // not treat the OAuth popup as blocked while the Better Auth request is in
  // flight. The authorization URL is filled in once the server creates the
  // OAuth state and URL.
  const popup =
    typeof window !== 'undefined'
      ? window.open(
          'about:blank',
          'chartmini-google-sign-in',
          GOOGLE_POPUP_FEATURES
        )
      : null;

  if (!popup) {
    // Preserve a usable fallback for browsers/extensions that block popups.
    return authClient.signIn.social({
      provider: 'google',
      callbackURL,
    });
  }

  try {
    const result = await authClient.signIn.social({
      provider: 'google',
      callbackURL,
      disableRedirect: true,
    });

    if (result.error || !result.data?.url) {
      popup.close();
      return result;
    }

    popup.location.href = result.data.url;
    await waitForGooglePopup(popup);
    return result;
  } catch (error) {
    popup.close();
    throw error;
  }
}
