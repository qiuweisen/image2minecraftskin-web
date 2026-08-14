import { websiteConfig } from '@/config/website';
import {
  getCanonicalUrl,
  getCanonicalUrlForLocale,
  getBaseUrl,
  getOgImage,
  twitterHandleFromUrl,
} from '@/lib/urls';
import {
  baseLocale,
  getCanonicalLocale,
  getLocale,
  isLocalizedPath,
  localeConfig,
  selectableLocales,
} from '@/lib/locale';

/**
 * Build metadata + canonical link for a page
 * @param path - The path of the page
 * @param options - The options for the page
 * @returns The metadata and canonical link
 */
export function seo(
  path: string,
  options: {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: 'website' | 'article';
  }
) {
  const url = getCanonicalUrl(path);
  const image = options.image ?? getOgImage();
  const localized = isLocalizedPath(path);
  const alternateLinks = localized
    ? [
        ...selectableLocales.map((locale) => ({
          rel: 'alternate',
          hrefLang: localeConfig[locale].hreflang,
          href: getCanonicalUrlForLocale(path, locale),
        })),
        {
          rel: 'alternate',
          hrefLang: 'x-default',
          href: getCanonicalUrlForLocale(path, baseLocale),
        },
      ]
    : [];

  return {
    meta: metadata({ ...options, url, image, type: options.type ?? 'website' }),
    links: [{ rel: 'canonical', href: url }, ...alternateLinks],
  };
}

/**
 * Site-level JSON-LD shared by the public marketing pages. Keeping this in a
 * small helper avoids making every route duplicate the same graph and lets
 * staging use its own build-time origin while production uses chartmini.com.
 */
export function siteStructuredData() {
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: 'ChartMini',
        alternateName: ['ChartMini Trading Simulator', 'chartmini.com'],
        url: baseUrl,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${baseUrl}/#software`,
        name: 'ChartMini',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: baseUrl,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'ChartMini is a free browser-based trading simulator for daily stock, forex, and crypto replay plus intraday day trading practice on historical forex and crypto charts.',
        featureList: [
          'Chart Replay',
          'Historical Candlestick Data',
          'Price Action Practice',
          'No Signup Required',
          'Browser-Based Training',
        ],
      },
    ],
  };
}

export function faqStructuredData(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

export function simulatorStructuredData(path: string, description: string) {
  const url = getCanonicalUrl(path);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${getBaseUrl().replace(/\/$/, '')}/#software`,
    name: 'ChartMini',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url,
    description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function jsonLdScript(schema: unknown) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(schema).replace(/</g, '\\u003c'),
  };
}

export const metadata = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
}: {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  type?: 'website' | 'article';
}) => {
  const twitterSite = websiteConfig.social?.twitter
    ? twitterHandleFromUrl(websiteConfig.social.twitter)
    : null;
  // OG locale uses a territory-style value (e.g. zh_CN), while the HTML lang
  // and hreflang values use BCP 47 script/region tags such as zh-Hans.
  const currentLocale = getCanonicalLocale(getLocale());
  const ogLocale = localeConfig[currentLocale].ogLocale;
  const alternateLocales = selectableLocales
    .filter((l) => l !== currentLocale)
    .map((l) => localeConfig[l].ogLocale);
  const metadata: Array<{
    title?: string;
    name?: string;
    property?: string;
    content?: string;
  }> = [
    { title },
    ...(description ? [{ name: 'description', content: description }] : []),
    ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
    // OG metadata
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: websiteConfig.metadata?.name ?? '' },
    { property: 'og:locale', content: ogLocale },
    ...alternateLocales.map((loc) => ({
      property: 'og:locale:alternate',
      content: loc,
    })),
    { property: 'og:title', content: title },
    ...(description
      ? [{ property: 'og:description', content: description }]
      : []),
    ...(url ? [{ property: 'og:url', content: url }] : []),
    ...(image ? [{ property: 'og:image', content: image }] : []),
    // Twitter metadata (twitter:site = site's @username, not domain)
    { name: 'twitter:title', content: title },
    ...(twitterSite ? [{ name: 'twitter:site', content: twitterSite }] : []),
    ...(description
      ? [{ name: 'twitter:description', content: description }]
      : []),
    ...(url ? [{ name: 'twitter:url', content: url }] : []),
    ...(image
      ? [
          { name: 'twitter:card', content: 'summary_large_image' as const },
          { name: 'twitter:image', content: image },
        ]
      : []),
  ];
  return metadata;
};
