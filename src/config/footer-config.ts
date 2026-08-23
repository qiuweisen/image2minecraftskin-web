import type { MenuItemConfig } from '../types';
import { m } from '@/locale/paraglide/messages';

/** Original ChartMini public links, grouped for TanStarter's native Footer. */
export function getFooterLinks(): MenuItemConfig[] {
  return [
    {
      title: m.footer_trading_practice_pages(),
      items: [
        {
          title: m.footer_crypto_trading_simulator(),
          href: '/crypto-trading-simulator',
        },
        {
          title: m.footer_forex_trading_simulator(),
          href: '/forex-trading-simulator',
        },
        { title: m.footer_market_replay(), href: '/market-replay' },
        {
          title: m.footer_intraday_practice(),
          href: '/intraday-trading-practice',
        },
      ],
    },
    {
      title: m.footer_content(),
      items: [
        { title: m.footer_blog(), href: '/blog', baseLocaleOnly: true },
        { title: m.footer_about(), href: '/about', baseLocaleOnly: true },
        { title: m.footer_contact(), href: '/contact', baseLocaleOnly: true },
      ],
    },
    {
      title: m.footer_legal(),
      items: [
        {
          title: m.footer_user_agreement(),
          href: '/user-agreement',
          baseLocaleOnly: true,
        },
        {
          title: m.footer_privacy_policy(),
          href: '/privacy-policy',
          baseLocaleOnly: true,
        },
      ],
    },
  ];
}
