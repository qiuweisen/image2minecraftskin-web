import { createFileRoute } from '@tanstack/react-router';
import {
  SeoGuidePage,
  seoGuideJsonLd,
} from '@/components/blocks/seo-guide-page';
import { getCanonicalUrl } from '@/lib/urls';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/minecraft-skin-formats')({
  head: () => {
    const path = '/minecraft-skin-formats';
    const url = getCanonicalUrl(path);
    return {
      ...seo(path, {
        title: m.seo_formats_title(),
        description: m.seo_formats_description(),
      }),
      scripts: seoGuideJsonLd('formats', url).map((json) => ({
        type: 'application/ld+json',
        children: JSON.stringify(json),
      })),
    };
  },
  component: () => <SeoGuidePage kind="formats" />,
});
