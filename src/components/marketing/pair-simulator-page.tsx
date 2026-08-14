import { IconArrowsExchange, IconCoinBitcoin } from '@tabler/icons-react';
import {
  createPageSchema,
  localizedArray,
  PairSimulatorPage,
  type PairSimulatorCopy,
} from '@/components/marketing/simulator-landing-shared';

type PairKind = 'forex' | 'crypto';

const forexPairs = [
  'EUR/USD',
  'USD/JPY',
  'GBP/USD',
  'AUD/USD',
  'USD/CAD',
  'USD/CHF',
  'NZD/USD',
  'EUR/JPY',
  'GBP/JPY',
  'EUR/GBP',
  'AUD/JPY',
  'EUR/AUD',
  'EUR/CHF',
  'GBP/CHF',
];

const cryptoPairs = [
  'BTC/USDT',
  'ETH/USDT',
  'BNB/USDT',
  'XRP/USDT',
  'SOL/USDT',
  'TRX/USDT',
  'DOGE/USDT',
  'ZEC/USDT',
  'XLM/USDT',
  'LINK/USDT',
  'ADA/USDT',
  'BCH/USDT',
  'GRAM/USDT',
  'LTC/USDT',
  'SUI/USDT',
  'HBAR/USDT',
  'AVAX/USDT',
  'NEAR/USDT',
  'SHIB/USDT',
  'UNI/USDT',
  'TAO/USDT',
  'WLFI/USDT',
  'ONDO/USDT',
  'DEXE/USDT',
  'ASTER/USDT',
  'DOT/USDT',
  'SKY/USDT',
  'AAVE/USDT',
  'WLD/USDT',
  'MORPHO/USDT',
];

export function createPairSimulatorCopy({
  kind,
  content,
  title,
  description,
}: {
  kind: PairKind;
  content: string[];
  title: string;
  description: string;
}): PairSimulatorCopy {
  const values = localizedArray(content);
  let cursor = 0;
  const next = () => values[cursor++] ?? '';
  const breadcrumb = next();
  const eyebrow = next();
  const heading = next();
  const heroDescription = next();
  const actionLabel = next();
  const factValues =
    kind === 'forex'
      ? ['14', '5 min', '5m–12M', 'Random']
      : ['30', '2.97M', '5m–12M', 'Random'];
  const facts = factValues.map((value) => ({ value, label: next() }));
  const introTitle = next();
  const introParagraphs = [next(), next()];
  const pairsTitle = next();
  const pairsDescription = next();
  const stepsTitle = next();
  const steps = [1, 2, 3].map((number) => ({
    number: String(number),
    title: next(),
    text: next(),
  }));
  const practiceTitle = next();
  const practiceItems = [next(), next(), next(), next()];
  const limitsTitle = next();
  const limitsLead = next();
  const limitsLinkLabel = next();
  const limitsLeadAfter = next();
  const limitsBody = next();
  const ctaTitle = next();
  const ctaDescription = next();
  const ctaActionLabel = next();
  const pageUrl =
    kind === 'forex'
      ? 'https://chartmini.com/forex-trading-simulator'
      : 'https://chartmini.com/crypto-trading-simulator';

  return {
    pageUrl,
    title,
    description,
    eyebrow,
    heading,
    heroDescription,
    toolUrl: `/day-trading-simulator?market=${kind}`,
    actionLabel,
    icon: kind === 'forex' ? IconArrowsExchange : IconCoinBitcoin,
    facts,
    introTitle,
    introParagraphs,
    pairsTitle,
    pairsDescription,
    pairs: kind === 'forex' ? forexPairs : cryptoPairs,
    stepsTitle,
    steps,
    practiceItems,
    limitsTitle,
    limitsLead,
    limitsLink: {
      href:
        kind === 'forex'
          ? 'https://www.dukascopy.com/trading-tools/api/documentation/quotes'
          : 'https://developers.binance.com/en/docs/catalog/core-trading-spot-trading/api/rest-api/market',
      label: limitsLinkLabel,
    },
    limitsLeadAfter,
    limitsBody,
    ctaDescription,
    ctaActionLabel,
    breadcrumb,
    practiceTitle,
    ctaTitle,
    schema: createPageSchema({
      pageUrl,
      name: title,
      description,
      breadcrumb,
      dateModified: kind === 'forex' ? '2026-07-17' : '2026-07-18',
    }),
  };
}

export { PairSimulatorPage };
