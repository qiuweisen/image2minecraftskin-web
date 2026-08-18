import { describe, expect, it } from 'vitest';
import { getChartMiniLegacyRedirect } from '@/lib/chartmini-legacy-redirects';

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
