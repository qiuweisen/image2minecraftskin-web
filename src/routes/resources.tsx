import { createFileRoute } from '@tanstack/react-router';
import { ResourcesPage } from '@/components/marketing/resources-page';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/resources')({
  head: () =>
    seo('/resources', {
      title: m.seo_resources_title(),
      description: m.seo_resources_description(),
    }),
  component: ResourcesPage,
});
