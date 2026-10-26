import { getCreditBalance, getCreditPackages } from '@/api/credits';
import { CheckoutButton } from '@/components/pricing/create-checkout-button';
import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { clientEnv } from '@/env/client';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/settings/credits')({
  component: CreditsPage,
});

type Pack = {
  id: string;
  amount: number;
  price: { amount: number; currency: string; priceId: string };
};

function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function CreditsPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [error, setError] = useState<string>();
  const paymentOn = clientEnv.VITE_PAYMENT_PROVIDER === 'stripe';
  const aiOn = clientEnv.VITE_AI_SKIN_ENABLED === 'true';

  useEffect(() => {
    void (async () => {
      try {
        const [nextBalance, nextPacks] = await Promise.all([
          getCreditBalance(),
          getCreditPackages(),
        ]);
        setBalance(nextBalance.balance);
        setPacks(nextPacks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load credits');
      }
    })();
  }, []);

  return (
    <SidebarLayout>
      <main className="mx-auto w-full max-w-5xl p-6 text-zinc-100">
        <div className="mb-8">
          <h1 className="font-mono text-2xl text-cyan-200">Buy credits</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            One-time packs only — no subscription. AI skin costs 1 credit each.
            Failed generations refund automatically.
          </p>
        </div>

        <div className="mb-6 border border-cyan-300/30 bg-zinc-950 px-4 py-3 font-mono text-sm">
          Balance:{' '}
          <strong className="text-cyan-100">
            {balance === null ? '…' : balance}
          </strong>{' '}
          · 1 credit / AI skin
        </div>

        {!paymentOn && (
          <p className="mb-4 border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Payment is not enabled in this build (`VITE_PAYMENT_PROVIDER` must
            be `stripe`).
          </p>
        )}
        {!aiOn && (
          <p className="mb-4 border border-zinc-700 px-4 py-3 text-sm text-zinc-400">
            AI skin flag is off (`VITE_AI_SKIN_ENABLED`). Packs can still be
            purchased once Stripe is configured.
          </p>
        )}
        {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          {packs.map((pack) => {
            const isValue = pack.id === 'ai_skin_60';
            return (
              <article
                key={pack.id}
                className={`border bg-zinc-950 p-5 ${isValue ? 'border-cyan-300/70' : 'border-zinc-700'}`}
              >
                {isValue && (
                  <span className="mb-3 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-300">
                    Best value
                  </span>
                )}
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                  {pack.id === 'ai_skin_20' ? 'Starter' : 'Value'}
                </p>
                <p className="mt-2 text-3xl font-semibold text-zinc-50">
                  {formatUsd(pack.price.amount)}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {pack.amount} credits
                </p>
                <ul className="mt-4 space-y-1 text-sm text-zinc-400">
                  <li>
                    ~{formatUsd(Math.round(pack.price.amount / pack.amount))}{' '}
                    per AI skin
                  </li>
                  <li>One-time purchase</li>
                  <li>Auto-refund on failure</li>
                </ul>
                <CheckoutButton
                  planId={pack.id}
                  priceId={pack.price.priceId}
                  className="mt-5 w-full"
                  variant={isValue ? 'default' : 'outline'}
                >
                  Buy {pack.amount} credits
                </CheckoutButton>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          Checkout via Stripe · returns to settings and refreshes balance.{' '}
          <Link to="/" className="text-cyan-300 underline underline-offset-4">
            Back to generator
          </Link>
        </p>
      </main>
    </SidebarLayout>
  );
}
