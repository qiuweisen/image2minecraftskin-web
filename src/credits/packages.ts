import { websiteConfig } from '@/config/website';
import type { CreditPackage } from '@/payment/types';

export function getAllCreditPackages(): CreditPackage[] {
  return Object.values(websiteConfig.credits?.packages ?? {});
}

export function getCreditPackageById(id: string): CreditPackage | undefined {
  return getAllCreditPackages().find((pkg) => pkg.id === id && !pkg.disabled);
}
