import { Link } from '@tanstack/react-router';
import type { Icon } from '@tabler/icons-react';
import {
  IconArrowUpRight,
  IconArrowsExchange,
  IconCheck,
  IconCoinBitcoin,
  IconHistory,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
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
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
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
import { cn } from '@/lib/utils';
import { m } from '@/locale/paraglide/messages';

type Step = {
  number: string;
  title: string;
  text: string;
};

type Faq = {
  q: string;
  a: string;
};

type RelatedTool = {
  href: string;
  name: string;
  text: string;
};

type Schema = Record<string, unknown>;

const marketReplaySteps: Step[] = [
  {
    number: '1',
    title: 'Choose Daily or Intraday',
    text: 'Pick Daily Replay for historical daily candles across stocks, forex and crypto, or Intraday Replay for 5-minute forex and crypto charts.',
  },
  {
    number: '2',
    title: 'Start from a hidden point in history',
    text: 'Each session begins at a random historical starting point. Every later candle stays hidden, so you decide without knowing what happened next.',
  },
  {
    number: '3',
    title: 'Advance and review',
    text: 'Reveal the chart one candle at a time, record simulated decisions, then review the session once you finish.',
  },
];

const marketReplayComparison = [
  {
    feature: 'Underlying timeframe',
    daily: 'Daily historical candles',
    intraday: '5-minute historical candles',
  },
  {
    feature: 'Supported markets',
    daily: 'Stocks, Forex, Crypto',
    intraday: 'Forex, Crypto',
  },
  {
    feature: 'Best suited for',
    daily: 'Daily close and swing-style chart reading',
    intraday: 'Intraday price action and session practice',
  },
  {
    feature: 'Hides future candles',
    daily: 'Yes',
    intraday: 'Yes',
  },
  {
    feature: 'How you advance',
    daily: 'One daily candle at a time',
    intraday: 'One active chart period at a time',
  },
  {
    feature: 'Starting entry',
    daily: 'Daily Replay tool',
    intraday: 'Day Trading Simulator (Forex or Crypto)',
  },
];

const marketReplayDifferences = [
  {
    name: 'Market replay',
    text: 'Plays back finished historical price action in chronological order so you can practice reading the chart and making directional decisions.',
  },
  {
    name: 'Paper trading',
    text: 'Usually simulates live orders, an account balance, open positions and running P&L against current or simulated market conditions.',
  },
  {
    name: 'Automated backtesting',
    text: 'Runs a defined rule or strategy across a large historical dataset automatically and reports aggregated statistics.',
  },
];

const marketReplayNotSimulated = [
  'Real-time order routing',
  'Real fill matching',
  'Level 2 or DOM depth',
  'Order queue position',
  'Precise spread',
  'Precise slippage',
  'Broker latency',
  'Real commissions and fees',
  'Profit guarantees',
  'Automated strategy execution',
];

const marketReplayRelatedTools: RelatedTool[] = [
  {
    href: '/day-trading-simulator',
    name: 'Day Trading Simulator',
    text: 'Intraday 5-minute chart replay for forex and crypto with simulated trades and session review.',
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
    href: '/play',
    name: 'Daily Replay',
    text: 'Lightweight daily candle replay for stocks, forex and crypto with no signup.',
  },
  {
    href: '/intraday-trading-practice',
    name: 'Intraday Trading Practice',
    text: 'A structured practice plan, focus drills and session review for hidden intraday chart replay.',
  },
];

const marketReplayFaqs: Faq[] = [
  {
    q: 'What is a market replay simulator?',
    a: 'A market replay simulator plays back historical price action so you can watch a chart unfold one candle at a time and make decisions without seeing what happened next. ChartMini replays historical stocks, forex and crypto charts in the browser.',
  },
  {
    q: 'Is ChartMini market replay free?',
    a: 'Yes. ChartMini is free to use in the browser with no signup, no download and no real money. You open a historical session and start replaying immediately.',
  },
  {
    q: 'What is the difference between Daily and Intraday replay?',
    a: 'Daily Replay uses daily historical candles for stocks, forex and crypto and runs in the Daily Replay tool. Intraday Replay uses underlying 5-minute candles for forex and crypto and runs in the Day Trading Simulator.',
  },
  {
    q: 'Does ChartMini support stocks, forex and crypto?',
    a: 'Daily Replay supports stocks, forex and crypto. Intraday Replay currently supports forex and crypto. You choose the market inside each tool after starting a session.',
  },
  {
    q: 'Is market replay the same as paper trading?',
    a: 'No. Market replay plays back finished historical data so you can practice reading price action. Paper trading usually simulates live orders, balances, positions and P&L. ChartMini focuses on historical chart replay and simulated decisions, not a full paper trading account.',
  },
  {
    q: 'Does ChartMini simulate real fills, spreads and slippage?',
    a: 'No. ChartMini does not model real order routing, fills, spreads, slippage, Level 2 depth, commissions or broker latency. Results are educational practice records, not investment advice or evidence of future performance.',
  },
];

const marketReplaySchema: Schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://chartmini.com/market-replay#webpage',
      url: 'https://chartmini.com/market-replay',
      name: 'Free Market Replay Simulator – Daily & Intraday Charts | ChartMini',
      description:
        "Replay historical charts free with ChartMini's market replay simulator. Practice daily or intraday stocks, forex and crypto with no signup or real money.",
      inLanguage: 'en',
      isPartOf: { '@id': 'https://chartmini.com/#website' },
      about: { '@id': 'https://chartmini.com/#software' },
      dateModified: '2026-07-19',
      breadcrumb: { '@id': 'https://chartmini.com/market-replay#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://chartmini.com/market-replay#breadcrumb',
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
          name: 'Market Replay',
          item: 'https://chartmini.com/market-replay',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://chartmini.com/market-replay#faq',
      mainEntity: marketReplayFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ],
};

