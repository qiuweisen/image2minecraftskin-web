'use client';

import { LegacyImage as Image } from '@/components/legacy-image';
import { useEffect, useState } from 'react';
import { usePlayI18n } from '@/components/PlayI18nProvider';
import { getBitgetPromoCopy } from '@/lib/i18n/bitgetPromo';
import { toLegacySupportedLang } from '@/lib/locale';
import { useUiStore } from '@/store/useUiStore';

const BITGET_LINK =
  '/go/bitget?utm_source=chartmini&utm_medium=promo_card&utm_campaign=post_session&utm_content=bitget';
const BITGET_COPY_LINK = 'https://partner.bitget.cafe/bg/9XR2TJ';
const BITGET_EYEBROW = 'BITGET MULTI-ASSET';
const EXIT_ANIMATION_MS = 320;

const ASSET_TAGS = [
  {
    label: 'Crypto',
    light: 'border-cyan-200 bg-cyan-50 text-cyan-800',
    dark: 'border-cyan-300/20 bg-cyan-400/10 text-cyan-200',
  },
  {
    label: 'Forex',
    light: 'border-indigo-200 bg-indigo-50 text-indigo-800',
    dark: 'border-indigo-300/20 bg-indigo-400/10 text-indigo-200',
  },
  {
    label: 'Stocks',
    light: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    dark: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200',
  },
  {
    label: 'Gold',
    light: 'border-amber-200 bg-amber-50 text-amber-800',
    dark: 'border-amber-300/20 bg-amber-400/10 text-amber-200',
  },
] as const;

function BitgetPromoInner({ trigger }: { trigger: number }) {
  const { lang, t } = usePlayI18n();
  const theme = useUiStore((s) => (s as any).theme as 'light' | 'dark');
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = getBitgetPromoCopy(toLegacySupportedLang(lang));

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
    if (trigger <= 0) return;

    setMounted(true);
    setVisible(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
        setShowPulse(true);
        window.setTimeout(() => setShowPulse(false), 2000);
      });
    });
  }, [trigger]);

  const dismiss = () => {
    setVisible(false);
    window.setTimeout(() => setMounted(false), EXIT_ANIMATION_MS);
  };

  const copyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(BITGET_COPY_LINK);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = BITGET_COPY_LINK;
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

  return (
    <aside
      className={`fixed bottom-3 left-3 z-50 w-[calc(100vw-1.5rem)] transition-all duration-300 ease-out md:bottom-4 md:left-4 md:w-[440px] ${
        visible
          ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
          : '-translate-x-4 translate-y-6 scale-95 opacity-0'
      }`}
      aria-label="Bitget promotion"
      data-promo-partner="bitget"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border-2 transition-colors duration-1000 ${
          showPulse
            ? isDark
              ? 'border-cyan-300/45 bg-[#0F131A] shadow-[0_24px_80px_-20px_rgba(0,240,255,0.20)]'
              : 'border-cyan-400/65 bg-white shadow-[0_24px_80px_-20px_rgba(8,145,178,0.22)]'
            : isDark
              ? 'border-[#2a2e39] bg-[#0F131A] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)]'
              : 'border-slate-200 bg-white shadow-[0_24px_80px_-20px_rgba(15,23,42,0.22)]'
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_top_right,_rgba(0,240,255,0.10),_transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]'
              : 'bg-[radial-gradient(circle_at_top_right,_rgba(0,194,209,0.08),_transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-cyan-300/35' : 'via-cyan-500/25'}`}
        />

        <button
          type="button"
          onClick={dismiss}
          className={`absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-transparent transition-colors ${
            isDark
              ? 'text-slate-500 hover:border-[#2a2e39] hover:bg-[#171b22] hover:text-slate-200'
              : 'text-slate-400 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700'
          }`}
          aria-label={t('dismiss')}
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
            <div
              className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl border shadow-sm ${
                isDark
                  ? 'border-cyan-300/15 bg-[#08181c]'
                  : 'border-cyan-200/80 bg-cyan-50'
              }`}
            >
              <Image
                src="/images/resources/bitget.svg"
                alt="Bitget"
                width={34}
                height={34}
                loading="eager"
                className="h-[34px] w-[34px] object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-[9px] font-extrabold uppercase tracking-[0.18em] ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}
              >
                {BITGET_EYEBROW}
              </p>
              <p
                className={`mt-1 text-[17px] font-black leading-[1.25] tracking-[-0.02em] ${isDark ? 'text-white' : 'text-slate-950'}`}
              >
                {copy.title}
              </p>
              <p
                className={`mt-1.5 text-[12px] leading-[1.15rem] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {copy.description}
              </p>
            </div>
          </div>

          <fieldset
            className="mt-3 grid grid-cols-4 gap-1.5 border-0 p-0"
            aria-label="Available market categories"
          >
            {ASSET_TAGS.map((asset) => (
              <span
                key={asset.label}
                className={`rounded-lg border px-2 py-2 text-center text-[10px] font-extrabold tracking-wide ${isDark ? asset.dark : asset.light}`}
              >
                {asset.label}
              </span>
            ))}
          </fieldset>

          <div
            className={`mt-2.5 rounded-xl border px-3 py-2.5 ${
              isDark
                ? 'border-cyan-300/10 bg-cyan-400/[0.04]'
                : 'border-cyan-100 bg-cyan-50/60'
            }`}
          >
            <p
              className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
            >
              {copy.accountLine}
            </p>
            <p
              className={`mt-1 text-[10px] leading-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
            >
              {copy.availability} {copy.productNote}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <a
                href={BITGET_LINK}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="group relative inline-flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-[#00E6F2] px-4 py-2.5 text-[12px] font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 hover:shadow-cyan-400/30 hover:brightness-110 active:translate-y-0 active:scale-[0.98]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative truncate">{copy.cta}</span>
                <span className="relative" aria-hidden="true">
                  →
                </span>
              </a>
              <button
                type="button"
                onClick={copyLink}
                title={copied ? copy.copied : copy.copy}
                aria-label={copied ? copy.copied : copy.copy}
                className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border transition-all active:scale-[0.97] ${
                  copied
                    ? isDark
                      ? 'border-cyan-300/60 bg-cyan-400/15 text-cyan-200'
                      : 'border-cyan-500/60 bg-cyan-50 text-cyan-700'
                    : isDark
                      ? 'border-[#2a2e39] bg-[#11161E] text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-cyan-400/60 hover:text-cyan-700'
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

          <p
            className={`mt-2 text-[9px] leading-3.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
          >
            {copy.disclosure}
          </p>
        </div>
      </div>
    </aside>
  );
}

export default function BitgetPromo({ trigger }: { trigger: number }) {
  return <BitgetPromoInner trigger={trigger} />;
}
