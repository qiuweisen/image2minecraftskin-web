import { parseWranglerConfig } from './parse-wrangler';

const wranglerConfig = parseWranglerConfig();
const wranglerVars = wranglerConfig.vars;
const configuredBaseUrl =
  typeof wranglerVars === 'object' &&
  wranglerVars !== null &&
  'VITE_BASE_URL' in wranglerVars &&
  typeof wranglerVars.VITE_BASE_URL === 'string'
    ? wranglerVars.VITE_BASE_URL
    : undefined;
const baseUrl = process.env.VITE_BASE_URL || configuredBaseUrl;

if (!baseUrl) {
  throw new Error('VITE_BASE_URL is required for production builds.');
}

const url = new URL(baseUrl);
if (url.protocol !== 'https:' && url.protocol !== 'http:') {
  throw new Error('VITE_BASE_URL must use http or https.');
}

process.env.VITE_BASE_URL = url.toString().replace(/\/$/, '');

const { build } = await import('vite');
await build();