type PairSimulatorPage = {
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
};

const forexPage: PairSimulatorPage = {
  pageUrl: 'https://chartmini.com/forex-trading-simulator',
  title: 'Forex Trading Simulator – Historical FX Replay | ChartMini',
  description:
    'Practice forex trading on historical 5-minute charts with a free browser-based simulator. Replay major FX pairs without signup or real money.',
  eyebrow: 'Historical forex chart replay',
  heading: 'Free Forex Trading Simulator',
  heroDescription:
    'Practice forex trading on historical 5-minute charts. Reveal price action one chart period at a time, without signup or real money.',
  toolUrl: '/day-trading-simulator?market=forex',
  actionLabel: 'Start Forex Replay',
  icon: IconArrowsExchange,
  facts: [
    { value: '14', label: 'major and cross pairs' },
    { value: '5 min', label: 'historical source candles' },
    { value: '5m–12M', label: 'TradingView chart periods' },
    { value: 'Random', label: 'pair and starting point' },
  ],
  introTitle: 'Historical forex replay without future candles',
  introParagraphs: [
    'ChartMini is a free browser-based forex trading simulator for lightweight chart replay practice. Each session hides future candles, chooses a market at random and lets you make directional decisions before revealing what happened next.',
    'The simulator supports TradingView chart periods from 5 minutes through 12 months. Larger periods are calculated from the underlying 5-minute candles, and Next Bar follows the period currently selected on the chart.',
  ],
  pairsTitle: 'Available forex pairs',
  pairsDescription:
    'One of these 14 major or cross pairs is selected randomly when a Forex session starts.',
  pairs: [
    'EUR/USD',
    'USD/JPY',
    'GBP/USD',
    'AUD/USD',
    'USD/CAD',
    'USD/CHF',
    'NZD/USD',
    'EUR/JPY',
    'GBP/JPY',
    'EUR/GBP',
    'AUD/JPY',
    'EUR/AUD',
    'EUR/CHF',
    'GBP/CHF',
  ],
  stepsTitle: 'How the forex simulator works',
  steps: [
    {
      number: '1',
      title: 'Start a random FX session',
      text: 'The simulator selects a supported currency pair and a historical starting point while keeping later candles hidden.',
    },
    {
      number: '2',
      title: 'Read the chart and decide',
      text: 'Change the chart period, use TradingView drawings and indicators, then record a simulated long or short position.',
    },
    {
      number: '3',
      title: 'Reveal and review',
      text: 'Advance one active chart period at a time, then review the session, trades, equity changes and simulated P&L.',
    },
  ],
  practiceItems: [
    'Reading historical price action without seeing future candles',
    'Simulated long and short decisions with quantity and P&L',
    'TradingView chart periods, drawings and supported indicators',
    'Reviewing trades and equity changes after a session',
  ],
  limitsTitle: 'Important data limits',
  limitsLead: 'The current test dataset contains ',
  limitsLink: {
    href: 'https://www.dukascopy.com/trading-tools/api/documentation/quotes',
    label: 'Dukascopy historical price data',
  },
  limitsLeadAfter:
    ' as indicative BID candles from July 17, 2025 through July 16, 2026 UTC. It has no usable volume and does not model the ASK side or spread.',
  limitsBody:
    'ChartMini does not reproduce broker routing, order-book depth, slippage, commission, latency or real fills. Results are educational practice records, not investment advice or evidence of future performance.',
  ctaDescription:
    'Open a random historical Forex session with future price action hidden and the Forex market tab already selected.',
  ctaActionLabel: 'Open the Forex Simulator',
  schema: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://chartmini.com/forex-trading-simulator#webpage',
        url: 'https://chartmini.com/forex-trading-simulator',
        name: 'Forex Trading Simulator – Historical FX Replay | ChartMini',
        description:
          'Practice forex trading on historical 5-minute charts with a free browser-based simulator. Replay major FX pairs without signup or real money.',
        inLanguage: 'en',
        isPartOf: { '@id': 'https://chartmini.com/#website' },
        about: { '@id': 'https://chartmini.com/#software' },
        dateModified: '2026-07-17',
        breadcrumb: {
          '@id': 'https://chartmini.com/forex-trading-simulator#breadcrumb',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://chartmini.com/forex-trading-simulator#breadcrumb',
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
            name: 'Forex Trading Simulator',
            item: 'https://chartmini.com/forex-trading-simulator',
          },
        ],
      },
    ],
  },
};

