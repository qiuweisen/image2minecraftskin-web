import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  IconArrowUpRight,
  IconCheck,
  IconInfoCircle,
  IconTarget,
  IconX,
} from '@tabler/icons-react';
import Container from '@/components/layout/container';
import { HeaderSection } from '@/components/shared/header-section';
import {
  ActionLink,
  CallToAction,
  FaqList,
  PageBreadcrumb,
  RelatedTools,
  SectionHeading,
  StructuredData,
  createPageSchema,
} from '@/components/marketing/simulator-landing-shared';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { m } from '@/locale/paraglide/messages';

function getLocalizedIntradayPage(content: string[]) {
  const values = content;
  let cursor = 0;
  const next = () => values[cursor++] ?? '';
  const breadcrumb = next();
  const heading = next();
  const heroDescription = next();
  const eyebrow = next();
  const heroAction = next();
  const selectorHeading = next();
  const selectorAria = next();
  const startPrefix = next();
  const startSuffix = next();
  const selectorDescriptionPrefix = next();
  const selectorDescriptionSuffix = next();
  const quickPlanTitle = next();
  const quickPlanDescription = next();
  const focusTitle = next();
  const focusDescription = next();
  const observeLabel = next();
  const checklistTitle = next();
  const checklistDescription = next();
  const checklistAria = next();
  const duringTitle = next();
  const duringDescription = next();
  const afterTitle = next();
  const afterDescription = next();
  const afterAria = next();
  const processDisclaimer = next();
  const comparisonTitle = next();
  const comparisonDescription = next();
  const comparisonCaption = next();
  const tableMethod = next();
  const tableDataFlow = next();
  const tableBestFor = next();
  const tableLimitation = next();
  const limitationsTitle = next();
  const limitationsDescription = next();
  const limitationsAria = next();
  const limitationsDisclaimer = next();
  const relatedTitle = next();
  const faqTitle = next();
  const ctaTitle = next();
  const ctaDescription = next();
  const ctaAction = next();
  const quickPlan = [1, 2, 3, 4, 5, 6].map((step) => ({
    step: String(step),
    title: next(),
    text: next(),
  }));
  const focusCards = [1, 2, 3, 4, 5, 6].map(() => ({
    name: next(),
    observe: next(),
    rule: next(),
  }));
  const checklist = [1, 2, 3, 4, 5].map(() => next());
  const workflow = [1, 2, 3, 4, 5].map(() => ({
    title: next(),
    text: next(),
  }));
  const reviewQuestions = [1, 2, 3, 4, 5].map(() => next());
  const comparison = [1, 2, 3, 4].map(() => ({
    method: next(),
    dataFlow: next(),
    bestFor: next(),
    limitation: next(),
  }));
  const limitations = [1, 2, 3, 4, 5, 6].map(() => next());
  const relatedHrefs = [
    '/day-trading-simulator',
    '/market-replay',
    '/forex-trading-simulator',
    '/crypto-trading-simulator',
    '/blog/day-trading-practice-simulator-replay-session',
    '/blog/support-and-resistance-practice-draw-levels-candle-by-candle',
  ];
  const relatedTools = relatedHrefs.map((href) => ({
    href,
    name: next(),
    text: next(),
  }));
  const faqs = [1, 2, 3, 4, 5, 6, 7].map(() => ({ q: next(), a: next() }));
  const markets = [
    { id: 'forex' as const, label: next(), hint: next() },
    { id: 'crypto' as const, label: next(), hint: next() },
  ];
  const pageUrl = 'https://chartmini.com/intraday-trading-practice';

  return {
    breadcrumb,
    heading,
    heroDescription,
    eyebrow,
    heroAction,
    selectorHeading,
    selectorAria,
    startPrefix,
    startSuffix,
    selectorDescriptionPrefix,
    selectorDescriptionSuffix,
    quickPlanTitle,
    quickPlanDescription,
    focusTitle,
    focusDescription,
    observeLabel,
    checklistTitle,
    checklistDescription,
    checklistAria,
    duringTitle,
    duringDescription,
    afterTitle,
    afterDescription,
    afterAria,
    processDisclaimer,
    comparisonTitle,
    comparisonDescription,
    comparisonCaption,
    tableMethod,
    tableDataFlow,
    tableBestFor,
    tableLimitation,
    limitationsTitle,
    limitationsDescription,
    limitationsAria,
    limitationsDisclaimer,
    relatedTitle,
    faqTitle,
    ctaTitle,
    ctaDescription,
    ctaAction,
    quickPlan,
    focusCards,
    checklist,
    workflow,
    reviewQuestions,
    comparison,
    limitations,
    relatedTools,
    faqs,
    markets,
    schema: createPageSchema({
      pageUrl,
      name: m.seo_intraday_practice_title(),
      description: m.seo_intraday_practice_description(),
      breadcrumb,
      dateModified: '2026-07-20',
      faqs,
    }),
  };
}

