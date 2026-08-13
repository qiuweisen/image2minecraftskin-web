'use client';

import { useEffect, useState } from 'react';
import BitgetPromo from '@/components/BitgetPromo';
import NinjaTraderPromo from '@/components/NinjaTraderPromo';
import type { PromoPartner } from '@/lib/partner-promo-eligibility';

// Keep the Bitget integration available, but route every promo to NinjaTrader
// until Bitget promotions are explicitly re-enabled.
const BITGET_PROMOS_ENABLED = false;

export default function PartnerPromo({
  trigger,
  isProfit,
  allowBitget = false,
}: {
  trigger: number;
  isProfit?: boolean;
  allowBitget?: boolean;
}) {
  const [partner, setPartner] = useState<PromoPartner | null>(null);

  useEffect(() => {
    if (trigger <= 0 || partner) return;

    if (!BITGET_PROMOS_ENABLED || !allowBitget) {
      setPartner('ninjatrader');
      return;
    }

    const controller = new AbortController();

    fetch('/api/promo-partner', {
      cache: 'no-store',
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to select promo partner');
        return response.json() as Promise<{ partner?: unknown }>;
      })
      .then((data) => {
        setPartner(data.partner === 'bitget' ? 'bitget' : 'ninjatrader');
      })
      .catch((error: unknown) => {
        if (
          error &&
          typeof error === 'object' &&
          'name' in error &&
          error.name === 'AbortError'
        )
          return;
        setPartner('ninjatrader');
      });

    return () => controller.abort();
  }, [allowBitget, partner, trigger]);

  if (!partner) return null;

  if (partner === 'bitget') {
    return <BitgetPromo trigger={trigger} />;
  }

  if (partner === 'ninjatrader') {
    return <NinjaTraderPromo trigger={trigger} isProfit={isProfit} />;
  }

  return null;
}
