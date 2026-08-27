import { createFileRoute } from '@tanstack/react-router';
import { SkinViewerPage } from '@/components/blocks/skin-viewer-page';
import { skinViewerConfig } from '@/config/skin-viewer-config';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';

export const Route = createFileRoute('/minecraft-skin-viewer')({
  head: () => {
    const config = skinViewerConfig;
    const url = getCanonicalUrl(config.path);
    return {
      ...seo(config.path, config.seo),
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Minecraft Skin Viewer',
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Web browser',
            url,
            description: config.seo.description,
            isAccessibleForFree: true,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: getCanonicalUrl('/'),
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Minecraft Skin Viewer',
                item: url,
              },
            ],
          }),
        },
      ],
    };
  },
  component: SkinViewerPage,
});