type IntradayPageCopy = ReturnType<typeof getLocalizedIntradayPage>;

type Market = 'forex' | 'crypto';

function PracticeMarketSelector({ copy }: { copy: IntradayPageCopy }) {
  const [market, setMarket] = useState<Market>('forex');
  const selectedLabel =
    copy.markets.find((item) => item.id === market)?.label ?? market;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {copy.selectorHeading}
        </h2>
      </div>
      <ToggleGroup
        multiple={false}
        value={[market]}
        onValueChange={(value) => {
          const next = value[0];
          if (next === 'forex' || next === 'crypto') setMarket(next);
        }}
        variant="outline"
        className="grid w-full grid-cols-2 gap-2"
        aria-label={copy.selectorAria}
      >
        {copy.markets.map((item) => (
          <ToggleGroupItem
            key={item.id}
            value={item.id}
            className="h-auto min-w-0 flex-col items-start gap-1 px-4 py-3 text-left data-[state=on]:border-primary data-[state=on]:bg-primary/10"
          >
            <span className="text-base font-semibold">{item.label}</span>
            <span className="text-xs leading-snug text-muted-foreground">
              {item.hint}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Link
        to="/day-trading-simulator"
        search={{ market }}
        className={cn(buttonVariants({ size: 'lg' }), 'w-full gap-2')}
      >
        {copy.startPrefix}
        {selectedLabel}
        {copy.startSuffix}
        <IconArrowUpRight className="size-4" />
      </Link>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {copy.selectorDescriptionPrefix}
        {selectedLabel}
        {copy.selectorDescriptionSuffix}
      </p>
    </div>
  );
}

export function IntradayTradingPracticePage({
  content,
}: {
  content: string[];
}) {
  const copy = getLocalizedIntradayPage(content);

  return (
    <>
      <StructuredData schema={copy.schema} />
      <Container className="px-4 py-8 md:py-12 lg:py-14">
        <PageBreadcrumb label={copy.breadcrumb} />

        <section className="mb-16 grid items-center gap-8 md:mb-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <HeaderSection
              subtitle={copy.heading}
              subtitleAs="h1"
              description={copy.heroDescription}
              className="items-start text-left"
              subtitleClassName="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
              descriptionClassName="text-pretty text-base leading-7 sm:text-lg"
            >
              <Badge
                variant="outline"
                className="order-first gap-2 px-3 py-1.5"
              >
                <IconTarget className="size-3.5" aria-hidden="true" />
                {copy.eyebrow}
              </Badge>
              <ActionLink to="/day-trading-simulator">
                {copy.heroAction}
              </ActionLink>
            </HeaderSection>
          </div>
          <Card>
            <CardContent className="p-6 sm:p-8">
              <PracticeMarketSelector copy={copy} />
            </CardContent>
          </Card>
        </section>

        <div>
          <section aria-labelledby="quick-plan" className="mb-16 md:mb-20">
            <SectionHeading
              id="quick-plan"
              title={copy.quickPlanTitle}
              description={copy.quickPlanDescription}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {copy.quickPlan.map((item) => (
                <Card key={item.step} className="h-full">
                  <CardHeader className="gap-4">
                    <Badge
                      variant="secondary"
                      className="size-8 justify-center rounded-full p-0 text-sm"
                    >
                      {item.step}
                    </Badge>
                    <h3 className="text-lg font-semibold leading-snug">
                      {item.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-muted-foreground">
                    {item.text}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="practice-focus" className="mb-16 md:mb-20">
            <SectionHeading
              id="practice-focus"
              title={copy.focusTitle}
              description={copy.focusDescription}
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {copy.focusCards.map((card) => (
                <Card key={card.name} className="flex h-full flex-col">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{card.name}</h3>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4 text-sm leading-7 text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        {copy.observeLabel}{' '}
                      </span>
                      {card.observe}
                    </p>
                    <p className="mt-auto border border-border bg-muted/40 px-4 py-3">
                      {card.rule}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="before-session" className="mb-16 md:mb-20">
            <Card>
              <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
                <CardHeader className="border-b lg:border-b-0 lg:border-r">
                  <SectionHeading
                    id="before-session"
                    title={copy.checklistTitle}
                    description={copy.checklistDescription}
                  />
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  <ul className="space-y-3" aria-label={copy.checklistAria}>
                    {copy.checklist.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 border border-border bg-muted/30 px-4 py-3 text-sm font-medium"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center border border-primary/50 text-primary">
                          <IconCheck className="size-3.5" aria-hidden="true" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
            </Card>
          </section>

          <section aria-labelledby="during-session" className="mb-16 md:mb-20">
            <SectionHeading
              id="during-session"
              title={copy.duringTitle}
              description={copy.duringDescription}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {copy.workflow.map((item, index) => (
                <Card key={item.title} className="h-full">
                  <CardHeader className="flex-row items-start gap-3">
                    <Badge
                      variant="secondary"
                      className="size-8 shrink-0 justify-center rounded-full p-0"
                    >
                      {index + 1}
                    </Badge>
                    <h3 className="text-base font-semibold leading-snug">
                      {item.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-muted-foreground">
                    {item.text}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="after-session" className="mb-16 md:mb-20">
            <Card>
              <CardHeader>
                <SectionHeading
                  id="after-session"
                  title={copy.afterTitle}
                  description={copy.afterDescription}
                />
              </CardHeader>
              <CardContent className="space-y-5">
                <ul
                  className="grid gap-3 sm:grid-cols-2"
                  aria-label={copy.afterAria}
                >
                  {copy.reviewQuestions.map((question) => (
                    <li
                      key={question}
                      className="flex items-start gap-3 border border-border bg-muted/30 px-4 py-3 text-sm leading-6"
                    >
                      <IconInfoCircle
                        className="mt-1 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
                <p className="border border-primary/20 bg-primary/5 p-5 text-sm font-medium leading-7 text-muted-foreground">
                  {copy.processDisclaimer}
                </p>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="compare-methods" className="mb-16 md:mb-20">
            <SectionHeading
              id="compare-methods"
              title={copy.comparisonTitle}
              description={copy.comparisonDescription}
            />
            <Card>
              <CardContent className="p-0 sm:p-2">
                <Table>
                  <TableCaption>{copy.comparisonCaption}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{copy.tableMethod}</TableHead>
                      <TableHead>{copy.tableDataFlow}</TableHead>
                      <TableHead>{copy.tableBestFor}</TableHead>
                      <TableHead>{copy.tableLimitation}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {copy.comparison.map((row) => (
                      <TableRow key={row.method}>
                        <TableHead className="whitespace-normal align-top font-medium">
                          {row.method}
                        </TableHead>
                        <TableCell className="whitespace-normal align-top text-muted-foreground">
                          {row.dataFlow}
                        </TableCell>
                        <TableCell className="whitespace-normal align-top text-muted-foreground">
                          {row.bestFor}
                        </TableCell>
                        <TableCell className="whitespace-normal align-top text-muted-foreground">
                          {row.limitation}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="limitations" className="mb-16 md:mb-20">
            <SectionHeading
              id="limitations"
              title={copy.limitationsTitle}
              description={copy.limitationsDescription}
            />
            <Card>
              <CardContent className="p-6">
                <ul
                  className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                  aria-label={copy.limitationsAria}
                >
                  {copy.limitations.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
                    >
                      <IconX
                        className="size-4 shrink-0 text-destructive"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">
                  {copy.limitationsDisclaimer}
                </p>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="related-tools" className="mb-16 md:mb-20">
            <SectionHeading id="related-tools" title={copy.relatedTitle} />
            <RelatedTools tools={copy.relatedTools} />
          </section>

          <section aria-labelledby="faq" className="mb-16 md:mb-20">
            <SectionHeading id="faq" title={copy.faqTitle} />
            <FaqList faqs={copy.faqs} />
          </section>

          <CallToAction
            title={copy.ctaTitle}
            description={copy.ctaDescription}
            actions={[
              {
                label: copy.ctaAction,
                to: '/day-trading-simulator',
              },
            ]}
          />
        </div>
      </Container>
    </>
  );
}
