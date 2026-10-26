import { getMessageList } from '@/lib/locale';
import { m } from '@/locale/paraglide/messages';
import { clientEnv } from '@/env/client';
import type { WebsiteConfig } from '../types';
import {
  DEFAULT_ALLOWED_TYPES,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_USER_FILES_FOLDER,
} from '@/storage/constants';

// Payment provider controlled by env var: 'stripe' | 'creem' | '' (empty means disabled)
const paymentProvider = clientEnv.VITE_PAYMENT_PROVIDER;
const isPaymentEnabled = paymentProvider !== '';
const isCreemPayment = paymentProvider === 'creem';
const isStripePayment = paymentProvider === 'stripe';
const aiSkinPriceIds = {
  ai_skin_15: clientEnv.VITE_STRIPE_PRICE_AI_SKIN_15 ?? '',
  ai_skin_50: clientEnv.VITE_STRIPE_PRICE_AI_SKIN_50 ?? '',
};
// Resolve price/product IDs based on the active payment provider
const priceIds = isPaymentEnabled
  ? {
      proMonthly: isCreemPayment
        ? (clientEnv.VITE_CREEM_PRODUCT_PRO_MONTHLY ?? '')
        : (clientEnv.VITE_STRIPE_PRICE_PRO_MONTHLY ?? ''),
      proYearly: isCreemPayment
        ? (clientEnv.VITE_CREEM_PRODUCT_PRO_YEARLY ?? '')
        : (clientEnv.VITE_STRIPE_PRICE_PRO_YEARLY ?? ''),
      lifetime: isCreemPayment
        ? (clientEnv.VITE_CREEM_PRODUCT_LIFETIME ?? '')
        : (clientEnv.VITE_STRIPE_PRICE_LIFETIME ?? ''),
    }
  : { proMonthly: '', proYearly: '', lifetime: '' };

/**
 * Website config
 */
export const websiteConfig: WebsiteConfig = {
  ui: {
    locale: {
      enableSwitch: true,
    },
    mode: {
      defaultMode: 'dark',
      enableSwitch: false,
    },
  },
  metadata: {
    get name() {
      return m.site_name();
    },
    get title() {
      return m.site_title();
    },
    get description() {
      return m.site_description();
    },
    images: {
      ogImage: '/og-image2minecraftskin.png',
      logoLight: '/brand/logo-mark.svg',
      logoDark: '/brand/logo-mark.svg',
    },
  },
  footer: {
    get tagline() {
      return m.skin_footer_tagline();
    },
  },
  social: {
    github: 'https://github.com/qiuweisen/image2minecraftskin-web',
  },
  auth: {
    enable: true,
    enableGoogleLogin: true,
    enableCredentialLogin: true,
    enableDeleteAccount: false,
  },
  blog: {
    enable: false,
    paginationSize: 6,
  },
  mail: {
    enable: false,
    provider: 'cloudflare',
  },
  newsletter: {
    enable: false,
    provider: 'resend',
    autoSubscribeAfterSignUp: true,
  },
  notification: {
    enable: false,
    provider: 'discord',
  },
  cache: {
    enable: false,
    provider: 'kv',
  },
  storage: {
    enable: false,
    provider: 'r2',
    maxFileSize: DEFAULT_MAX_FILE_SIZE,
    allowedTypes: DEFAULT_ALLOWED_TYPES,
    userFilesFolder: DEFAULT_USER_FILES_FOLDER,
  },
  credits: {
    enable: isStripePayment,
    costs: {
      'skin.kie': { kind: 'fixed', credits: 1, version: '1' },
      'demo.mock': { kind: 'fixed', credits: 1, version: '1' },
    },
    taskPolicy: {
      providerTimeoutMs: 120000,
      maxWindowMs: 900000,
      initialBackoffMs: 5000,
      maxBackoffMs: 30000,
    },
    registerGift: { amount: 0, expireDays: 365 },
    redemptionDefaultExpireDays: 90,
    reconcileSampleSize: 25,
    dailyFree: { enable: false, amount: 0 },
    packages: {
      ai_skin_15: {
        id: 'ai_skin_15',
        amount: 15,
        price: {
          priceId: aiSkinPriceIds.ai_skin_15,
          amount: 299,
          currency: 'USD',
        },
      },
      ai_skin_50: {
        id: 'ai_skin_50',
        amount: 50,
        price: {
          priceId: aiSkinPriceIds.ai_skin_50,
          amount: 699,
          currency: 'USD',
        },
      },
    },
  },
  payment: {
    enable: isPaymentEnabled,
    provider: isPaymentEnabled ? paymentProvider : undefined,
    price: {
      plans: {
        free: {
          id: 'free',
          prices: [],
          isFree: true,
          isLifetime: false,
          get name() {
            return m.pricing_plans_free_name();
          },
          get description() {
            return m.pricing_plans_free_description();
          },
          get features() {
            return [...getMessageList(m.pricing_plans_free_features())];
          },
          get limits() {
            return [...getMessageList(m.pricing_plans_free_limits())];
          },
        },
        pro: {
          id: 'pro',
          prices: [
            {
              type: 'subscription',
              priceId: priceIds.proMonthly,
              amount: 990,
              currency: 'USD',
              interval: 'month',
            },
            {
              type: 'subscription',
              priceId: priceIds.proYearly,
              amount: 9900,
              currency: 'USD',
              interval: 'year',
            },
          ],
          isFree: false,
          isLifetime: false,
          popular: true,
          get name() {
            return m.pricing_plans_pro_name();
          },
          get description() {
            return m.pricing_plans_pro_description();
          },
          get features() {
            return [...getMessageList(m.pricing_plans_pro_features())];
          },
          get limits() {
            return [...getMessageList(m.pricing_plans_pro_limits())];
          },
        },
        lifetime: {
          id: 'lifetime',
          prices: [
            {
              type: 'one_time',
              priceId: priceIds.lifetime,
              amount: 19900,
              currency: 'USD',
              allowPromotionCode: true,
            },
          ],
          isFree: false,
          isLifetime: true,
          get name() {
            return m.pricing_plans_lifetime_name();
          },
          get description() {
            return m.pricing_plans_lifetime_description();
          },
          get features() {
            return [...getMessageList(m.pricing_plans_lifetime_features())];
          },
          get limits() {
            return [...getMessageList(m.pricing_plans_lifetime_limits())];
          },
        },
      },
    },
  },
};
