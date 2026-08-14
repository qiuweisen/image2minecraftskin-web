import { m } from '@/locale/paraglide/messages';
import {
  createPairSimulatorCopy,
  PairSimulatorPage,
} from '@/components/marketing/pair-simulator-page';

export function CryptoTradingSimulatorPage({ content }: { content: string[] }) {
  return (
    <PairSimulatorPage
      page={createPairSimulatorCopy({
        kind: 'crypto',
        content,
        title: m.seo_crypto_title(),
        description: m.seo_crypto_description(),
      })}
    />
  );
}
