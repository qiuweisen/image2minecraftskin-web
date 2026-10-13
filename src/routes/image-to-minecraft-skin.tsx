import { createFileRoute } from '@tanstack/react-router';
import {
  SeoGuidePage,
  seoGuideJsonLd,
} from '@/components/blocks/seo-guide-page';
import { getCanonicalUrl } from '@/lib/urls';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/image-to-minecraft-skin')({
  head: () => {
    const path = '/image-to-minecraft-skin';
    const url = getCanonicalUrl(path);
    return {
      ...seo(path, {
        title: m.seo_converter_title(),
        description: m.seo_converter_description(),
      }),
      scripts: seoGuideJsonLd('converter', url).map((json) => ({
        type: 'application/ld+json',
        children: JSON.stringify(json),
      })),
    };
  },
  component: () => <SeoGuidePage kind="converter" />,
});