const cryptoPage: PairSimulatorPage = {
  pageUrl: 'https://chartmini.com/crypto-trading-simulator',
  title: 'Crypto Trading Simulator – Historical Replay | ChartMini',
  description:
    'Practice crypto trading on historical 5-minute charts with a free browser simulator. Replay 30 Binance Spot pairs without signup or real money.',
  eyebrow: 'Historical crypto chart replay',
  heading: 'Free Crypto Trading Simulator',
  heroDescription:
    'Practice crypto trading on historical 5-minute charts. Reveal price action one chart period at a time, without signup or real money.',
  toolUrl: '/day-trading-simulator?market=crypto',
  actionLabel: 'Start Crypto Replay',
  icon: IconCoinBitcoin,
  facts: [
    { value: '30', label: 'Binance Spot USDT pairs' },
    { value: '2.97M', label: 'historical 5-minute candles' },
    { value: '5m–12M', label: 'TradingView chart periods' },
    { value: 'Random', label: 'pair and starting point' },
  ],
  introTitle: 'Crypto replay without future candles',
  introParagraphs: [
    'ChartMini is a free browser-based crypto trading simulator for historical chart-reading and directional practice. Each session uses closed candles, hides future price action, and randomly selects both the pair and starting point.',
    'The TradingView chart supports periods from 5 minutes through 12 months. Larger periods are calculated from the source 5-minute candles, and Next Bar follows the period currently selected on the chart.',
  ],
  pairsTitle: 'Available crypto pairs',
  pairsDescription:
    'The current release contains 30 eligible Binance Spot USDT pairs selected from a market-cap-ranked pool. One pair is chosen randomly for each session.',
  pairs: [
    'BTC/USDT',
    'ETH/USDT',
    'BNB/USDT',
    'XRP/USDT',
    'SOL/USDT',
    'TRX/USDT',
    'DOGE/USDT',
    'ZEC/USDT',
    'XLM/USDT',
    'LINK/USDT',
    'ADA/USDT',
    'BCH/USDT',
    'GRAM/USDT',
    'LTC/USDT',
    'SUI/USDT',
    'HBAR/USDT',
    'AVAX/USDT',
    'NEAR/USDT',
    'SHIB/USDT',
    'UNI/USDT',
    'TAO/USDT',
    'WLFI/USDT',
    'ONDO/USDT',
    'DEXE/USDT',
    'ASTER/USDT',
    'DOT/USDT',
    'SKY/USDT',
    'AAVE/USDT',
    'WLD/USDT',
    'MORPHO/USDT',
  ],
  stepsTitle: 'How the crypto simulator works',
  steps: [
    {
      number: '1',
      title: 'Start a random crypto session',
      text: 'The simulator selects a supported USDT pair and a historical starting point while keeping every later candle hidden.',
    },
    {
      number: '2',
      title: 'Read the chart and decide',
      text: 'Change the chart period, use TradingView drawings and indicators, then record a simulated long or short position.',
    },
    {
      number: '3',
      title: 'Advance and review',
      text: 'Reveal one active chart period at a time, then review the session, trades, equity changes and simulated P&L.',
    },
  ],
  practiceItems: [
    'Reading historical crypto price action without seeing future candles',
    'Simulated long and short decisions with quantity and P&L',
    'TradingView chart periods, drawings and supported indicators',
    'Reviewing trades and equity changes after a session',
  ],
  limitsTitle: 'Data coverage and limits',
  limitsLead:
    'The verified release contains 2,975,557 closed five-minute candles from ',
  limitsLink: {
    href: 'https://developers.binance.com/en/docs/catalog/core-trading-spot-trading/api/rest-api/market',
    label: 'Binance Spot market data',
  },
  limitsLeadAfter:
    ' across a rolling window from July 17, 2025 to July 17, 2026 UTC. Twenty-five pairs cover the full window; five recently listed pairs have shorter histories.',
  limitsBody:
    'The source feed is spot data. Simulated shorts are directional practice only; ChartMini does not reproduce borrowing, leverage, futures, liquidation, funding, order-book depth, slippage, fees, latency or real fills. Results are educational practice records, not investment advice or evidence of future performance.',
  ctaDescription:
    'Open a random historical session with future price action hidden and the Crypto market tab already selected.',
  ctaActionLabel: 'Open the Crypto Simulator',
  schema: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://chartmini.com/crypto-trading-simulator#webpage',
        url: 'https://chartmini.com/crypto-trading-simulator',
        name: 'Crypto Trading Simulator – Historical Replay | ChartMini',
        description:
          'Practice crypto trading on historical 5-minute charts with a free browser simulator. Replay 30 Binance Spot pairs without signup or real money.',
        inLanguage: 'en',
        isPartOf: { '@id': 'https://chartmini.com/#website' },
        about: { '@id': 'https://chartmini.com/#software' },
        dateModified: '2026-07-18',
        breadcrumb: {
          '@id': 'https://chartmini.com/crypto-trading-simulator#breadcrumb',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://chartmini.com/crypto-trading-simulator#breadcrumb',
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
            name: 'Crypto Trading Simulator',
            item: 'https://chartmini.com/crypto-trading-simulator',
          },
        ],
      },
    ],
  },
};

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

