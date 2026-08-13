// Centralized runtime config with sane defaults.
// Vite exposes client-safe values through VITE_* variables. The NEXT_PUBLIC_*
// names remain supported as a migration bridge for copied legacy modules.

function envValue(name: string): string | undefined {
  const env = import.meta.env as Record<string, unknown>;
  const value = env[name] ?? env[name.replace(/^NEXT_PUBLIC_/, 'VITE_')];
  return typeof value === 'string' ? value : undefined;
}

function intFromEnv(name: string, def: number): number {
  const raw = envValue(name);
  if (!raw) return def;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : def;
}

function floatFromEnv(name: string, def: number): number {
  const raw = envValue(name);
  if (!raw) return def;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : def;
}

// Legacy bundled-loading tuning knobs retained for env compatibility.
export const WINDOW_MONTHS_CAP = intFromEnv('NEXT_PUBLIC_WINDOW_MONTHS', 120);

// Legacy bundled-loading tuning knobs retained for env compatibility.
export const HEAD_MONTHS = intFromEnv('NEXT_PUBLIC_HEAD_MONTHS', 9);

// Optional hard cap for total candles kept in memory (0 disables cap).
export const MAX_CANDLES = intFromEnv('NEXT_PUBLIC_MAX_CANDLES', 0);

// Legacy network tuning for historical fetch utilities.
export const FETCH_CONCURRENCY = intFromEnv(
  'NEXT_PUBLIC_FETCH_CONCURRENCY',
  12
);

// Prefetch threshold (visible/total) to trigger background loading.
export const PREFETCH_THRESHOLD = floatFromEnv(
  'NEXT_PUBLIC_PREFETCH_THRESHOLD',
  0.6
);

// How many months to fetch per prefetch batch (defaults to concurrency).
export const PREFETCH_BATCH_MONTHS = intFromEnv(
  'NEXT_PUBLIC_PREFETCH_BATCH_MONTHS',
  FETCH_CONCURRENCY
);
