import type { ReactNode } from 'react';
import { IconArrowUpRight } from '@tabler/icons-react';
import { m } from '@/locale/paraglide/messages';
import Container from '@/components/layout/container';
import { HeaderSection } from '@/components/shared/header-section';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ResourceItem = {
  name: string;
  url: string;
  description: ReactNode;
  image: string;
  alt: string;
  rel?: string;
};

function getResources(): Array<{ category: string; items: ResourceItem[] }> {
  return [
    {
      category: m.resources_category_charting(),
      items: [
        {
          name: 'TradingView',
          url: 'https://www.tradingview.com/?aff_id=158087',
          description: m.resources_tradingview_description(),
          image: '/images/resources/tradingview.png',
          alt: 'TradingView',
        },
      ],
    },
    {
      category: m.resources_category_platforms(),
      items: [
        {
          name: 'NinjaTrader',
          url: 'https://ninjatraderdomesticvendor.sjv.io/c/6570566/3069488/37581',
          rel: 'sponsored nofollow noopener noreferrer',
          description: m.resources_ninjatrader_description(),
          image: '/images/resources/ninjatrader.png',
          alt: 'NinjaTrader',
        },
        {
          name: 'Charles Schwab',
          url: 'https://www.schwab.com/public/schwab/nn/refer-prospect.html?refrid=REFERGGPNW8RU',
          description: (
            <>
              {m.resources_schwab_description_before_code()}
              <span className="font-semibold text-destructive">
                REFERGGPNW8RU
              </span>{' '}
              {m.resources_schwab_description_after_code()}
            </>
          ),
          image: '/images/resources/schwab.png',
          alt: 'Charles Schwab',
        },
        {
          name: 'Interactive Brokers',
          url: 'https://www.interactivebrokers.com/referral/yufeng964',
          description: m.resources_ibkr_description(),
          image: '/images/resources/ibkr.png',
          alt: 'Interactive Brokers',
        },
      ],
    },
    {
      category: m.resources_category_crypto(),
      items: [
        {
          name: 'OKX',
          url: 'https://utob.top/okx',
          description: m.resources_okx_description(),
          image: '/images/resources/okx.png',
          alt: 'OKX',
        },
        {
          name: 'Binance',
          url: 'https://utob.top/bian',
          description: m.resources_binance_description(),
          image: '/images/resources/binance.png',
          alt: 'Binance',
        },
      ],
    },
  ];
}

function ResourceCard({ item }: { item: ResourceItem }) {
  return (
    <Card className="group flex h-full flex-col transition-colors hover:border-primary/40">
      <CardHeader className="gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-14 items-center justify-center border border-border bg-muted/40 p-2">
            <img
              src={item.image}
              alt={item.alt}
              className="size-full object-contain"
              loading="lazy"
            />
          </div>
          <a
            href={item.url}
            target="_blank"
            rel={item.rel ?? 'noopener noreferrer'}
            className={cn(
              buttonVariants({ size: 'sm', variant: 'outline' }),
              'gap-1.5'
            )}
          >
            {m.resources_visit()}
            <IconArrowUpRight className="size-3.5" />
          </a>
        </div>
        <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
          {item.name}
        </h3>
      </CardHeader>
      <CardContent className="flex-1 text-sm leading-7 text-muted-foreground">
        {item.description}
      </CardContent>
    </Card>
  );
}

export function ResourcesPage() {
  const resources = getResources();

  return (
    <Container className="px-4 py-10 md:py-16">
      <div>
        <HeaderSection
          subtitle={m.resources_title()}
          subtitleAs="h1"
          description={m.resources_description()}
          className="mx-auto mb-14 max-w-3xl"
          subtitleClassName="text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
          descriptionClassName="text-pretty text-base leading-7 sm:text-lg"
        />

        <div className="space-y-14">
          {resources.map((section) => (
            <section
              key={section.category}
              aria-labelledby={section.category
                .replaceAll(' ', '-')
                .toLowerCase()}
            >
              <div className="mb-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 bg-primary"
                />
                <h2
                  id={section.category.replaceAll(' ', '-').toLowerCase()}
                  className="text-2xl font-semibold tracking-tight"
                >
                  {section.category}
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <ResourceCard key={item.name} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}
