import { createFileRoute } from '@tanstack/react-router';
import { UserAgreementPage } from '@/components/marketing/legal-pages';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/user-agreement')({
  head: () =>
    seo('/user-agreement', {
      title: m.seo_user_agreement_title(),
      description: m.seo_user_agreement_description(),
    }),
  component: UserAgreementPage,
});