function PageHero({
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

function StepCards({ steps }: { steps: Step[] }) {
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

function PairSimulatorPage({ page }: { page: PairSimulatorPage }) {
  return (
    <>
      <StructuredData schema={page.schema} />
      <Container className="px-4 py-8 md:py-12 lg:py-14">
        <PageBreadcrumb label={page.heading.replace('Free ', '')} />
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
                      What you can practice
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
            title="Practice the chart before the next candle"
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

export function ForexTradingSimulatorPage() {
  return <PairSimulatorPage page={forexPage} />;
}

export function CryptoTradingSimulatorPage() {
  return <PairSimulatorPage page={cryptoPage} />;
}

export function MarketReplayPage() {
  return (
    <>
      <StructuredData schema={marketReplaySchema} />
      <Container className="px-4 py-8 md:py-12 lg:py-14">
        <PageBreadcrumb label="Market Replay" />
        <PageHero
          eyebrow="Historical chart replay across markets"
          heading="Free Market Replay Simulator"
          description="Replay historical charts one candle at a time. Choose a daily or intraday session, keep future candles hidden, and practice reading price action across stocks, forex and crypto — free and with no signup."
          icon={IconHistory}
        />

        <div>
          <section aria-labelledby="replay-selector" className="mb-16 md:mb-20">
            <h2 id="replay-selector" className="sr-only">
              Choose your replay mode
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="flex h-full flex-col">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    Daily Replay
                  </Badge>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Daily historical candles
                  </h3>
                </CardHeader>
                <CardContent className="flex-1 space-y-5 text-sm leading-7 text-muted-foreground">
                  <p>
                    Replay one daily candle at a time across stocks, forex and
                    crypto. Best for daily-close and swing-style chart reading.
                    The market is chosen inside the tool after you start.
                  </p>
                  <MarketList items={['Stocks', 'Forex', 'Crypto']} />
                </CardContent>
                <CardFooter>
                  <ActionLink to="/play">Start Daily Replay</ActionLink>
                </CardFooter>
              </Card>

              <Card className="flex h-full flex-col">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    Intraday Replay
                  </Badge>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    5-minute intraday charts
                  </h3>
                </CardHeader>
                <CardContent className="flex-1 space-y-5 text-sm leading-7 text-muted-foreground">
                  <p>
                    Replay intraday price action built on 5-minute historical
                    candles, with chart periods from 5 minutes through 12
                    months. Choose a market to start a session with that tab
                    preselected.
                  </p>
                  <MarketList items={['Forex', 'Crypto']} />
                </CardContent>
                <CardFooter className="flex flex-wrap gap-3">
                  <ActionLink to="/day-trading-simulator?market=forex">
                    Start Forex Replay
                  </ActionLink>
                  <ActionLink
                    to="/day-trading-simulator?market=crypto"
                    variant="outline"
                  >
                    Start Crypto Replay
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
              title="Daily Replay vs Intraday Replay"
              description="Both modes hide future candles and advance one step at a time. They differ in the underlying timeframe, the markets available and the kind of practice they suit best."
              centered
            />
            <Card>
              <CardContent className="p-0 sm:p-2">
                <Table>
                  <TableCaption>
                    Comparison of Daily Replay and Intraday Replay
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead className="text-primary">
                        Daily Replay
                      </TableHead>
                      <TableHead className="text-primary">
                        Intraday Replay
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketReplayComparison.map((row) => (
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
              title="How market replay works"
              centered
            />
            <StepCards steps={marketReplaySteps} />
          </section>

          <section
            aria-labelledby="replay-vs-others"
            className="mb-16 md:mb-20"
          >
            <SectionHeading
              id="replay-vs-others"
              title="Market replay, paper trading and backtesting"
              description="These terms overlap, but they describe different practice methods. Knowing the difference helps you pick the right one."
              centered
            />
            <div className="grid gap-4 md:grid-cols-3">
              {marketReplayDifferences.map((item) => (
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
                <p>
                  ChartMini is a historical chart replay and simulated-decision
                  tool. It is not a full broker simulator and not an automated
                  strategy backtesting platform.
                </p>
              </CardContent>
            </Card>
          </section>

          <section
            aria-labelledby="markets-timeframes"
            className="mb-16 md:mb-20"
          >
            <SectionHeading
              id="markets-timeframes"
              title="Supported markets and timeframes"
              centered
            />
            <div className="grid gap-4 md:grid-cols-2">
              <CoverageCard
                title="Daily Replay"
                items={[
                  'Markets: Stocks, Forex and Crypto',
                  'Underlying data: daily historical candles',
                  'Advances one daily candle at a time',
                  'Runs in the Daily Replay tool',
                ]}
              />
              <CoverageCard
                title="Intraday Replay"
                items={[
                  'Markets: Forex and Crypto',
                  'Underlying data: 5-minute historical candles',
                  'Chart periods from 5 minutes through 12 months',
                  'Runs in the Day Trading Simulator',
                ]}
              />
            </div>
            <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-7 text-muted-foreground">
              ChartMini replays closed historical candles. It does not provide
              tick data, 1-minute data, Level 2 or order-book depth, or
              real-time streaming prices.
            </p>
          </section>

          <section aria-labelledby="not-simulated" className="mb-16 md:mb-20">
            <SectionHeading
              id="not-simulated"
              title="What ChartMini does not simulate"
              description="Market replay is designed for chart-reading and decision practice. To keep that boundary clear, ChartMini does not model live execution mechanics."
              centered
            />
            <Card>
              <CardContent className="p-6">
                <ul
                  className="grid gap-3 sm:grid-cols-2"
                  aria-label="What ChartMini does not simulate"
                >
                  {marketReplayNotSimulated.map((item) => (
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
                  Results are educational practice records, not investment
                  advice or evidence of future performance.
                </p>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="related-tools" className="mb-16 md:mb-20">
            <SectionHeading id="related-tools" title="Related tools" centered />
            <RelatedTools tools={marketReplayRelatedTools} />
          </section>

          <section aria-labelledby="faq" className="mb-16 md:mb-20">
            <SectionHeading
              id="faq"
              title="Frequently asked questions"
              centered
            />
            <FaqList faqs={marketReplayFaqs} />
          </section>

          <CallToAction
            title="Start replaying the market"
            description="Pick a daily or intraday session and open a random historical chart with future candles hidden. Free, browser-based and no signup required."
            actions={[
              { label: 'Start Daily Replay', to: '/play' },
              {
                label: 'Start Forex Replay',
                to: '/day-trading-simulator?market=forex',
                variant: 'outline',
              },
              {
                label: 'Start Crypto Replay',
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

function MarketList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2" aria-label="Supported markets">
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
