import type { MenuItemConfig } from '../types';
import { Routes } from '@/lib/routes';
import { m } from '@/locale/paraglide/messages';

/** Public navigation for the focused Minecraft skin tool. */
export function getNavbarLinks(): MenuItemConfig[] {
  return [
    {
      title: m.skin_nav_generator(),
      href: '/#generator',
      external: false,
    },
    {
      title: m.skin_nav_guides(),
      href: '/#compatibility-title',
      external: false,
    },
    {
      title: m.skin_nav_privacy(),
      href: Routes.PrivacyPolicy,
      external: false,
    },
  ];
}
