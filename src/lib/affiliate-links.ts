export const affiliateLinks = {
  bitget: {
    name: 'Bitget',
    targetUrl: 'https://partner.bitget.cafe/bg/9XR2TJ',
  },
  ninjatrader: {
    name: 'NinjaTrader',
    targetUrl:
      'https://ninjatraderdomesticvendor.sjv.io/c/6570566/3069488/37581',
  },
} as const;

export const affiliateQueryParams = [
  'src',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;
