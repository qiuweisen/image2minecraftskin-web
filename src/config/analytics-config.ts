import { clientEnv } from '@/env/client';

export const analyticsConfig = {
  googleAnalyticsId: clientEnv.VITE_GOOGLE_ANALYTICS_ID ?? 'G-VWSG4RTPT0',
  umami: {
    script:
      clientEnv.VITE_UMAMI_SCRIPT ??
      'https://stats.arabic-calligraphy-generator.com/script.js',
    websiteId:
      clientEnv.VITE_UMAMI_WEBSITE_ID ?? 'c6d4fc71-2e18-460f-9c00-8d6d5efcccdb',
  },
} as const;
