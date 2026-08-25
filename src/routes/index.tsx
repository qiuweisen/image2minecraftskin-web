import { HomePage } from '@/components/blocks/homepage';
import { websiteConfig } from '@/config/website';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { getLocale, localeConfig } from '@/lib/locale';
import { createFileRoute } from '@tanstack/react-router';
import { m } from '@/locale/paraglide/messages';
import { getHomepageConfig } from '@/config/homepage-config';

export const Route = createFileRoute('/')({
  head: () => {
    const name = websiteConfig.metadata?.name ?? '';
    const title = m.site_title();
    const description = m.site_description();
    const url = getCanonicalUrl('/');
    const inLanguage = localeConfig[getLocale()].hreflang;
    const homepageConfig = getHomepageConfig();
    const webSiteJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name,
      description,
      url,
      inLanguage,
    };
    const webApplicationJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web browser',
      url,
      description,
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    };
    const metadata = seo('/', { title, description });
    const faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: homepageConfig.faqs.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    };
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(webSiteJsonLd),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(webApplicationJsonLd),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(faqJsonLd),
        },
      ],
    };
  },
  component: HomePage,
});
