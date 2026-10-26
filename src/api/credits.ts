import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { authApiMiddleware } from '@/middlewares/auth-middleware';
import { redeemCode } from '@/credits/redemption';
import { getUserCredits } from '@/credits/ledger';
import { getAllCreditPackages } from '@/credits/packages';

export const getCreditPackages = createServerFn({ method: 'GET' }).handler(() =>
  getAllCreditPackages().map((pkg) => ({
    id: pkg.id,
    amount: pkg.amount,
    price: {
      amount: pkg.price.amount,
      currency: pkg.price.currency,
      priceId: pkg.price.priceId,
    },
  }))
);

export const getCreditBalance = createServerFn({ method: 'GET' })
  .middleware([authApiMiddleware])
  .handler(({ context }) => getUserCredits(context.userId));

export const redeemCreditCode = createServerFn({ method: 'POST' })
  .validator(z.object({ code: z.string().min(1).max(64) }))
  .middleware([authApiMiddleware])
  .handler(({ data, context }) => redeemCode(context.userId, data.code));
