import { createFileRoute, Link } from '@tanstack/react-router';
import { IconBrandLinkedin, IconMailFilled } from '@tabler/icons-react';
import Container from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { websiteConfig } from '@/config/website';
import { getCanonicalLocale, getLocale } from '@/lib/locale';
import { getCanonicalUrl, getMailtoUrl } from '@/lib/urls';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ChartMini',
  url: getCanonicalUrl('/'),
  logo: getCanonicalUrl('/chartmini-logo.svg'),
  description:
    'Free trading simulator for practicing stock, forex, and crypto trading with historical chart replay.',
  foundingDate: '2025',
  sameAs: ['https://www.linkedin.com/in/ivenwg'],
  founder: {
    '@type': 'Person',
    name: 'Iven W.',
    jobTitle: 'Founder & Developer',
    url: getCanonicalUrl('/about'),
  },
};

export const Route = createFileRoute('/(pages)/about')({
  head: () => {
    const isEnglish = getCanonicalLocale(getLocale()) === 'en';
    const metadata = seo('/about', {
      title: isEnglish
        ? 'About Us – ChartMini'
        : `${m.about_title()} | ${websiteConfig.metadata?.name}`,
      description: m.about_description(),
    });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
        },
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const supportEmail = getMailtoUrl(websiteConfig.mail?.supportEmail);

  return (
    <Container className="py-16 px-4 md:py-20">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            About ChartMini
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Welcome to <strong className="text-foreground">ChartMini</strong>,
            the premier free trading simulator designed to help traders of all
            levels practice their skills without risking real capital.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="leading-7 text-muted-foreground">
            Trading is a skill that requires practice, discipline, and constant
            learning. However, the tuition fee for learning in the live market
            can be devastatingly high.{' '}
            <strong className="text-foreground">
              Our mission is to provide a risk-free environment where anyone can
              master the art of trading.
            </strong>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Why ChartMini?</h2>
          <p className="leading-7 text-muted-foreground">
            ChartMini was built to bridge the gap between theory and practice.
            We believe that looking at static charts isn&apos;t enough — you
            need to experience the emotional rollercoaster of making decisions
            in real-time.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <strong className="text-foreground">Risk-Free Practice:</strong>{' '}
              Simulate trades with historical data across Stocks, Crypto, and
              Forex.
            </li>
            <li>
              <strong className="text-foreground">Professional Tools:</strong>{' '}
              Powered by TradingView charts, giving you the industry-standard
              analysis experience.
            </li>
            <li>
              <strong className="text-foreground">Global Reach:</strong>{' '}
              Available in 38+ languages to support traders worldwide.
            </li>
            <li>
              <strong className="text-foreground">Always Free:</strong> We
              believe financial education should be accessible to everyone.
            </li>
          </ul>
        </section>

        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Meet the Founder</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Iven W. · Founder &amp; Developer
              </p>
            </div>
            <Badge variant="secondary">MBA</Badge>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p className="leading-7">
              MBA and active trader since 2007 with nearly two decades of
              hands-on experience in forex and equity markets. Built ChartMini
              from scratch — a lightweight trading simulator for focused,
              no-frills practice with real historical data.
            </p>
            <Button
              variant="outline"
              render={
                <a
                  href="https://www.linkedin.com/in/ivenwg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Iven W. on LinkedIn"
                >
                  <IconBrandLinkedin className="size-4" />
                  LinkedIn
                </a>
              }
            />
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How ChartMini Works</h2>
          <p className="leading-7 text-muted-foreground">
            ChartMini replays real historical market data bar-by-bar, simulating
            the experience of live trading without any financial risk.
          </p>
          <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
            <li>
              <strong className="text-foreground">Choose an asset</strong> —
              Select from 500+ stocks, forex pairs, and cryptocurrencies.
            </li>
            <li>
              <strong className="text-foreground">Replay the chart</strong> —
              Historical price data plays forward candle by candle, just like a
              live market.
            </li>
            <li>
              <strong className="text-foreground">Practice trades</strong> —
              Place simulated buy/sell orders and track your performance over
              time.
            </li>
          </ol>
          <p className="leading-7 text-muted-foreground">
            The platform is powered by{' '}
            <strong className="text-foreground">TradingView</strong> charting
            technology — the same professional-grade tools used by millions of
            traders worldwide. Historical market data covers major exchanges and
            timeframes, providing a realistic trading environment for practice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Data</h2>
          <p className="leading-7 text-muted-foreground">
            All chart data on ChartMini is sourced from established financial
            data providers and represents real historical market prices. We
            update our data regularly to ensure traders can practice with recent
            market conditions as well as historical scenarios.
          </p>
          <p className="leading-7 text-muted-foreground">
            ChartMini is an{' '}
            <strong className="text-foreground">educational tool</strong> — it
            does not provide brokerage services, execute real trades, or offer
            financial advice. The simulator is designed solely for learning and
            practice purposes.
          </p>
        </section>

        <div className="flex flex-wrap items-center gap-3 border-t pt-8 text-sm text-muted-foreground">
          <span>For questions or feedback, visit our</span>
          <Link
            to="/contact"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Contact page
          </Link>
          {supportEmail ? (
            <a
              href={supportEmail}
              className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
            >
              <IconMailFilled className="size-4" />
              Email support
            </a>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
