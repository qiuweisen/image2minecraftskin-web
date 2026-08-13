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
} from '@/components/marketing/simulator-landing-pages';
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

const quickPlan = [
  {
    step: '1',
    title: 'Pick one market',
    text: 'Forex or Crypto. One market keeps your focus on a single rhythm and spread behaviour.',
  },
  {
    step: '2',
    title: 'Define one setup',
    text: 'Choose one repeatable idea, such as a breakout or a pullback to support, instead of trading everything.',
  },
  {
    step: '3',
    title: 'Write an invalidation rule',
    text: 'Decide in advance what would prove the idea wrong before you enter.',
  },
  {
    step: '4',
    title: 'Reveal candles one step at a time',
    text: 'Advance the hidden historical chart gradually so each decision is made without knowing the next bar.',
  },
  {
    step: '5',
    title: 'Record trades and no-trade decisions',
    text: 'Log every simulated entry, exit, and the setups you deliberately skipped.',
  },
  {
    step: '6',
    title: 'Review rule adherence after the session',
    text: 'Score whether you followed the plan, not just whether the session ended in profit.',
  },
];

const focusCards = [
  {
    name: 'Trend recognition',
    observe:
      'Watch how higher highs and higher lows form as candles appear, and note when the sequence breaks.',
    rule: 'Example rule: only look for longs while price keeps printing higher lows on the visible chart.',
  },
  {
    name: 'Breakout and fakeout decisions',
    observe:
      'Mark a consolidation zone, then watch whether the break holds or is immediately rejected.',
    rule: 'Example rule: only enter a break if the breakout candle closes beyond the zone, not just wicks through it.',
  },
  {
    name: 'Range identification',
    observe:
      'Identify the upper and lower bounds early and note how price reacts each time it returns to an edge.',
    rule: 'Example rule: fade the range only after a clear rejection candle at the boundary, never mid-range.',
  },
  {
    name: 'Support and resistance',
    observe:
      'Draw levels from the visible history only, then track whether price respects, tests, or breaks them.',
    rule: 'Example rule: treat a level as broken only after a full-body close beyond it, not an intrabar spike.',
  },
  {
    name: 'Trade and no-trade discipline',
    observe:
      'Count how many setups you skipped that met your rules, and how many you took that did not.',
    rule: 'Example rule: maximum three simulated trades per session; stop trading once the limit is reached.',
  },
  {
    name: 'Pullback entry timing',
    observe:
      'Wait for price to retrace within an existing move, then watch whether structure resumes or the trend begins to fail.',
    rule: 'Example rule: enter only after the pullback holds a marked level and a new candle confirms movement with the trend.',
  },
];

const checklist = [
  'Choose one setup to practise',
  'Define an entry condition',
  'Define an invalidation condition',
  'Set a maximum number of simulated trades',
  'Decide what would make you skip a trade',
];

const workflow = [
  {
    title: 'Start from a hidden historical point',
    text: 'ChartMini picks a random historical starting point on 5-minute candles. Every candle after it stays hidden.',
  },
  {
    title: 'Advance the chart gradually',
    text: 'Reveal price action one active chart period at a time, reading structure as it unfolds rather than all at once.',
  },
  {
    title: 'Use simulated Buy and Sell controls',
    text: 'Record long and short decisions with the built-in simulated order controls as the chart develops.',
  },
  {
    title: 'Track position and P&L',
    text: 'Watch open position, equity, and realised and unrealised simulated P&L update as you trade.',
  },
  {
    title: 'Finish before viewing the full outcome',
    text: 'End the session while the future is still unknown, then review the completed chart and your recorded trades.',
  },
];

const reviewQuestions = [
  'Did I follow my entry rule?',
  'Did I respect the invalidation rule?',
  'Did I take trades outside the plan?',
  'Did I skip valid setups?',
  'Was each decision reasonable with only the information available at the time?',
];

const comparison = [
  {
    method: 'Historical intraday replay (ChartMini)',
    dataFlow:
      'Closed historical candles revealed step by step; future bars stay hidden',
    bestFor:
      'Practising real-time decisions under uncertainty with a predefined plan',
    limitation: 'No live order book, spreads, slippage or real fills',
  },
  {
    method: 'Live paper trading',
    dataFlow: 'Real-time streaming quotes with simulated orders and balances',
    bestFor: 'Learning a broker platform and live market rhythm',
    limitation: 'Bound to market hours; the same setup cannot be repeated',
  },
  {
    method: 'Finished-chart review',
    dataFlow: 'A completed chart that is fully visible from the start',
    bestFor: 'Studying structure and annotating setups after the fact',
    limitation:
      'No decision pressure; the outcome is already known (hindsight bias)',
  },
  {
    method: 'Automated backtesting',
    dataFlow: 'Coded rules executed across a large historical dataset',
    bestFor: 'Measuring a fully defined strategy across many trades',
    limitation:
      'Requires coding; results depend heavily on fill and cost assumptions',
  },
];

