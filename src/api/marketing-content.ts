import { createServerFn } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { locales, type Locale } from '@/locale/paraglide/runtime';

const marketingContentSchema = z.object({
  page: z.enum(['market-replay', 'forex', 'crypto', 'intraday']),
  locale: z
    .string()
    .min(2)
    .max(16)
    .regex(/^[A-Za-z0-9-]+$/),
});

type MarketingContentPage = z.infer<typeof marketingContentSchema>['page'];

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const loadMarketingContent = createServerFn({ method: 'GET' })
  .validator(marketingContentSchema)
  .handler(async ({ data }) => {
    if (!isLocale(data.locale)) {
      throw new Error(`Unsupported marketing content locale: ${data.locale}`);
    }

    const assetUrl = new URL(
      `/marketing-content/${data.locale}/${data.page}.json`,
      'https://chartmini.com'
    );
    const response = await env.ASSETS.fetch(assetUrl);
    if (!response.ok) {
      throw new Error(
        `Marketing content asset not found: ${data.locale}/${data.page}`
      );
    }

    const content: unknown = await response.json();
    if (
      !Array.isArray(content) ||
      content.some((item) => typeof item !== 'string')
    ) {
      throw new Error(
        `Marketing content asset is invalid: ${data.locale}/${data.page}`
      );
    }

    return content as string[];
  });

export type { MarketingContentPage };
