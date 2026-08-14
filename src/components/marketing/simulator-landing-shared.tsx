import { Link } from '@tanstack/react-router';
import type { Icon } from '@tabler/icons-react';
import { IconArrowUpRight, IconCheck } from '@tabler/icons-react';
import Container from '@/components/layout/container';
import { HeaderSection } from '@/components/shared/header-section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getLocale, parseMessageJson } from '@/lib/locale';
import { m } from '@/locale/paraglide/messages';

export type Step = {
  number: string;
  title: string;
  text: string;
};

export type Faq = {
  q: string;
  a: string;
};

export type RelatedTool = {
  href: string;
  name: string;
  text: string;
};

export type Schema = Record<string, unknown>;

export type PairSimulatorCopy = {
  pageUrl: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  heroDescription: string;
  toolUrl: string;
  actionLabel: string;
  icon: Icon;
  facts: Array<{ value: string; label: string }>;
  introTitle: string;
  introParagraphs: string[];
  pairsTitle: string;
  pairsDescription: string;
  pairs: string[];
  stepsTitle: string;
  steps: Step[];
  practiceItems: string[];
  limitsTitle: string;
  limitsLead: string;
  limitsLink?: { href: string; label: string };
  limitsLeadAfter: string;
  limitsBody: string;
  ctaDescription: string;
  ctaActionLabel: string;
  schema: Schema;
  breadcrumb?: string;
  practiceTitle?: string;
  ctaTitle?: string;
};

export function localizedArray(value: string | string[]) {
  return Array.isArray(value) ? value : parseMessageJson<string[]>(value, []);
}

export function createPageSchema({
  pageUrl,
  name,
  description,
  breadcrumb,
  dateModified,
  faqs = [],
}: {
  pageUrl: string;
  name: string;
  description: string;
  breadcrumb: string;
  dateModified: string;
  faqs?: Faq[];
}): Schema {
  const graph: Schema[] = [
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name,
      description,
      inLanguage: getLocale(),
      isPartOf: { '@id': 'https://chartmini.com/#website' },
      about: { '@id': 'https://chartmini.com/#software' },
      dateModified,
      breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: m.common_home(),
          item: 'https://chartmini.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: breadcrumb,
          item: pageUrl,
        },
      ],
    },
  ];

  if (faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

export function StructuredData({ schema }: { schema: Schema }) {
  const schemaJson = JSON.stringify(schema).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaJson }}
    />
  );
}