const limitations = [
  'No real order routing',
  'No real fills',
  'No Level 2 or DOM',
  'No tick data',
  'No precise spreads or slippage',
  'No broker latency',
];

const relatedTools = [
  {
    href: '/day-trading-simulator',
    name: 'Day Trading Simulator',
    text: 'The 5-minute intraday replay engine behind this practice page, with simulated trades and session review.',
  },
  {
    href: '/market-replay',
    name: 'Market Replay',
    text: 'Choose between daily and intraday historical replay across stocks, forex and crypto.',
  },
  {
    href: '/forex-trading-simulator',
    name: 'Forex Trading Simulator',
    text: 'Historical FX replay across 14 major and cross pairs with the forex market preselected.',
  },
  {
    href: '/crypto-trading-simulator',
    name: 'Crypto Trading Simulator',
    text: 'Historical crypto replay across 30 Binance Spot USDT pairs with the crypto market preselected.',
  },
  {
    href: '/blog/day-trading-practice-simulator-replay-session',
    name: 'Structured Replay Session Guide',
    text: 'A full tutorial on organising a complete day-trading practice session with replay.',
  },
  {
    href: '/blog/support-and-resistance-practice-draw-levels-candle-by-candle',
    name: 'Support and Resistance Practice Guide',
    text: 'Learn how to mark and test chart levels candle by candle without using future price information.',
  },
];

const faqs = [
  {
    q: 'What is intraday trading practice?',
    a: 'Intraday trading practice means rehearsing same-day trading decisions on a chart without risking real money. On ChartMini you open a hidden historical Forex or Crypto chart, reveal candles one step at a time, and record simulated trades as if you were trading live.',
  },
  {
    q: 'How can I practice intraday trading?',
    a: 'Pick one market and one setup, write an entry and an invalidation rule, then start a hidden historical session on ChartMini. Reveal candles gradually, record simulated Buy and Sell decisions, and review your rule adherence after the session.',
  },
  {
    q: 'Can I practice Forex and Crypto?',
    a: 'Yes. ChartMini supports 14 major and cross Forex pairs and 30 Binance Spot USDT crypto pairs on historical 5-minute candles. Choose the market before you start, or switch inside the Day Trading Simulator.',
  },
  {
    q: 'Is intraday practice the same as paper trading?',
    a: 'Not exactly. Paper trading usually simulates live orders and balances on streaming data. ChartMini replays closed historical candles with hidden future bars, so you practise decision-making under uncertainty rather than live order execution.',
  },
  {
    q: 'Does ChartMini use real money?',
    a: 'No. ChartMini is free, runs in the browser, and uses only simulated trades. There is no real money, no real orders, and no signup.',
  },
  {
    q: 'Does ChartMini simulate real fills and slippage?',
    a: 'No. ChartMini does not model real order routing, fills, spreads, slippage, Level 2 depth, or broker latency. Results are practice records, not evidence of real trading performance.',
  },
  {
    q: 'How should I review an intraday practice session?',
    a: 'Focus on process, not only simulated profit or loss. Ask whether you followed your entry rule, respected your invalidation rule, avoided unplanned trades, and made each decision based only on the information visible at the time.',
  },
];

const pageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://chartmini.com/intraday-trading-practice#webpage',
      url: 'https://chartmini.com/intraday-trading-practice',
      name: 'Intraday Trading Practice – Forex & Crypto Replay | ChartMini',
      description:
        'Practice intraday trading on hidden historical Forex and Crypto charts. Reveal candles step by step, make simulated trades and review each session free.',
      inLanguage: 'en',
      isPartOf: { '@id': 'https://chartmini.com/#website' },
      about: { '@id': 'https://chartmini.com/#software' },
      dateModified: '2026-07-20',
      breadcrumb: {
        '@id': 'https://chartmini.com/intraday-trading-practice#breadcrumb',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://chartmini.com/intraday-trading-practice#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://chartmini.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Intraday Trading Practice',
          item: 'https://chartmini.com/intraday-trading-practice',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://chartmini.com/intraday-trading-practice#faq',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ],
};

type Market = 'forex' | 'crypto';

const markets: Array<{ id: Market; label: string; hint: string }> = [
  { id: 'forex', label: 'Forex', hint: '14 major and cross currency pairs' },
  { id: 'crypto', label: 'Crypto', hint: '30 Binance Spot USDT pairs' },
];

