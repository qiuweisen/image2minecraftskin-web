import { websiteConfig } from '@/config/website';

export type ToolPrice = (
  | { kind: 'fixed'; credits: number }
  | { kind: 'tier'; variantKey: string; tiers: Record<string, number> }
  | {
      kind: 'perUnit';
      unitKey: string;
      unitSize: number;
      creditsPerUnit: number;
      maxUnits: number;
      minCredits?: number;
    }
) & { version: string };

/** Called only with validated server-side params. Never accept a client cost. */
export function getToolCost(
  toolId: string,
  params: Record<string, unknown>,
  costs: Record<string, ToolPrice> = websiteConfig.credits?.costs ?? {}
) {
  const price = Object.hasOwn(costs, toolId) ? costs[toolId] : undefined;
  if (!price) throw new Error('UNKNOWN_TOOL');
  let amount: number;
  if (price.kind === 'fixed') amount = price.credits;
  else if (price.kind === 'tier') {
    const variant = params[price.variantKey];
    if (typeof variant !== 'string' || !Object.hasOwn(price.tiers, variant))
      throw new Error('UNKNOWN_VARIANT');
    amount = price.tiers[variant];
  } else {
    const units = params[price.unitKey];
    if (
      typeof units !== 'number' ||
      !Number.isFinite(units) ||
      units <= 0 ||
      units > price.maxUnits ||
      price.unitSize <= 0
    )
      throw new Error('INVALID_UNITS');
    amount = Math.max(
      price.minCredits ?? 1,
      Math.ceil(units / price.unitSize) * price.creditsPerUnit
    );
  }
  if (!Number.isSafeInteger(amount) || amount <= 0)
    throw new Error('INVALID_CREDIT_AMOUNT');
  return { amount, pricingVersion: price.version };
}
