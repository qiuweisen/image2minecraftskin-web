'use client';

import { useEffect, useState } from 'react';
import { IconCheck, IconCopy, IconExternalLink } from '@tabler/icons-react';
import { LegacyImage as Image } from '@/components/legacy-image';
import { usePlayI18n } from '@/components/PlayI18nProvider';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getBitgetPromoCopy } from '@/lib/i18n/bitgetPromo';
import { toLegacySupportedLang } from '@/lib/locale';
import { cn } from '@/lib/utils';

const BITGET_LINK =
  '/go/bitget?utm_source=chartmini&utm_medium=promo_card&utm_campaign=post_session&utm_content=bitget';
const BITGET_COPY_LINK = 'https://partner.bitget.cafe/bg/9XR2TJ';
const BITGET_EYEBROW = 'BITGET MULTI-ASSET';

const ASSET_TAGS = ['Crypto', 'Forex', 'Stocks', 'Gold'] as const;

function BitgetPromoInner({ trigger }: { trigger: number }) {
  const { lang } = usePlayI18n();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = getBitgetPromoCopy(toLegacySupportedLang(lang));

  useEffect(() => {
    if (trigger <= 0) return;
    setOpen(true);
    setCopied(false);
  }, [trigger]);

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
      window.setTimeout(() => setCopied(false), 1_600);
    } catch {
      setCopied(false);
    }
  };

  if (trigger <= 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[85vh] overflow-y-auto p-0 sm:max-w-md">
        <DialogHeader className="border-b bg-muted/30 px-6 py-5 pr-14">
          <Badge
            variant="outline"
            className="w-fit text-[10px] tracking-[0.18em]"
          >
            {BITGET_EYEBROW}
          </Badge>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-12 flex-none items-center justify-center rounded-xl border border-border bg-muted shadow-sm">
              <Image
                src="/images/resources/bitget.svg"
                alt="Bitget"
                width={34}
                height={34}
                loading="eager"
                className="size-[34px] object-contain"
              />
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {copy.accountLine}
            </div>
          </div>

          <fieldset
            className="grid grid-cols-4 gap-2 border-0 p-0"
            aria-label="Available market categories"
          >
            {ASSET_TAGS.map((asset) => (
              <Badge
                key={asset}
                variant="outline"
                className="h-9 w-full justify-center rounded-lg"
              >
                {asset}
              </Badge>
            ))}
          </fieldset>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            {copy.availability} {copy.productNote}
          </div>

          <DialogDescription className="text-xs">
            {copy.disclosure}
          </DialogDescription>
        </div>

        <DialogFooter className="m-0 rounded-none border-t px-6 py-4 sm:flex-row">
          <a
            href={BITGET_LINK}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className={cn(buttonVariants({ size: 'lg' }), 'min-w-0 flex-1')}
          >
            <span className="truncate">{copy.cta}</span>
            <IconExternalLink />
          </a>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={copyLink}
            title={copied ? copy.copied : copy.copy}
            aria-label={copied ? copy.copied : copy.copy}
            className={cn(
              copied && 'border-primary/60 bg-primary/10 text-primary'
            )}
          >
            {copied ? <IconCheck /> : <IconCopy />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function BitgetPromo({ trigger }: { trigger: number }) {
  return <BitgetPromoInner trigger={trigger} />;
}
