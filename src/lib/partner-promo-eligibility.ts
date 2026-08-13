export type PromoPartner = 'bitget' | 'ninjatrader';

export interface VisitorLocation {
  country?: string | null;
  region?: string | null;
  regionCode?: string | null;
}

// Sources:
// https://www.bitget.com/support/articles/360014944032-terms-of-use/
// https://www.bitget.com/support/articles/12560603850171
// Bitget Terms of Use, "Prohibited Countries" (updated 2026-02-04).
// India is additionally excluded because Bitget paused new-user onboarding there
// from 2026-02-06. Keep this list in sync with Bitget's official eligibility rules.
const BITGET_REGISTRATION_RESTRICTED_COUNTRIES = new Set([
  'AF', // Afghanistan
  'AT', // Austria
  'CA', // Canada
  'CD', // Democratic Republic of the Congo
  'CF', // Central African Republic
  'CU', // Cuba
  'DE', // Germany
  'FR', // France
  'GW', // Guinea-Bissau
  'HK', // Hong Kong
  'HT', // Haiti
  'IN', // India (new-user onboarding temporarily paused)
  'IQ', // Iraq
  'IR', // Iran
  'KP', // North Korea
  'KZ', // Kazakhstan
  'LB', // Lebanon
  'LY', // Libya
  'SD', // Sudan
  'SG', // Singapore
  'SO', // Somalia
  'SS', // South Sudan
  'US', // United States
  'YE', // Yemen

  // U.S. territories named in Bitget's Terms of Use.
  'AS', // American Samoa
  'GU', // Guam
  'MP', // Northern Mariana Islands
  'PR', // Puerto Rico
  'UM', // U.S. Minor Outlying Islands
  'VI', // U.S. Virgin Islands
]);

// Bitget separately names Crimea, Donetsk, and Luhansk as prohibited regions.
// Cloudflare returns the subdivision portion of ISO 3166-2 in regionCode.
const RESTRICTED_UKRAINE_REGION_CODES = new Set([
  '09', // Luhansk
  '14', // Donetsk
  '40', // Sevastopol (treated conservatively as part of Crimea)
  '43', // Autonomous Republic of Crimea
]);

const RESTRICTED_UKRAINE_REGION_NAMES = [
  'crimea',
  'donetsk',
  'luhansk',
  'sevastopol',
];

function normalizeCode(value?: string | null): string {
  return value?.trim().toUpperCase() ?? '';
}

function isRestrictedUkraineRegion(location: VisitorLocation): boolean {
  if (normalizeCode(location.country) !== 'UA') return false;

  const regionCode = normalizeCode(location.regionCode).replace(/^UA-/, '');
  if (RESTRICTED_UKRAINE_REGION_CODES.has(regionCode)) return true;

  const region = location.region?.trim().toLowerCase() ?? '';
  return RESTRICTED_UKRAINE_REGION_NAMES.some((name) => region.includes(name));
}

export function selectPromoPartner(location: VisitorLocation): PromoPartner {
  const country = normalizeCode(location.country);

  // Unknown locations and Tor traffic use the non-Bitget fallback.
  if (!/^[A-Z]{2}$/.test(country) || country === 'XX' || country === 'T1') {
    return 'ninjatrader';
  }

  if (
    BITGET_REGISTRATION_RESTRICTED_COUNTRIES.has(country) ||
    isRestrictedUkraineRegion(location)
  ) {
    return 'ninjatrader';
  }

  return 'bitget';
}
