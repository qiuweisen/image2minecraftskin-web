import { Routes } from '@/lib/routes';
import { m } from '@/locale/paraglide/messages';
import {
  IconArrowsExchange,
  IconClock,
  IconCoinBitcoin,
  IconHistory,
} from '@tabler/icons-react';
import type { MenuItemConfig } from '../types';

/**
 * ChartMini's public navigation. The dropdown keeps the original simulator
 * URLs discoverable while using TanStarter's native NavigationMenu component.
 */
export function getNavbarLinks(): MenuItemConfig[] {
  return [
    {
      title: m.nav_simulator(),
      items: [
        {
          title: m.nav_market_replay(),
          href: '/market-replay',
          icon: IconHistory,
          external: false,
        },
        {
          title: m.nav_intraday_practice(),
          href: '/intraday-trading-practice',
          icon: IconClock,
          external: false,
        },
        {
          title: m.nav_forex_simulator(),
          href: '/forex-trading-simulator',
          icon: IconArrowsExchange,
          external: false,
        },
        {
          title: m.nav_crypto_simulator(),
          href: '/crypto-trading-simulator',
          icon: IconCoinBitcoin,
          external: false,
        },
      ],
    },
    { title: m.nav_blog(), href: Routes.Blog, external: false },
    { title: m.nav_rewards(), href: '/resources', external: false },
  ];
}
