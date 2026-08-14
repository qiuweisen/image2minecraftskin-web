import {
  IconCheck,
  IconHistory,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import Container from '@/components/layout/container';
import {
  ActionLink,
  CallToAction,
  FaqList,
  PageBreadcrumb,
  PageHero,
  RelatedTools,
  SectionHeading,
  StepCards,
  StructuredData,
  createPageSchema,
  localizedArray,
} from '@/components/marketing/simulator-landing-shared';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { m } from '@/locale/paraglide/messages';

function getMarketReplayPage(content: string[]) {
  const values = localizedArray(content);
  let cursor = 0;
  const next = () => values[cursor++] ?? '';
  const breadcrumb = next();
  const eyebrow = next();
  const heading = next();
  const heroDescription = next();
  const replayModeLabel = next();
  const dailyBadge = next();
  const dailyHeading = next();
  const dailyDescription = next();
  const intradayBadge = next();
  const intradayHeading = next();
  const intradayDescription = next();
  const comparisonTitle = next();
  const comparisonDescription = next();
  const comparisonCaption = next();
  const featureHeader = next();
  const dailyHeader = next();
  const intradayHeader = next();
  const howItWorksTitle = next();
  const differencesTitle = next();
  const differencesDescription = next();
  const differencesDisclaimer = next();
  const coverageTitle = next();
  const dailyCoverageTitle = next();
  const dailyCoverageItems = [next(), next(), next(), next()];
  const intradayCoverageTitle = next();
  const intradayCoverageItems = [next(), next(), next(), next()];
  const coverageDisclaimer = next();
  const notSimulatedTitle = next();
  const notSimulatedDescription = next();
  const notSimulatedAria = next();
  const resultDisclaimer = next();
  const relatedToolsTitle = next();
  const faqTitle = next();
  const ctaTitle = next();
  const ctaDescription = next();
  const dailyAction = next();
  const forexAction = next();
  const cryptoAction = next();
  const supportedMarketsAria = next();
  const steps = [1, 2, 3].map((number) => ({
    number: String(number),
    title: next(),
    text: next(),
  }));
  const comparison = [1, 2, 3, 4, 5, 6].map(() => ({
    feature: next(),
    daily: next(),
    intraday: next(),
  }));
  const differences = [1, 2, 3].map(() => ({
    name: next(),
    text: next(),
  }));
  const notSimulated = Array.from({ length: 10 }, next);
  const relatedToolHrefs = [
    '/day-trading-simulator',
    '/forex-trading-simulator',
    '/crypto-trading-simulator',
    '/play',
    '/intraday-trading-practice',
  ];
  const relatedTools = relatedToolHrefs.map((href) => ({
    href,
    name: next(),
    text: next(),
  }));
  const faqs = [1, 2, 3, 4, 5, 6].map(() => ({ q: next(), a: next() }));
  const markets = [next(), next(), next()];
  const pageUrl = 'https://chartmini.com/market-replay';
  const title = m.seo_market_replay_title();
  const description = m.seo_market_replay_description();

  return {
    breadcrumb,
    eyebrow,
    heading,
    heroDescription,
    replayModeLabel,
    dailyBadge,
    dailyHeading,
    dailyDescription,
    intradayBadge,
    intradayHeading,
    intradayDescription,
    comparisonTitle,
    comparisonDescription,
    comparisonCaption,
    featureHeader,
    dailyHeader,
    intradayHeader,
    howItWorksTitle,
    differencesTitle,
    differencesDescription,
    differencesDisclaimer,
    coverageTitle,
    dailyCoverageTitle,
    dailyCoverageItems,
    intradayCoverageTitle,
    intradayCoverageItems,
    coverageDisclaimer,
    notSimulatedTitle,
    notSimulatedDescription,
    notSimulatedAria,
    resultDisclaimer,
    relatedToolsTitle,
    faqTitle,
    ctaTitle,
    ctaDescription,
    dailyAction,
    forexAction,
    cryptoAction,
    supportedMarketsAria,
    steps,
    comparison,
    differences,
    notSimulated,
    relatedTools,
    faqs,
    markets,
    schema: createPageSchema({
      pageUrl,
      name: title,
      description,
      breadcrumb,
      dateModified: '2026-07-19',
      faqs,
    }),
  };
}

export function MarketReplayPage({ content }: { content: string[] }) {
  const page = getMarketReplayPage(content);

  return (
    <>
      <StructuredData schema={page.schema} />
      <Container className="px-4 py-8 md:py-12 lg:py-14">
        <PageBreadcrumb label={page.breadcrumb} />
        <PageHero
          eyebrow={page.eyebrow}
          heading={page.heading}
          description={page.heroDescription}
          icon={IconHistory}
        />

        <div>
          <section aria-labelledby="replay-selector" className="mb-16 md:mb-20">
            <h2 id="replay-selector" className="sr-only">
              {page.replayModeLabel}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="flex h-full flex-col">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {page.dailyBadge}
                  </Badge>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {page.dailyHeading}
                  </h3>
                </CardHeader>
                <CardContent className="flex-1 space-y-5 text-sm leading-7 text-muted-foreground">
                  <p>{page.dailyDescription}</p>
                  <MarketList
                    items={page.markets}
                    ariaLabel={page.supportedMarketsAria}
                  />
                </CardContent>
                <CardFooter>
                  <ActionLink to="/play">{page.dailyAction}</ActionLink>
                </CardFooter>
              </Card>

              <Card className="flex h-full flex-col">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {page.intradayBadge}
                  </Badge>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {page.intradayHeading}
                  </h3>
                </CardHeader>
                <CardContent className="flex-1 space-y-5 text-sm leading-7 text-muted-foreground">
                  <p>{page.intradayDescription}</p>
                  <MarketList
                    items={page.markets.slice(1)}
                    ariaLabel={page.supportedMarketsAria}
                  />
                </CardContent>
                <CardFooter className="flex flex-wrap gap-3">
                  <ActionLink to="/day-trading-simulator?market=forex">
                    {page.forexAction}
                  </ActionLink>
                  <ActionLink
                    to="/day-trading-simulator?market=crypto"
                    variant="outline"
                  >
                    {page.cryptoAction}
                  </ActionLink>
                </CardFooter>
              </Card>
            </div>
          </section>

          <section
            aria-labelledby="daily-vs-intraday"
            className="mb-16 md:mb-20"
          >
            <SectionHeading
              id="daily-vs-intraday"
              title={page.comparisonTitle}
              description={page.comparisonDescription}
              centered
            />
            <Card>
              <CardContent className="p-0 sm:p-2">
                <Table>
                  <TableCaption>{page.comparisonCaption}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{page.featureHeader}</TableHead>
                      <TableHead className="text-primary">
                        {page.dailyHeader}
                      </TableHead>
                      <TableHead className="text-primary">
                        {page.intradayHeader}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {page.comparison.map((row) => (
                      <TableRow key={row.feature}>
                        <TableHead className="whitespace-normal font-medium">
                          {row.feature}
                        </TableHead>
                        <TableCell className="whitespace-normal align-top text-muted-foreground">
                          {row.daily}
                        </TableCell>
                        <TableCell className="whitespace-normal align-top text-muted-foreground">
                          {row.intraday}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          <section
            aria-labelledby="market-replay-how-it-works"
            className="mb-16 md:mb-20"
          >
            <SectionHeading
              id="market-replay-how-it-works"
              title={page.howItWorksTitle}
              centered
            />
            <StepCards steps={page.steps} />
          </section>

          <section
            aria-labelledby="replay-vs-others"
            className="mb-16 md:mb-20"
          >
            <SectionHeading
              id="replay-vs-others"
              title={page.differencesTitle}
              description={page.differencesDescription}
              centered
            />
            <div className="grid gap-4 md:grid-cols-3">
              {page.differences.map((item) => (
                <Card key={item.name} className="h-full">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-muted-foreground">
                    {item.text}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-4 border-primary/20 bg-primary/5">
              <CardContent className="flex gap-3 p-5 text-sm leading-7 text-muted-foreground">
                <IconInfoCircle
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <p>{page.differencesDisclaimer}</p>
              </CardContent>
            </Card>
          </section>

          <section
            aria-labelledby="markets-timeframes"
            className="mb-16 md:mb-20"
          >
            <SectionHeading
              id="markets-timeframes"
              title={page.coverageTitle}
              centered
            />
            <div className="grid gap-4 md:grid-cols-2">
              <CoverageCard
                title={page.dailyCoverageTitle}
                items={page.dailyCoverageItems}
              />
              <CoverageCard
                title={page.intradayCoverageTitle}
                items={page.intradayCoverageItems}
              />
            </div>
            <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-7 text-muted-foreground">
              {page.coverageDisclaimer}
            </p>
          </section>

          <section aria-labelledby="not-simulated" className="mb-16 md:mb-20">
            <SectionHeading
              id="not-simulated"
              title={page.notSimulatedTitle}
              description={page.notSimulatedDescription}
              centered
            />
            <Card>
              <CardContent className="p-6">
                <ul
                  className="grid gap-3 sm:grid-cols-2"
                  aria-label={page.notSimulatedAria}
                >
                  {page.notSimulated.map((item) => (
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
                <p className="mt-5 text-center text-sm leading-7 text-muted-foreground">
                  {page.resultDisclaimer}
                </p>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="related-tools" className="mb-16 md:mb-20">
            <SectionHeading
              id="related-tools"
              title={page.relatedToolsTitle}
              centered
            />
            <RelatedTools tools={page.relatedTools} />
          </section>

          <section aria-labelledby="faq" className="mb-16 md:mb-20">
            <SectionHeading id="faq" title={page.faqTitle} centered />
            <FaqList faqs={page.faqs} />
          </section>

          <CallToAction
            title={page.ctaTitle}
            description={page.ctaDescription}
            actions={[
              { label: page.dailyAction, to: '/play' },
              {
                label: page.forexAction,
                to: '/day-trading-simulator?market=forex',
                variant: 'outline',
              },
              {
                label: page.cryptoAction,
                to: '/day-trading-simulator?market=crypto',
                variant: 'outline',
              },
            ]}
          />
        </div>
      </Container>
    </>
  );
}

function MarketList({
  items,
  ariaLabel,
}: {
  items: string[];
  ariaLabel: string;
}) {
  return (
    <ul className="space-y-2" aria-label={ariaLabel}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <IconCheck className="size-4 text-primary" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CoverageCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
          {items.map((item) => (
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
    </Card>
  );
}
