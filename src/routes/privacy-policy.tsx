import { createFileRoute } from '@tanstack/react-router';
import { PrivacyPolicyPage } from '@/components/marketing/legal-pages';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/privacy-policy')({
  head: () =>
    seo('/privacy-policy', {
      title: m.seo_privacy_policy_title(),
      description: m.seo_privacy_policy_description(),
    }),
  component: PrivacyPolicyPage,
});
