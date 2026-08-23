export const SITEMAP_LOCALIZED_ROUTES = [
  '/',
  '/play',
  '/day-trading-simulator',
  '/crypto-trading-simulator',
  '/forex-trading-simulator',
  '/intraday-trading-practice',
  '/market-replay',
  '/resources',
] as const;

export const SITEMAP_BASE_LOCALE_ROUTES = [
  '/about',
  '/contact',
  '/privacy-policy',
  '/user-agreement',
] as const;

/** Public pages whose content exists only in the base (English) locale. */
export function isBaseLocaleOnlyPath(pathname: string): boolean {
  return (
    pathname === '/blog' ||
    pathname.startsWith('/blog/') ||
    (SITEMAP_BASE_LOCALE_ROUTES as readonly string[]).includes(pathname)
  );
}
