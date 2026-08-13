'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import Portal from './Portal';
import {
  getSimulatorSession,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  type SimulatorSession,
} from '@/lib/auth-client-compat';
import { Routes } from '@/lib/routes';
import { getPathWithLocale } from '@/lib/urls';

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
      // Reset state on close
      setMode('login');
      setEmail('');
      setPassword('');
      setError(null);
      setSuccessMessage(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await signInWithEmail(email, password);
        if (result.error)
          throw new Error(result.error.message || 'Invalid email or password');
        onAuthenticated?.(await getSimulatorSession());
        onClose(); // Success
      } else if (mode === 'register') {
        const result = await signUpWithEmail(email, password);
        if (result.error)
          throw new Error(result.error.message || 'Registration failed');
        // Verification is required, so a new account may not have a session
        // yet. Keep the modal open and let Better Auth send the verification
        // link instead of presenting a fake OTP flow.
        setSuccessMessage(
          'Account created. Please check your email to verify your account.'
        );
        setMode('login');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
        <div
          role="dialog"
          aria-modal
          className="relative w-[min(90vw,400px)] rounded-2xl bg-white dark:bg-[#1e222d] text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-[#2a2e39] overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header Tabs */}
          <div className="flex border-b border-slate-200 dark:border-[#2a2e39]">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'login' ? 'bg-gradient-to-r from-[#0284c7] via-[#0891b2] to-[#14b8a6] dark:from-white dark:via-[#e2e8f0] dark:to-[#94a3b8] bg-clip-text text-transparent border-b-2 border-[#0891b2] dark:border-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'register' ? 'bg-gradient-to-r from-[#0284c7] via-[#0891b2] to-[#14b8a6] dark:from-white dark:via-[#e2e8f0] dark:to-[#94a3b8] bg-clip-text text-transparent border-b-2 border-[#0891b2] dark:border-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Register
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="chartmini-auth-email"
                  className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5"
                >
                  Email
                </label>
                <input
                  id="chartmini-auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="chartmini-auth-password"
                    className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide"
                  >
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        window.location.assign(
                          getPathWithLocale(Routes.ForgotPassword)
                        );
                      }}
                      className="text-xs text-[#0891b2] dark:text-slate-300 hover:text-[#0284c7] font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  id="chartmini-auth-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              {/* Errors & Success */}
              {error && (
                <div className="p-3 text-xs bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 rounded-lg font-medium">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="p-3 text-xs bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg font-medium">
                  {successMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#0284c7] via-[#0891b2] to-[#14b8a6] dark:from-white dark:via-[#e2e8f0] dark:to-[#94a3b8] hover:shadow-lg hover:shadow-cyan-500/30 dark:hover:shadow-white/20 text-white dark:text-slate-900 font-bold shadow-lg transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : mode === 'login' ? (
                  'Sign In'
                ) : mode === 'register' ? (
                  'Create Account'
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-[#2a2e39]" />
              <span className="text-xs text-slate-400 font-medium">OR</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-[#2a2e39]" />
            </div>

            <button
              type="button"
              onClick={() => {
                void signInWithGoogle();
              }}
              className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-[#2a2e39] hover:bg-slate-50 dark:hover:bg-[#131722] text-slate-700 dark:text-slate-300 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
