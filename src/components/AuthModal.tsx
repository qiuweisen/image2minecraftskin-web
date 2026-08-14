'use client';

import { useEffect, useState } from 'react';
import { IconBrandGoogleFilled, IconLoader2 } from '@tabler/icons-react';
import {
  getSimulatorSession,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  type SimulatorSession,
} from '@/lib/auth-client-compat';
import { Routes } from '@/lib/routes';
import { getPathWithLocale } from '@/lib/urls';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AuthMode = 'login' | 'register';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated?: (session: SimulatorSession | null) => void;
}

export default function AuthModal({
  open,
  onClose,
  onAuthenticated,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setMode('login');
      setEmail('');
      setPassword('');
      setError(null);
      setSuccessMessage(null);
    }
  }, [open]);

  const selectMode = (nextMode: string) => {
    setMode(nextMode as AuthMode);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await signInWithEmail(email, password);
        if (result.error) {
          throw new Error(result.error.message || 'Invalid email or password');
        }
        onAuthenticated?.(await getSimulatorSession());
        onClose();
      } else {
        const result = await signUpWithEmail(email, password);
        if (result.error) {
          throw new Error(result.error.message || 'Registration failed');
        }
        setSuccessMessage(
          'Account created. Please check your email to verify your account.'
        );
        setMode('login');
        setPassword('');
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Request failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result.error) {
        throw new Error(result.error.message || 'Google sign-in failed');
      }

      const session = await getSimulatorSession();
      if (!session) {
        throw new Error('Google sign-in was cancelled or did not complete.');
      }

      onAuthenticated?.(session);
      onClose();
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : 'Google sign-in failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="w-[min(92vw,400px)] max-w-md overflow-hidden p-0">
        <DialogHeader className="border-b bg-muted/30 px-6 py-5 pr-14">
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            Sign in or create an account to unlock AI analysis.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={selectMode} className="gap-0">
          <TabsList
            variant="line"
            className="grid w-full grid-cols-2 gap-0 rounded-none border-b bg-transparent p-0"
          >
            <TabsTrigger value="login" className="h-full rounded-none py-0">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register" className="h-full rounded-none py-0">
              Register
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="chartmini-auth-email">Email</Label>
            <Input
              id="chartmini-auth-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="chartmini-auth-password">Password</Label>
              {mode === 'login' && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto px-0 text-xs"
                  onClick={() =>
                    window.location.assign(
                      getPathWithLocale(Routes.ForgotPassword)
                    )
                  }
                >
                  Forgot password?
                </Button>
              )}
            </div>
            <Input
              id="chartmini-auth-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading && <IconLoader2 className="animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="flex items-center gap-3 px-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="px-6 pb-6 pt-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => void handleGoogleSignIn()}
            disabled={loading}
          >
            {loading && <IconLoader2 className="animate-spin" />}
            <IconBrandGoogleFilled />
            Continue with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