function PracticeMarketSelector() {
  const [market, setMarket] = useState<Market>('forex');
  const selectedLabel = market === 'forex' ? 'Forex' : 'Crypto';

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Choose a market for your practice session
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
        aria-label="Practice market"
      >
        {markets.map((item) => (
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
        Start {selectedLabel} Practice
        <IconArrowUpRight className="size-4" />
      </Link>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Opens the Day Trading Simulator with the {selectedLabel} tab
        preselected. No signup, no real money.
      </p>
    </div>
  );
}

export function IntradayTradingPracticePage() {
  return (
    <>
      <StructuredData schema={pageSchema} />
      <Container className="px-4 py-8 md:py-12 lg:py-14">
        <PageBreadcrumb label="Intraday Trading Practice" />

        <section className="mb-16 grid items-center gap-8 md:mb-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <HeaderSection
              subtitle="Intraday Trading Practice"
              subtitleAs="h1"
              description="Practice intraday decision-making on hidden historical charts. Choose Forex or Crypto, reveal price action step by step, record simulated trades, and review the completed session — free, in the browser, with no signup and no real money."
              className="items-start text-left"
              subtitleClassName="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
              descriptionClassName="text-pretty text-base leading-7 sm:text-lg"
            >
              <Badge
                variant="outline"
                className="order-first gap-2 px-3 py-1.5"
              >
                <IconTarget className="size-3.5" aria-hidden="true" />
                Structured historical chart practice
              </Badge>
              <ActionLink to="/day-trading-simulator">
                Start Intraday Practice
              </ActionLink>
            </HeaderSection>
          </div>
          <Card>
            <CardContent className="p-6 sm:p-8">
              <PracticeMarketSelector />
            </CardContent>
          </Card>
        </section>

        <div>
          <section aria-labelledby="quick-plan" className="mb-16 md:mb-20">
            <SectionHeading
              id="quick-plan"
              title="Intraday practice quick plan"
              description="A single session follows one repeatable loop. Run the same six steps every time so your results reflect your decisions, not luck of the draw."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickPlan.map((item) => (
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
              title="Choose a practice focus"
              description="Pick one focus per session. ChartMini replays the hidden historical chart and records your simulated trades — recognising the pattern and applying your rule is your job."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {focusCards.map((card) => (
                <Card key={card.name} className="flex h-full flex-col">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{card.name}</h3>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4 text-sm leading-7 text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        Observe:{' '}
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
                    title="Before-session checklist"
                    description="Five decisions made before the first candle appears keep the session honest. Write them down and keep them visible while you trade."
                  />
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  <ul
                    className="space-y-3"
                    aria-label="Before-session checklist"
                  >
                    {checklist.map((item) => (
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
              title="During the session"
              description="This is how a session runs inside the Day Trading Simulator, built on historical 5-minute Forex and Crypto candles."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workflow.map((item, index) => (
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
                  title="After-session review"
                  description="Answer these after every session, while the decisions are still fresh."
                />
              </CardHeader>
              <CardContent className="space-y-5">
                <ul
                  className="grid gap-3 sm:grid-cols-2"
                  aria-label="After-session review questions"
                >
                  {reviewQuestions.map((question) => (
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
                  Review process quality, not only simulated profit or loss. A
                  losing session where you followed your rules is better
                  practice than a winning session where you broke them.
                </p>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="compare-methods" className="mb-16 md:mb-20">
            <SectionHeading
              id="compare-methods"
              title="Intraday practice vs other methods"
              description="ChartMini is a historical chart replay and simulated-decision tool. Here is how that method compares with other common ways to practise."
            />
            <Card>
              <CardContent className="p-0 sm:p-2">
                <Table>
                  <TableCaption>
                    Comparison of intraday practice methods
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Data flow</TableHead>
                      <TableHead>Best used for</TableHead>
                      <TableHead>Main limitation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparison.map((row) => (
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
              title="What ChartMini does not simulate"
              description="Replay is designed for chart-reading and decision practice. To keep that boundary honest, ChartMini does not model live execution mechanics."
            />
            <Card>
              <CardContent className="p-6">
                <ul
                  className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                  aria-label="What ChartMini does not simulate"
                >
                  {limitations.map((item) => (
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
                  Simulated results are educational practice records. They are
                  not investment advice and not evidence of future or real
                  trading performance.
                </p>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="related-tools" className="mb-16 md:mb-20">
            <SectionHeading
              id="related-tools"
              title="Related tools and guides"
            />
            <RelatedTools tools={relatedTools} />
          </section>

          <section aria-labelledby="faq" className="mb-16 md:mb-20">
            <SectionHeading id="faq" title="Frequently asked questions" />
            <FaqList faqs={faqs} />
          </section>

          <CallToAction
            title="Start a structured intraday practice session"
            description="Open a random historical Forex or Crypto chart with the future hidden, trade your plan with simulated orders, and review how you actually decided. Free, browser-based, no signup."
            actions={[
              {
                label: 'Start Intraday Practice',
                to: '/day-trading-simulator',
              },
            ]}
          />
        </div>
      </Container>
    </>
  );
}
