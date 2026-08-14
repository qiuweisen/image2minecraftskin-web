'use client';

import { useEffect, useState } from 'react';
import { IconCheck, IconCopy, IconX } from '@tabler/icons-react';
import { LegacyImage as Image } from '@/components/legacy-image';
import { usePlayI18n } from '@/components/PlayI18nProvider';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const NINJATRADER_LINK =
  'https://ninjatraderdomesticvendor.sjv.io/c/6570566/3069488/37581';
const NINJATRADER_COPY_LINK = NINJATRADER_LINK;
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
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (trigger <= 0 || !shouldShow()) return;

    setMounted(true);
    setVisible(false);
    setCopied(false);

    let enterFrame = 0;
    let visibleFrame = 0;
    const pulseTimer = window.setTimeout(() => setShowPulse(false), 2_000);

    enterFrame = window.requestAnimationFrame(() => {
      visibleFrame = window.requestAnimationFrame(() => {
        setVisible(true);
        setShowPulse(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(enterFrame);
      window.cancelAnimationFrame(visibleFrame);
      window.clearTimeout(pulseTimer);
    };
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
      window.setTimeout(() => setCopied(false), 1_600);
    } catch {
      setCopied(false);
    }
  };

  if (!mounted || trigger <= 0 || !shouldShow()) return null;

  const titleText =
    isProfit === true
      ? t('promoTitleWin')
      : isProfit === false
        ? t('promoTitleLose')
        : t('promoTitle');

  return (
    <aside
      className={cn(
        'fixed bottom-3 left-3 z-50 w-max max-w-[calc(100vw-1.5rem)] transition-all duration-300 ease-out md:bottom-4 md:left-4 md:max-w-[420px]',
        visible
          ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
          : '-translate-x-4 translate-y-6 scale-95 opacity-0'
      )}
      aria-label="NinjaTrader promotion"
    >
      <Card
        className={cn(
          'relative w-full rounded-2xl border-2 bg-card p-0 text-card-foreground shadow-[0_24px_80px_-20px_rgba(15,23,42,0.22)] transition-colors duration-1000 dark:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)]',
          showPulse
            ? 'border-emerald-400/60 dark:border-emerald-400/40'
            : 'border-border'
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_50%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)] dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent dark:via-emerald-400/30" />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={dismiss}
          className="absolute right-2.5 top-2.5 z-10 rounded-full text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <IconX />
        </Button>

        <CardContent className="relative p-4">
          <div className="flex items-start gap-3 pr-8">
            <div className="flex size-11 flex-none items-center justify-center rounded-xl border border-border bg-muted shadow-sm">
              <Image
                src="/images/resources/ninjatrader.png"
                alt="NinjaTrader"
                width={32}
                height={32}
                className="size-8 rounded-lg object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-[13px] font-bold leading-5">
                {titleText}
              </CardTitle>
              <CardDescription className="mt-1 text-[12px] leading-5">
                {t('promoDesc')}
              </CardDescription>
            </div>
          </div>

          <Badge
            variant="outline"
            className="mt-2.5 gap-1.5 border-0 bg-transparent p-0 text-[11px] text-muted-foreground"
          >
            <IconCheck className="size-3.5 text-emerald-500" />
            {t('promoSocial')}
          </Badge>

          <div className="mt-3 flex items-center justify-between gap-2">
            <CardDescription className="min-w-0 text-[10px] leading-4 text-muted-foreground">
              {t('promoAffiliate')}
            </CardDescription>

            <div className="flex min-w-0 items-center gap-2">
              <a
                href={NINJATRADER_LINK}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'min-w-0 overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 font-bold text-white shadow-lg shadow-emerald-600/20 hover:brightness-110 hover:shadow-emerald-600/30'
                )}
              >
                <span className="truncate">{t('promoCta')}</span>
              </a>

              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                onClick={copyLink}
                title={copied ? 'Copied' : 'Copy link'}
                aria-label={
                  copied ? 'Copied NinjaTrader link' : 'Copy NinjaTrader link'
                }
                className={cn(
                  copied &&
                    'border-emerald-500/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                )}
              >
                {copied ? <IconCheck /> : <IconCopy />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

export default function NinjaTraderPromo({
  trigger,
  isProfit,
}: {
  trigger: number;
  isProfit?: boolean;
}) {
  return <NinjaTraderPromoInner trigger={trigger} isProfit={isProfit} />;
}
