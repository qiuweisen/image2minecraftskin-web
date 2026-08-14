import { m } from '@/locale/paraglide/messages';
import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { ContactFormCard } from '@/components/contact/contact-form-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { websiteConfig } from '@/config/website';
import { seo } from '@/lib/seo';
import { getCanonicalLocale, getLocale } from '@/lib/locale';
import { IconMail } from '@tabler/icons-react';

export const Route = createFileRoute('/(pages)/contact')({
  head: () => {
    const isEnglish = getCanonicalLocale(getLocale()) === 'en';
    return seo('/contact', {
      title: isEnglish
        ? 'Contact Us – ChartMini'
        : `${m.contact_title()} | ${websiteConfig.metadata?.name}`,
      description: m.contact_description(),
    });
  },
  component: ContactPage,
});

function ContactPage() {
  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-4xl space-y-8 pb-16">
        <div className="space-y-4">
          <h1 className="text-center text-3xl font-bold tracking-tight">
            {m.contact_title()}
          </h1>
          <p className="text-center text-lg text-muted-foreground">
            {m.contact_description()}
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              We&apos;d love to hear from you
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center text-muted-foreground">
            <p>
              Whether you have a question about features, feedback on the
              simulator, or just want to say hello.
            </p>
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider">
                Email Us
              </p>
              <a
                href="mailto:support@chartmini.com"
                className="inline-flex items-center gap-2 text-lg font-medium text-foreground underline-offset-4 hover:underline"
              >
                <IconMail className="size-4" />
                support@chartmini.com
              </a>
            </div>
            <p className="border-t pt-6 text-sm">
              We typically respond within 24-48 hours.
            </p>
          </CardContent>
        </Card>
        <ContactFormCard />
      </div>
    </Container>
  );
}
