import { createFileRoute } from '@tanstack/react-router';
import { LanguagesPage } from '@/components/marketing/languages-page';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/languages')({
  head: () =>
    seo('/languages', {
      title: m.seo_languages_title(),
      description: m.seo_languages_description(),
    }),
  component: LanguagesPage,
});
