'use client';

import { LegacyImage as Image } from '@/components/legacy-image';
import { useEffect, useState } from 'react';
import { useUiStore } from '@/store/useUiStore';
import { usePlayI18n } from '@/components/PlayI18nProvider';

const NINJATRADER_LINK =
  'https://ninjatraderdomesticvendor.sjv.io/c/6570566/3069488/37581';
const NINJATRADER_COPY_LINK =
  'https://ninjatraderdomesticvendor.sjv.io/c/6570566/3069488/37581';
const EXIT_ANIMATION_MS = 320;

function shouldShow(): boolean {
  return true;
}

function NinjaTraderPromoInner({
  trigger,
  isProfit,
}: {
  trigger: number;
  isProfit?: boolean;
}) {
  const { t } = usePlayI18n();
  const theme = useUiStore((s) => (s as any).theme as 'light' | 'dark');
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const syncTheme = () => {
      setIsDark(
        theme === 'dark' || document.documentElement.classList.contains('dark')
      );
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [theme]);

  useEffect(() => {
    if (trigger > 0 && shouldShow()) {
      setMounted(true);
      setVisible(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
          setShowPulse(true);
          setTimeout(() => setShowPulse(false), 2000);
        });
      });
    }
  }, [trigger]);

  const dismiss = () => {
    setVisible(false);
    window.setTimeout(() => setMounted(false), EXIT_ANIMATION_MS);
  };

  const copyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(NINJATRADER_COPY_LINK);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = NINJATRADER_COPY_LINK;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (!mounted) return null;

  // Dynamic title based on session result
  const titleText =
    isProfit === true
      ? t('promoTitleWin')
      : isProfit === false
        ? t('promoTitleLose')
        : t('promoTitle');

  return (
    <div
      className={`fixed bottom-3 left-3 z-50 w-max max-w-[calc(100vw-1.5rem)] transition-all duration-300 ease-out md:bottom-4 md:left-4 md:max-w-[420px] ${
        visible
          ? 'translate-x-0 translate-y-0 opacity-100 scale-100'
          : '-translate-x-4 translate-y-6 opacity-0 scale-95'
      }`}
      role="complementary"
      aria-label="NinjaTrader promotion"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border-2 transition-colors duration-1000 ${
          showPulse
            ? isDark
              ? 'border-emerald-400/40 bg-[#0F131A] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)]'
              : 'border-emerald-400/60 bg-white shadow-[0_24px_80px_-20px_rgba(15,23,42,0.22)]'
            : isDark
              ? 'border-[#2a2e39] bg-[#0F131A] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)]'
              : 'border-slate-200 bg-white shadow-[0_24px_80px_-20px_rgba(15,23,42,0.22)]'
        }`}
      >
        {/* Gradient glow overlay */}
        <div
          className={`pointer-events-none absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.08),_transparent_50%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]'
              : 'bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.06),_transparent_50%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-emerald-400/30' : 'via-emerald-500/20'}`}
        />

        {/* Close button */}
        <button
          onClick={dismiss}
          className={`absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-transparent transition-colors ${
            isDark
              ? 'text-slate-500 hover:border-[#2a2e39] hover:bg-[#171b22] hover:text-slate-200'
              : 'text-slate-400 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700'
          }`}
          aria-label="Close"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="relative p-4">
          <div className="flex items-start gap-3 pr-8">
            {/* Larger logo */}
            <div
              className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl border shadow-sm ${
                isDark
                  ? 'border-[#2a2e39] bg-[#11161E]'
                  : 'border-slate-200/80 bg-slate-50'
              }`}
            >
              <Image
                src="/images/resources/ninjatrader.png"
                alt="NinjaTrader"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-[13px] font-bold leading-5 ${isDark ? 'text-white' : 'text-slate-900'}`}
              >
                {titleText}
              </p>
              <p
                className={`mt-1 text-[12px] leading-[1.25rem] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {t('promoDesc')}
              </p>
            </div>
          </div>

          {/* Social proof */}
          <div
            className={`mt-2.5 flex items-center gap-1.5 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            <svg
              className="h-3.5 w-3.5 flex-none text-emerald-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t('promoSocial')}</span>
          </div>

          {/* CTA area */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <p
              className={`text-[10px] leading-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
            >
              {t('promoAffiliate')}
            </p>
            <div className="flex min-w-0 items-center gap-2">
              <a
                href={NINJATRADER_LINK}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="group relative inline-flex min-h-9 min-w-0 items-center gap-1 overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-[12px] font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:shadow-emerald-600/30 hover:brightness-110 active:scale-[0.97]"
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative truncate">{t('promoCta')}</span>
              </a>
              <button
                type="button"
                onClick={copyLink}
                title={copied ? 'Copied' : 'Copy link'}
                aria-label={
                  copied ? 'Copied NinjaTrader link' : 'Copy NinjaTrader link'
                }
                className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border transition-all active:scale-[0.97] ${
                  copied
                    ? isDark
                      ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-300'
                      : 'border-emerald-500/60 bg-emerald-50 text-emerald-700'
                    : isDark
                      ? 'border-[#2a2e39] bg-[#11161E] text-slate-300 hover:border-emerald-400/50 hover:text-emerald-300'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-400/60 hover:text-emerald-700'
                }`}
              >
                {copied ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V5a2 2 0 012-2h7a2 2 0 012 2v7a2 2 0 01-2 2h-2"
                    />
                    <rect
                      width="11"
                      height="11"
                      x="5"
                      y="10"
                      rx="2"
                      strokeWidth={2}
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NinjaTraderPromo({
  trigger,
  isProfit,
}: {
  trigger: number;
  isProfit?: boolean;
}) {
  // NinjaTraderPromoInner only consumes useUiStore / usePlayI18n — it never
  // calls next-auth useSession(), so it does NOT need to be wrapped in a
  // <SessionProvider>. The previous <Providers> wrapper caused a redundant
  // /api/auth/session fetch on /play on top of the header + SessionSummary
  // providers, so it has been removed.
  return <NinjaTraderPromoInner trigger={trigger} isProfit={isProfit} />;
}
