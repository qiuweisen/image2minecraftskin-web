import type { MenuItemConfig } from '../types';
import { Routes } from '@/lib/routes';
import { m } from '@/locale/paraglide/messages';

/** Public navigation for the focused Minecraft skin tool. */
export function getNavbarLinks(): MenuItemConfig[] {
  return [
    { title: 'Generator', href: '/#generator', external: false },
    { title: 'Guides', href: '/#compatibility-title', external: false },
    {
      title: 'Privacy',
      href: Routes.PrivacyPolicy,
      external: false,
    },
  ];
}
