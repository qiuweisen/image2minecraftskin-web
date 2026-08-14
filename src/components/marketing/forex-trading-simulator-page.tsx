import { m } from '@/locale/paraglide/messages';
import {
  createPairSimulatorCopy,
  PairSimulatorPage,
} from '@/components/marketing/pair-simulator-page';

export function ForexTradingSimulatorPage({ content }: { content: string[] }) {
  return (
    <PairSimulatorPage
      page={createPairSimulatorCopy({
        kind: 'forex',
        content,
        title: m.seo_forex_title(),
        description: m.seo_forex_description(),
      })}
    />
  );
}
