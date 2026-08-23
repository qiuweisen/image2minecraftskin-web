import { describe, expect, it } from 'vitest';
import { getChartMiniLegacyRedirect } from '@/lib/chartmini-legacy-redirects';
import { getBaseLocaleOnlyRedirectPath, isLocalizedPath } from '@/lib/locale';
import {
  SITEMAP_BASE_LOCALE_ROUTES,
  SITEMAP_LOCALIZED_ROUTES,
} from '@/lib/sitemap-routes';

describe('SEO URL redirects', () => {
  it('does not add a redirect for non-English blog URLs', () => {
    const response = getChartMiniLegacyRedirect(
      new Request(
        'https://chartmini.com/cs/blog/triple-ema-tradingview-tutorial?ref=gsc'
      )
    );

    expect(response).toBeNull();
  });

  it('does not convert the legacy zh blog alias into a 301', () => {
    const response = getChartMiniLegacyRedirect(
      new Request(
        'https://chartmini.com/zh/blog/triple-ema-tradingview-tutorial'
      )
    );

    expect(response).toBeNull();
  });

  it('redirects source route-group paths to public paths', () => {
    const response = getChartMiniLegacyRedirect(
      new Request('https://chartmini.com/(pages)/contact')
    );

    expect(response?.status).toBe(301);
    expect(response?.headers.get('location')).toBe(
      'https://chartmini.com/contact'
    );
  });

  it('leaves the English canonical blog URL alone', () => {
    const response = getChartMiniLegacyRedirect(
      new Request('https://chartmini.com/blog/triple-ema-tradingview-tutorial')
    );

    expect(response).toBeNull();
  });
});

describe('SEO sitemap locale contract', () => {
  it('keeps translated sitemap routes aligned with hreflang metadata', () => {
    expect(SITEMAP_LOCALIZED_ROUTES.every(isLocalizedPath)).toBe(true);
  });

  it('keeps English-only routes out of localized sitemap clusters', () => {
    expect(
      SITEMAP_BASE_LOCALE_ROUTES.every((path) => !isLocalizedPath(path))
    ).toBe(true);
    expect(isLocalizedPath('/blog')).toBe(false);
    expect(isLocalizedPath('/blog/example-post')).toBe(false);
  });

  it('redirects only locale-prefixed English-only public paths', () => {
    expect(getBaseLocaleOnlyRedirectPath('/fr/blog')).toBe('/blog');
    expect(getBaseLocaleOnlyRedirectPath('/fr/blog/example-post')).toBe(
      '/blog/example-post'
    );
    expect(getBaseLocaleOnlyRedirectPath('/zh-hans/privacy-policy')).toBe(
      '/privacy-policy'
    );
    expect(
      getBaseLocaleOnlyRedirectPath('/fr/crypto-trading-simulator')
    ).toBeNull();
    expect(getBaseLocaleOnlyRedirectPath('/blog/example-post')).toBeNull();
  });
});