export function PageBreadcrumb({ label }: { label: string }) {
  return (
    <Breadcrumb className="mb-10">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to="/" />}>
            {m.common_home()}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function ActionLink({
  to,
  children,
  variant = 'default',
}: {
  to: string;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
}) {
  return (
    <Link
      to={to}
      className={cn(buttonVariants({ size: 'lg', variant }), 'gap-2')}
    >
      {children}
      <IconArrowUpRight className="size-4" />
    </Link>
  );
}

export function PageHero({
  eyebrow,
  heading,
  description,
  icon: IconComponent,
  action,
  align = 'center',
}: {
  eyebrow: string;
  heading: string;
  description: string;
  icon: Icon;
  action?: { label: string; to: string };
  align?: 'center' | 'start';
}) {
  const centered = align === 'center';
  return (
    <section
      className={cn(
        'mb-16 md:mb-20',
        centered ? 'mx-auto max-w-4xl' : 'max-w-3xl'
      )}
    >
      <HeaderSection
        subtitle={heading}
        subtitleAs="h1"
        description={description}
        className={cn(
          'gap-5',
          centered ? 'items-center text-center' : 'items-start text-left'
        )}
        subtitleClassName="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        descriptionClassName="text-pretty text-base leading-7 sm:text-lg"
      >
        <Badge variant="outline" className="order-first gap-2 px-3 py-1.5">
          <IconComponent className="size-3.5" aria-hidden="true" />
          {eyebrow}
        </Badge>
        {action ? <ActionLink to={action.to}>{action.label}</ActionLink> : null}
      </HeaderSection>
    </section>
  );
}

export function SectionHeading({
  id,
  title,
  description,
  centered = false,
}: {
  id?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <HeaderSection
      id={id}
      subtitle={title}
      subtitleAs="h2"
      description={description}
      className={cn(
        'mb-8 gap-3',
        centered ? 'items-center text-center' : 'items-start text-left'
      )}
      subtitleClassName="text-balance text-2xl font-semibold tracking-tight sm:text-3xl"
      descriptionClassName="max-w-3xl text-pretty text-base leading-7"
    />
  );
}

export function StepCards({ steps }: { steps: Step[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step) => (
        <Card key={step.number} className="h-full">
          <CardHeader className="gap-4">
            <Badge
              variant="secondary"
              className="size-8 justify-center rounded-full p-0 text-sm"
            >
              {step.number}
            </Badge>
            <h3 className="text-lg font-semibold leading-snug">{step.title}</h3>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            {step.text}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RelatedTools({ tools }: { tools: RelatedTool[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tools.map((tool) => (
        <Link key={tool.href} to={tool.href} className="group block h-full">
          <Card className="h-full transition-colors group-hover:border-primary/40 group-focus-visible:border-primary group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
            <CardHeader className="gap-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold group-hover:text-primary">
                  {tool.name}
                </h3>
                <IconArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {tool.text}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <Card>
      <CardContent className="px-4 py-3 sm:px-8">
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.q}
              value={`faq-${index}`}
              className="border-dashed"
            >
              <AccordionTrigger className="text-base hover:no-underline sm:text-lg">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-base leading-7 text-muted-foreground">
                  {faq.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export function CallToAction({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions: Array<{
    label: string;
    to: string;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
}) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-6 p-6 text-center sm:p-10">
        <div className="space-y-3">
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-pretty leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {actions.map((action) => (
            <ActionLink key={action.to} to={action.to} variant={action.variant}>
              {action.label}
            </ActionLink>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PairSimulatorPage({ page }: { page: PairSimulatorCopy }) {
  return (
    <>
      <StructuredData schema={page.schema} />
      <Container className="px-4 py-8 md:py-12 lg:py-14">
        <PageBreadcrumb
          label={page.breadcrumb ?? page.heading.replace('Free ', '')}
        />
        <PageHero
          eyebrow={page.eyebrow}
          heading={page.heading}
          description={page.heroDescription}
          icon={page.icon}
          action={{ label: page.actionLabel, to: page.toolUrl }}
        />

        <div>
          <section aria-labelledby="replay-facts" className="mb-16 md:mb-20">
            <h2 id="replay-facts" className="sr-only">
              {page.heading} facts
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {page.facts.map((fact) => (
                <Card key={fact.label} size="sm">
                  <CardContent className="p-4 text-center sm:p-5">
                    <div className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
                      {fact.value}
                    </div>
                    <div className="mt-1 text-sm leading-snug text-muted-foreground">
                      {fact.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-16 grid gap-4 md:mb-20 md:grid-cols-[1.05fr_0.95fr]">
            <Card>
              <CardHeader className="border-b">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {page.introTitle}
                </h2>
              </CardHeader>
              <CardContent className="space-y-4 p-6 text-base leading-7 text-muted-foreground sm:p-8">
                {page.introParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {page.pairsTitle}
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  {page.pairsDescription}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <ul
                  className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                  aria-label={page.pairsTitle}
                >
                  {page.pairs.map((pair) => (
                    <li
                      key={pair}
                      className="border border-border bg-muted/40 px-3 py-2 text-center text-sm font-medium"
                    >
                      {pair}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="how-it-works" className="mb-16 md:mb-20">
            <SectionHeading
              id="how-it-works"
              title={page.stepsTitle}
              centered
            />
            <StepCards steps={page.steps} />
          </section>

          <section className="mb-16 md:mb-20">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div>
                  <CardHeader>
                    <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                      {page.practiceTitle ?? 'What you can practice'}
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                      {page.practiceItems.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <IconCheck
                            className="mt-1 size-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
                <div className="border-t border-border bg-muted/30 md:border-l md:border-t-0">
                  <CardHeader>
                    <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                      {page.limitsTitle}
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                    <p>
                      {page.limitsLead}
                      {page.limitsLink ? (
                        <a
                          href={page.limitsLink.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                        >
                          {page.limitsLink.label}
                        </a>
                      ) : null}
                      {page.limitsLeadAfter}
                    </p>
                    <p>{page.limitsBody}</p>
                  </CardContent>
                </div>
              </div>
            </Card>
          </section>

          <CallToAction
            title={page.ctaTitle ?? 'Practice the chart before the next candle'}
            description={page.ctaDescription}
            actions={[
              {
                label: page.ctaActionLabel,
                to: page.toolUrl,
              },
            ]}
          />
        </div>
      </Container>
    </>
  );
}
